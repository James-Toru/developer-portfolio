import { profile } from "../content/profile";
import { CONTACT_FIELD_LIMITS, type ContactField, type ContactResponse } from "./contact-contract";

type Dependencies = {
  env: () => Record<string, string | undefined>;
  fetch: typeof fetch;
  now: () => number;
};
const MAX_BODY_BYTES = 64 * 1024;
const WINDOW_MS = 10 * 60 * 1000;
const GLOBAL_ATTEMPTS = 60;
const SINGLE_LINE_CONTROLS = /[\u0000-\u001f\u007f-\u009f\u2028\u2029]/;
const EMAIL = /^[a-zA-Z0-9.!#$%&'*+\-/=?^_`{|}~]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)+$/;

function validEmail(value: string) {
  const [local, domain] = value.split("@");
  return value.length <= CONTACT_FIELD_LIMITS.email && EMAIL.test(value) && local.length <= 64 &&
    !local.startsWith(".") && !local.endsWith(".") && !local.includes("..") &&
    domain.split(".").every((part) => part.length <= 63);
}

function reply(status: number, body: ContactResponse, extraHeaders?: Record<string, string>) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...extraHeaders } });
}
const failure = (status: number, error: string) => reply(status, { ok: false, error });

async function readBody(request: Request): Promise<unknown> {
  const declared = request.headers.get("content-length");
  if (declared && Number(declared) > MAX_BODY_BYTES) throw new RangeError();
  const reader = request.body?.getReader();
  if (!reader) throw new SyntaxError();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        void reader.cancel().catch(() => {});
        throw new RangeError();
      }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
}

function configuredOrigin(value: string | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    if (!["https:", "http:"].includes(url.protocol) || url.username || url.password || url.pathname !== "/" || url.search || url.hash) return undefined;
    return url.origin;
  } catch { return undefined; }
}

export function createContactHandler(dependencies: Dependencies) {
  // Each instance keeps at most 60 keys. Deny new traffic at capacity rather than
  // evicting active limits. This is process-local protection, not a shared quota.
  const emails = new Map<string, { count: number; expires: number }>();
  let global = { count: 0, expires: 0 };

  return async (request: Request): Promise<Response> => {
    const env = dependencies.env();
    const expectedOrigin = configuredOrigin(env.CONTACT_ORIGIN) ??
      (!env.CONTACT_ORIGIN && env.NODE_ENV !== "production" ? new URL(request.url).origin : undefined);
    if (!expectedOrigin) return failure(503, "The contact form is unavailable. Please use the email link.");
    if (request.headers.get("origin") !== expectedOrigin) return failure(403, "Please submit from this website.");
    if (request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase() !== "application/json") {
      return failure(415, "Please send the form as JSON.");
    }

    let body: unknown;
    try { body = await readBody(request); }
    catch (error) { return failure(error instanceof RangeError ? 413 : 400, error instanceof RangeError ? "The request is too large." : "The form could not be read."); }
    if (!body || typeof body !== "object" || Array.isArray(body)) return failure(400, "Please check the form fields.");
    const data = body as Record<string, unknown>;
    if (data.website !== undefined && (typeof data.website !== "string" || data.website.trim())) return failure(400, "The form could not be accepted.");
    const fields = {} as Record<ContactField, string>;
    const fieldErrors: Partial<Record<ContactField, string>> = {};
    for (const field of ["name", "email", "message"] as const) {
      const value = data[field];
      fields[field] = typeof value === "string" ? value.trim() : "";
      if (typeof value !== "string" || !fields[field]) fieldErrors[field] = "This field is required.";
      else if (fields[field].length > CONTACT_FIELD_LIMITS[field]) fieldErrors[field] = `Use ${CONTACT_FIELD_LIMITS[field]} characters or fewer.`;
      else if (field !== "message" && SINGLE_LINE_CONTROLS.test(value)) fieldErrors[field] = "Use a single line without control characters.";
    }
    if (!fieldErrors.email && !validEmail(fields.email)) fieldErrors.email = "Enter a valid email address.";
    if (Object.keys(fieldErrors).length) return reply(400, { ok: false, error: "Please check the form fields.", fieldErrors });

    const sender = env.CONTACT_FROM_EMAIL?.trim();
    const key = env.RESEND_API_KEY?.trim();
    if (!key || SINGLE_LINE_CONTROLS.test(key) || !sender || SINGLE_LINE_CONTROLS.test(env.CONTACT_FROM_EMAIL ?? "") || !validEmail(sender)) {
      return failure(503, "The contact form is unavailable. Please use the email link.");
    }

    const now = dependencies.now();
    for (const [email, entry] of emails) if (entry.expires <= now) emails.delete(email);
    if (global.expires <= now) global = { count: 0, expires: now + WINDOW_MS };
    const email = fields.email.toLowerCase();
    const entry = emails.get(email);
    if (global.count >= GLOBAL_ATTEMPTS || (entry && entry.count >= 3) || (!entry && emails.size >= GLOBAL_ATTEMPTS)) {
      const expires = global.count >= GLOBAL_ATTEMPTS ? global.expires : entry?.expires ?? global.expires;
      return reply(429, { ok: false, error: "Please wait before trying again, or use the email link." }, { "Retry-After": String(Math.max(1, Math.ceil((expires - now) / 1000))) });
    }
    // Count before awaiting the network so concurrent requests cannot bypass it.
    emails.set(email, { count: (entry?.count ?? 0) + 1, expires: entry?.expires ?? now + WINDOW_MS });
    global.count++;

    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<never>((_resolve, reject) => {
      timer = setTimeout(() => { controller.abort(); reject(new Error("timeout")); }, 10000);
    });
    try {
      const delivery = (async () => {
        const response = await dependencies.fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
          body: JSON.stringify({ from: sender, to: [profile.email], reply_to: fields.email, subject: `Portfolio enquiry from ${fields.name}`, text: `Name: ${fields.name}\nEmail: ${fields.email}\n\n${fields.message}` }),
          signal: controller.signal,
          cache: "no-store",
        });
        if (!response.ok) throw new Error("upstream");
        const acceptance: unknown = await response.json();
        if (!acceptance || typeof acceptance !== "object" || !("id" in acceptance) || typeof acceptance.id !== "string" || !acceptance.id.trim()) throw new Error("upstream");
      })();
      await Promise.race([delivery, timeout]);
      return reply(200, { ok: true });
    } catch {
      return failure(controller.signal.aborted ? 504 : 502, "Your message could not be accepted. Please try again or use the email link.");
    } finally { clearTimeout(timer); }
  };
}
