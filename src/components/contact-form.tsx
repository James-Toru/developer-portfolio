"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { profile } from "@/content/profile";
import { CONTACT_FIELD_LIMITS, type ContactField, type ContactResponse } from "@/lib/contact-contract";
import { Arrow } from "./arrow";
import { ContactConfirmation } from "./contact-confirmation";

type FieldErrors = Partial<Record<ContactField, string>>;
type Feedback = { kind: "idle" | "pending" | "success" | "error"; message: string };
const fields = ["name", "email", "message"] as const;

function isContactResponse(value: unknown): value is ContactResponse {
  if (!value || typeof value !== "object" || !("ok" in value)) return false;
  if (value.ok === true) return true;
  if (value.ok !== false || !("error" in value) || typeof value.error !== "string") return false;
  if (!("fieldErrors" in value) || value.fieldErrors === undefined) return true;
  return !!value.fieldErrors && typeof value.fieldErrors === "object" && !Array.isArray(value.fieldErrors)
    && Object.entries(value.fieldErrors).every(([field, error]) => fields.includes(field as ContactField) && typeof error === "string");
}

export function ContactForm() {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const readyRef = useRef(false);
  const activeRequest = useRef<AbortController | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [ready, setReady] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>({ kind: "idle", message: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const pending = feedback.kind === "pending";

  useEffect(() => {
    readyRef.current = true;
    setReady(true);
    return () => {
      readyRef.current = false;
      activeRequest.current?.abort();
      clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const firstError = fields.find((field) => errors[field]);
    if (firstError && !pending) formRef.current?.querySelector<HTMLElement>(`[name="${firstError}"]`)?.focus();
  }, [errors, pending]);

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    // The ref closes the gap before React commits the disabled state.
    if (!readyRef.current || activeRequest.current || !form.reportValidity()) return;
    const data = new FormData(form);
    const controller = new AbortController();
    activeRequest.current = controller;
    setShowConfirmation(false);
    setErrors({});
    setFeedback({ kind: "pending", message: "Sending your message…" });
    let timedOut = false;
    timeoutRef.current = setTimeout(() => { timedOut = true; controller.abort(); }, 15_000);

    try {
      const response = await fetch("/api/contact/", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries([...fields, "website"].map((field) => [field, data.get(field)]))),
        signal: controller.signal,
      });
      const result: unknown = await response.json();
      if (!readyRef.current) return;
      if (!isContactResponse(result) || (!response.ok && result.ok)) throw new Error("Unconfirmed response");
      if (response.ok && result.ok) {
        form.reset();
        setFeedback({ kind: "success", message: "Message sent — accepted for delivery. Thank you for getting in touch." });
        setShowConfirmation(true);
      } else if (!result.ok) {
        setErrors(result.fieldErrors ?? {});
        setFeedback({ kind: "error", message: `${result.error} Your draft is still here.` });
      }
    } catch {
      if (!readyRef.current) return;
      setFeedback({ kind: "error", message: timedOut
        ? "The request timed out. We could not confirm sending. Your draft is still here; try again or email me directly."
        : "We could not confirm sending. Your draft is still here; try again or email me directly." });
    } finally {
      clearTimeout(timeoutRef.current);
      activeRequest.current = null;
    }
  }

  function fieldError(field: ContactField) {
    return errors[field] ? <p className="contact-field-error" id={`${id}-${field}-error`}>{errors[field]}</p> : null;
  }
  function accessibility(field: ContactField) {
    return { "aria-invalid": errors[field] ? true as const : undefined, "aria-describedby": errors[field] ? `${id}-${field}-error` : undefined };
  }

  function dismissConfirmation() {
    const focusWasInPopup = document.activeElement?.closest(".contact-confirmation");
    setShowConfirmation(false);
    if (focusWasInPopup) formRef.current?.querySelector<HTMLButtonElement>('button[type="submit"]')?.focus();
  }

  return <><form className="contact-form" ref={formRef} onSubmit={send} aria-label="Send an enquiry" onFocusCapture={(event) => {
    if (showConfirmation && (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement)) setShowConfirmation(false);
  }}>
    <p className="contact-form-note">All fields are required.</p>
    <fieldset disabled={pending} aria-busy={pending}>
      <legend className="contact-sr-only">Your enquiry</legend>
      <div className="contact-identity-fields">
        <div className="contact-field">
          <label htmlFor={`${id}-name`}>Name</label>
          <input id={`${id}-name`} name="name" type="text" autoComplete="name" required maxLength={CONTACT_FIELD_LIMITS.name} {...accessibility("name")} />
          {fieldError("name")}
        </div>
        <div className="contact-field">
          <label htmlFor={`${id}-email`}>Email</label>
          <input id={`${id}-email`} name="email" type="email" autoComplete="email" required maxLength={CONTACT_FIELD_LIMITS.email} {...accessibility("email")} />
          {fieldError("email")}
        </div>
      </div>
      <div className="contact-field">
        <label htmlFor={`${id}-message`}>Message</label>
        <textarea id={`${id}-message`} name="message" rows={6} required maxLength={CONTACT_FIELD_LIMITS.message} {...accessibility("message")} />
        {fieldError("message")}
      </div>
      <div className="contact-honeypot" aria-hidden="true">
        <label htmlFor={`${id}-website`}>Leave this field empty</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <button type="submit" className="button contact-submit" disabled={!ready || pending}>{pending ? "Sending…" : "Send message"}<Arrow /></button>
    </fieldset>
    <div className="contact-status" role="status" aria-live="polite" aria-atomic="true" data-state={feedback.kind}>
      {feedback.message && <p className={showConfirmation && feedback.kind === "success" ? "contact-sr-only" : undefined}>{feedback.message}{feedback.kind === "error" && <> <a href={`mailto:${profile.email}`}>Email {profile.email}</a></>}</p>}
    </div>
    <noscript><p className="contact-noscript">Sending through this form needs JavaScript. <a href={`mailto:${profile.email}`}>Email {profile.email}</a> instead.</p></noscript>
  </form>{showConfirmation && <ContactConfirmation onDismiss={dismissConfirmation} />}</>;
}
