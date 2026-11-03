import { useEffect, useId } from "react";

export function ContactConfirmation({ onDismiss }: { onDismiss: () => void }) {
  const titleId = useId();

  useEffect(() => {
    function dismissOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !event.defaultPrevented) onDismiss();
    }
    document.addEventListener("keydown", dismissOnEscape);
    return () => document.removeEventListener("keydown", dismissOnEscape);
  }, [onDismiss]);

  return <aside className="contact-confirmation" aria-labelledby={titleId}>
    <svg className="contact-confirmation-icon" width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path className="confirmation-frame" d="M12 2h24l10 10v24L36 46H12L2 36V12Z" stroke="currentColor" strokeWidth="1" />
      <path className="confirmation-check" d="m14 24 7 7 14-15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <div className="contact-confirmation-copy">
      <h3 id={titleId}>Message sent.</h3>
      <p>Your message is on its way. Thanks for getting in touch.</p>
    </div>
    <button className="contact-confirmation-close" type="button" aria-label="Dismiss confirmation" onClick={onDismiss}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="2" /></svg>
    </button>
  </aside>;
}
