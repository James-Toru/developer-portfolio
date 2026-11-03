export type ContactField = "name" | "email" | "message";

export const CONTACT_FIELD_LIMITS = { name: 100, email: 254, message: 5000 } as const;

export type ContactResponse =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Partial<Record<ContactField, string>> };
