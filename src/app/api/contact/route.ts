import { createContactHandler } from "@/lib/contact-handler";

export const runtime = "nodejs";

export const POST = createContactHandler({
  env: () => process.env,
  fetch: (...args) => fetch(...args),
  now: Date.now,
});
