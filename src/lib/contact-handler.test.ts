// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { createContactHandler } from "./contact-handler";

const valid = { name: " Ada Lovelace ", email: " ada@example.com ", message: " Hello\n<world> & friends " };
const env = { RESEND_API_KEY: "test-key-not-real", CONTACT_FROM_EMAIL: "contact@example.com", CONTACT_ORIGIN: "https://portfolio.test", NODE_ENV: "production" };
function request(body: unknown = valid, headers: Record<string, string> = {}) {
  return new Request("https://portfolio.test/api/contact/", { method: "POST", headers: { origin: "https://portfolio.test", "content-type": "application/json", ...headers }, body: JSON.stringify(body) });
}
function setup(config = env) {
  const fetcher = vi.fn<typeof fetch>().mockImplementation(async () => Response.json({ id: "email-123" }));
  let time = 0;
  const handle = createContactHandler({ env: () => config, fetch: fetcher, now: () => time });
  return { handle, fetcher, advance: (ms: number) => { time += ms; } };
}
afterEach(() => vi.useRealTimers());

describe("contact delivery", () => {
  it("sends trimmed plain text to the fixed inbox and cannot accept visitor recipient/sender overrides", async () => {
    const { handle, fetcher } = setup();
    const response = await handle(request({ ...valid, to: "attacker@example.com", from: "attacker@example.com" }));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(response.headers.get("cache-control")).toBe("no-store");
    const [url, options] = fetcher.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    expect(options?.headers).toMatchObject({ Authorization: "Bearer test-key-not-real" });
    expect(JSON.parse(options?.body as string)).toEqual({ from: "contact@example.com", to: ["gatorumbugua@gmail.com"], reply_to: "ada@example.com", subject: "Portfolio enquiry from Ada Lovelace", text: "Name: Ada Lovelace\nEmail: ada@example.com\n\nHello\n<world> & friends" });
  });

  it.each([
    [null, undefined], [[], undefined], [{}, "name"], [{ ...valid, name: 3 }, "name"],
    [{ ...valid, name: " " }, "name"], [{ ...valid, email: false }, "email"],
    [{ ...valid, message: [] }, "message"], [{ ...valid, name: "a".repeat(101) }, "name"],
    [{ ...valid, email: `${"a".repeat(243)}@example.com` }, "email"], [{ ...valid, message: "a".repeat(5001) }, "message"],
    [{ ...valid, name: "Ada\r\nBcc: other@example.com" }, "name"], [{ ...valid, name: "Ada\u0000" }, "name"],
    [{ ...valid, email: "ada@example.com\nBcc: a@example.com" }, "email"], [{ ...valid, email: "a@b" }, "email"],
    [{ ...valid, email: "a,b@example.com" }, "email"], [{ ...valid, message: " " }, "message"],
  ])("rejects malformed/invalid fields %# without sending", async (body, field) => {
    const { handle, fetcher } = setup();
    const response = await handle(request(body));
    expect(response.status).toBe(400);
    const result = await response.json();
    expect(result.ok).toBe(false);
    if (field) expect(result.fieldErrors[field]).toEqual(expect.any(String));
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("accepts the field limits and rejects invalid JSON", async () => {
    const { handle } = setup();
    expect((await handle(request({ name: "a".repeat(100), email: `${"a".repeat(64)}@${"b".repeat(63)}.${"c".repeat(63)}.${"d".repeat(61)}`, message: "a".repeat(5000) }))).status).toBe(200);
    const malformed = new Request("https://portfolio.test/api/contact/", { method: "POST", headers: { origin: "https://portfolio.test", "content-type": "application/json" }, body: "{" });
    expect((await handle(malformed)).status).toBe(400);
  });

  it("bounds declared, escaped, and multibyte streamed byte sizes before parsing", async () => {
    const { handle, fetcher } = setup();
    expect((await handle(request(valid, { "content-length": "65537" }))).status).toBe(413);
    for (const text of [JSON.stringify({ ...valid, extra: "é".repeat(33000) }), `{"message":"${"\\u0061".repeat(11000)}"}`]) {
      const bytes = new TextEncoder().encode(text);
      let cancelled = false;
      const stream = new ReadableStream<Uint8Array>({ start(controller) { controller.enqueue(bytes.slice(0, 32000)); controller.enqueue(bytes.slice(32000)); }, cancel() { cancelled = true; } });
      const incoming = new Request("https://portfolio.test/api/contact/", { method: "POST", headers: { origin: "https://portfolio.test", "content-type": "application/json", "content-length": "10" }, body: stream, duplex: "half" } as RequestInit);
      expect((await handle(incoming)).status).toBe(413);
      expect(cancelled).toBe(true);
    }
    expect(fetcher).not.toHaveBeenCalled();
  });

  it.each(["https://attacker.test", "null", "https://portfolio.test.attacker.test", ""])("rejects wrong or missing origin %s", async (origin) => {
    const { handle, fetcher } = setup();
    expect((await handle(request(valid, { origin }))).status).toBe(403);
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("requires JSON media type, while permitting charset", async () => {
    const { handle } = setup();
    expect((await handle(request(valid, { "content-type": "text/plain" }))).status).toBe(415);
    expect((await handle(request(valid, { "content-type": "application/json; charset=utf-8" }))).status).toBe(200);
  });

  it("returns a no-send failure for honeypot content or invalid honeypot type", async () => {
    const { handle, fetcher } = setup();
    for (const website of ["bot.example", 42]) {
      const response = await handle(request({ ...valid, website }));
      expect(response.status).toBe(400);
      expect((await response.json()).ok).toBe(false);
    }
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("limits normalized email attempts to three, ignores spoofed proxy headers and expires after ten minutes", async () => {
    const { handle, fetcher, advance } = setup();
    for (let i = 0; i < 3; i++) expect((await handle(request(valid))).status).toBe(200);
    const blocked = await handle(request({ ...valid, email: "ADA@EXAMPLE.COM" }, { "x-forwarded-for": "new-ip" }));
    expect(blocked.status).toBe(429);
    expect(Number(blocked.headers.get("retry-after"))).toBeGreaterThan(0);
    expect(fetcher).toHaveBeenCalledTimes(3);
    advance(600000);
    expect((await handle(request(valid))).status).toBe(200);
  });

  it("caps distinct-email attempts globally, does not evict live limits and reclaims expired capacity", async () => {
    const { handle, fetcher, advance } = setup();
    for (let i = 0; i < 60; i++) expect((await handle(request({ ...valid, email: `person${i}@example.com` }))).status).toBe(200);
    for (let i = 60; i < 70; i++) expect((await handle(request({ ...valid, email: `person${i}@example.com` }))).status).toBe(429);
    expect(fetcher).toHaveBeenCalledTimes(60);
    advance(600000);
    expect((await handle(request({ ...valid, email: "new@example.com" }))).status).toBe(200);
  });

  it.each([
    { ...env, RESEND_API_KEY: "" }, { ...env, CONTACT_FROM_EMAIL: "" },
    { ...env, CONTACT_FROM_EMAIL: "a@example.com\nBcc: b@example.com" },
    { ...env, CONTACT_ORIGIN: "" }, { ...env, CONTACT_ORIGIN: "https://portfolio.test/path" },
  ])("reports unavailable for missing or invalid server configuration %#", async (config) => {
    const { handle, fetcher } = setup(config);
    const response = await handle(request());
    expect(response.status).toBe(503);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("allows request-origin fallback only in local development/test", async () => {
    const { handle } = setup({ ...env, CONTACT_ORIGIN: "", NODE_ENV: "development" });
    expect((await handle(request())).status).toBe(200);
  });

  it.each([new Response("sensitive provider failure", { status: 422 }), Response.json({ error: "secret" }), Response.json({ id: "" }), new Response("invalid JSON")])("requires a provider acceptance id and hides upstream response %#", async (provider) => {
    const { handle, fetcher } = setup();
    fetcher.mockResolvedValue(provider);
    const response = await handle(request());
    expect(response.status).toBe(502);
    expect(await response.text()).not.toMatch(/sensitive|secret|invalid JSON/);
  });

  it("hides network errors and counts failed delivery attempts toward throttling", async () => {
    const { handle, fetcher } = setup();
    fetcher.mockRejectedValue(new Error("secret network failure"));
    for (let i = 0; i < 3; i++) {
      const response = await handle(request());
      expect(response.status).toBe(502);
      expect(await response.text()).not.toContain("secret");
    }
    expect((await handle(request())).status).toBe(429);
  });

  it("aborts a provider fetch after ten seconds and also times out a stalled response body", async () => {
    vi.useFakeTimers();
    for (const stalledBody of [false, true]) {
      const { handle, fetcher } = setup();
      fetcher.mockImplementation(async (_url, options) => {
        if (stalledBody) return new Response(new ReadableStream({ start() {} }));
        return new Promise((_resolve, reject) => options?.signal?.addEventListener("abort", () => reject(new DOMException("secret", "AbortError"))));
      });
      const pending = handle(request());
      await vi.advanceTimersByTimeAsync(10000);
      const response = await pending;
      expect(response.status).toBe(504);
      expect(await response.text()).not.toContain("secret");
      expect(fetcher.mock.calls[0][1]?.signal?.aborted).toBe(true);
    }
  });
});
