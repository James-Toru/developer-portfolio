import { useEffect, useId, useState } from "react";

export function ContactConfirmation({ open, onDismiss }: { open: boolean; onDismiss: () => void }) {
  const titleId = useId();
  const [present, setPresent] = useState(open);
  const [previousOpen, setPreviousOpen] = useState(open);

  // Reopening keeps the same surface and reverses its CSS fade without waiting
  // for an effect; the previous exit timer is cleaned up after this commit.
  if (open !== previousOpen) {
    setPreviousOpen(open);
    if (open) setPresent(true);
  }

  useEffect(() => {
    if (open || !present) return;
    const exit = setTimeout(() => setPresent(false), 180);
    return () => clearTimeout(exit);
  }, [open, present]);

  useEffect(() => {
    if (!open) return;
    function dismissOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !event.defaultPrevented) onDismiss();
    }
    document.addEventListener("keydown", dismissOnEscape);
    const autoDismiss = setTimeout(onDismiss, 5_000);
    return () => {
      document.removeEventListener("keydown", dismissOnEscape);
      clearTimeout(autoDismiss);
    };
  }, [open, onDismiss]);

  if (!present) return null;
  const state = open ? "open" : "closing";

  return <><div className="contact-confirmation-backdrop" data-state={state} aria-hidden="true" /><aside className="contact-confirmation" data-state={state} aria-labelledby={titleId} aria-hidden={!open || undefined}>
    <svg className="contact-confirmation-icon" width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path className="confirmation-frame" d="M12 2h24l10 10v24L36 46H12L2 36V12Z" stroke="currentColor" strokeWidth="1" />
      <path className="confirmation-check" d="m14 24 7 7 14-15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <div className="contact-confirmation-copy">
      <h3 id={titleId}>Message sent.</h3>
      <p>Your message is on its way. Thanks for getting in touch.</p>
    </div>
    <button className="contact-confirmation-close" type="button" aria-label="Dismiss confirmation" onClick={onDismiss} disabled={!open}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="2" /></svg>
    </button>
  </aside></>;
}
