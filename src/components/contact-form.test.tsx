import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CONTACT_FIELD_LIMITS } from "@/lib/contact-contract";
import { ContactForm } from "./contact-form";

let container: HTMLDivElement;
let app: Root;
let request: ReturnType<typeof vi.fn<typeof fetch>>;
const draft = { name: "A Visitor", email: "visitor@example.com", message: "A project enquiry." };

function form() { const element = container.querySelector("form"); expect(element).not.toBeNull(); return element!; }
function input(name: string) { const element = container.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${name}"]`); expect(element).not.toBeNull(); return element!; }
function submit() { const element = container.querySelector<HTMLButtonElement>('button[type="submit"]'); expect(element).not.toBeNull(); return element!; }
const status = () => container.querySelector('[role="status"]')!;
async function render() { await act(async () => { app.render(<ContactForm />); }); }
function fill() { Object.entries(draft).forEach(([name, value]) => { input(name).value = value; }); }
async function send() { await act(async () => { form().dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })); }); }
function expectDraft() { Object.entries(draft).forEach(([name, value]) => { expect(input(name).value).toBe(value); }); }
function response(body: unknown, status = 200) { return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } }); }

beforeEach(() => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  request = vi.fn<typeof fetch>();
  vi.stubGlobal("fetch", request);
  container = document.createElement("div");
  document.body.append(container);
  app = createRoot(container);
});
afterEach(async () => {
  await act(async () => { app.unmount(); });
  container.remove();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("contact form", () => {
  it("disables server-rendered submission and keeps a noscript email fallback", () => {
    container.innerHTML = renderToString(<ContactForm />);
    expect(submit().disabled).toBe(true);
    expect(container.querySelector("noscript")?.textContent).toContain("mailto:gatorumbugua@gmail.com");
  });

  it("provides visible labels, shared limits, native validation and an inaccessible honeypot", async () => {
    await render();
    for (const name of ["name", "email", "message"] as const) {
      expect(container.querySelector(`label[for="${input(name).id}"]`)?.textContent).toContain(name[0].toUpperCase() + name.slice(1));
      expect(input(name).required).toBe(true);
      expect(input(name).maxLength).toBe(CONTACT_FIELD_LIMITS[name]);
    }
    expect(input("name").autocomplete).toBe("name");
    expect(input("email").autocomplete).toBe("email");
    expect(input("email").type).toBe("email");
    expect(input("website").tabIndex).toBe(-1);
    expect(input("website").closest('[aria-hidden="true"]')).not.toBeNull();
    expect(submit().disabled).toBe(false);
    await send();
    expect(request).not.toHaveBeenCalled();
    fill(); input("email").value = "invalid";
    await send();
    expect(request).not.toHaveBeenCalled();
  });

  it("posts the draft once and freezes all fields throughout rapid pending submits", async () => {
    let resolve!: (value: Response) => void;
    request.mockReturnValue(new Promise((done) => { resolve = done; }));
    await render(); fill();
    await act(async () => {
      form().dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
      form().dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    });
    await send();
    expect(request).toHaveBeenCalledTimes(1);
    const [url, options] = request.mock.calls[0];
    expect(url).toBe("/api/contact/");
    expect(options?.method).toBe("POST");
    expect(options?.credentials).toBe("same-origin");
    expect(options?.headers).toEqual({ "Content-Type": "application/json" });
    expect(JSON.parse(options?.body as string)).toEqual({ ...draft, website: "" });
    expect(form().querySelector("fieldset")?.getAttribute("aria-busy")).toBe("true");
    expect(status().closest('[aria-busy="true"]')).toBeNull();
    expect(status().textContent).toContain("Sending");
    for (const name of ["name", "email", "message", "website"]) expect(input(name).matches(":disabled")).toBe(true);
    expect(submit().disabled).toBe(true);
    await act(async () => { resolve(response({ ok: true })); });
    expect(submit().disabled).toBe(false);
  });

  it("clears only an accepted draft and announces acceptance without claiming inbox delivery", async () => {
    request.mockResolvedValue(response({ ok: true }));
    await render(); fill(); await send();
    for (const name of Object.keys(draft)) expect(input(name).value).toBe("");
    expect(status().textContent).toContain("Message sent");
    expect(status().textContent).toContain("accepted for delivery");
    expect(status().textContent).not.toMatch(/delivered to.*inbox/i);
  });

  it("opens a nonmodal success confirmation only after provider acceptance", async () => {
    request.mockResolvedValue(response({ ok: true }));
    await render(); fill(); await send();
    expect(container.querySelector(".contact-confirmation h3")?.textContent).toBe("Message sent.");
    expect(container.querySelector(".contact-confirmation")?.getAttribute("aria-modal")).toBeNull();
    expect(container.querySelector(".contact-confirmation [role='dialog']")).toBeNull();
    expect(container.querySelector(".contact-confirmation button")?.getAttribute("aria-label")).toBe("Dismiss confirmation");
    expect(document.activeElement).not.toBe(container.querySelector(".contact-confirmation button"));
  });

  it("dismisses the popup without losing the inline confirmation or submitting again", async () => {
    request.mockResolvedValue(response({ ok: true }));
    await render(); fill(); await send();
    const dismiss = container.querySelector<HTMLButtonElement>('.contact-confirmation button');
    expect(dismiss).not.toBeNull();
    dismiss!.focus();
    await act(async () => { dismiss!.click(); });
    expect(container.querySelector(".contact-confirmation")).toBeNull();
    expect(status().textContent).toContain("accepted for delivery");
    expect(document.activeElement).toBe(submit());
    expect(request).toHaveBeenCalledTimes(1);
  });

  it("closes on Escape and returns popup keyboard focus without losing a new draft", async () => {
    request.mockResolvedValue(response({ ok: true }));
    await render(); fill(); await send();
    expect(container.querySelector(".contact-confirmation")).not.toBeNull();
    input("message").value = "A follow-up draft.";
    container.querySelector<HTMLButtonElement>(".contact-confirmation button")!.focus();
    await act(async () => { document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })); });
    expect(container.querySelector(".contact-confirmation")).toBeNull();
    expect(input("message").value).toBe("A follow-up draft.");
    expect(document.activeElement).toBe(submit());
    expect(request).toHaveBeenCalledTimes(1);
  });

  it("dismisses when returning to a field so the popup cannot obscure continued editing", async () => {
    request.mockResolvedValue(response({ ok: true }));
    await render(); fill(); await send();
    expect(container.querySelector(".contact-confirmation")).not.toBeNull();
    input("message").value = "A new enquiry draft.";
    await act(async () => { input("message").focus(); });
    expect(container.querySelector(".contact-confirmation")).toBeNull();
    expect(input("message").value).toBe("A new enquiry draft.");
    expect(document.activeElement).toBe(input("message"));
    expect(request).toHaveBeenCalledTimes(1);
  });

  it("removes an old success popup when a later submission fails", async () => {
    request.mockResolvedValueOnce(response({ ok: true }));
    request.mockResolvedValueOnce(response({ ok: false, error: "Sending is unavailable." }, 503));
    await render(); fill(); await send();
    expect(container.querySelector(".contact-confirmation")).not.toBeNull();
    fill(); await send();
    expect(container.querySelector(".contact-confirmation")).toBeNull();
    expectDraft();
    expect(status().textContent).toContain("unavailable");
  });

  it("preserves an unavailable draft and permits an explicit successful retry", async () => {
    request.mockResolvedValueOnce(response({ ok: false, error: "Message sending is unavailable. Please use the email link." }, 503));
    request.mockResolvedValueOnce(response({ ok: true }));
    await render(); fill(); await send();
    expectDraft();
    expect(status().textContent).toContain("unavailable");
    expect(status().querySelector('a[href="mailto:gatorumbugua@gmail.com"]')).not.toBeNull();
    expect(submit().disabled).toBe(false);
    expect(request).toHaveBeenCalledTimes(1);
    await send();
    expect(request).toHaveBeenCalledTimes(2);
    expect(input("message").value).toBe("");
  });

  it("associates authoritative field errors and focuses the first invalid field", async () => {
    request.mockResolvedValue(response({ ok: false, error: "Please check the form fields.", fieldErrors: { email: "Enter a valid email address." } }, 400));
    await render(); fill(); await send();
    expectDraft();
    expect(input("email").getAttribute("aria-invalid")).toBe("true");
    const errorId = input("email").getAttribute("aria-describedby")!;
    expect(document.getElementById(errorId)?.textContent).toBe("Enter a valid email address.");
    expect(document.activeElement).toBe(input("email"));
    expect(status().textContent).toContain("Please check");
  });

  it.each([
    ["network rejection", () => Promise.reject(new TypeError("Network unavailable"))],
    ["invalid JSON", () => Promise.resolve(new Response("<html>Error</html>", { status: 502 }))],
    ["missing contract", () => Promise.resolve(response({ message: "accepted" }))],
    ["invalid field errors", () => Promise.resolve(response({ ok: false, error: "Bad", fieldErrors: { email: 5 } }, 400))],
    ["non-success HTTP with success body", () => Promise.resolve(response({ ok: true }, 503))],
  ])("preserves the draft and offers recovery on %s", async (_name, result) => {
    request.mockImplementation(result);
    await render(); fill(); await send();
    expectDraft();
    expect(submit().disabled).toBe(false);
    expect(status().textContent).toContain("could not confirm");
    expect(status().textContent).toContain("draft");
    expect(status().querySelector("a")).not.toBeNull();
  });

  it("aborts after 15 seconds without losing the draft or automatically retrying", async () => {
    vi.useFakeTimers();
    request.mockImplementation((_url, options) => new Promise((_resolve, reject) => {
      options?.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
    }));
    await render(); fill(); await send();
    await act(async () => { await vi.advanceTimersByTimeAsync(15_000); });
    expect(request.mock.calls[0][1]?.signal?.aborted).toBe(true);
    expectDraft();
    expect(submit().disabled).toBe(false);
    expect(status().textContent).toContain("timed out");
    expect(request).toHaveBeenCalledTimes(1);
  });

  it("aborts an active request on unmount", async () => {
    request.mockImplementation((_url, options) => new Promise((_resolve, reject) => {
      options?.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
    }));
    await render(); fill(); await send();
    await act(async () => { app.unmount(); });
    app = createRoot(container);
    expect(request.mock.calls[0][1]?.signal?.aborted).toBe(true);
  });
});
