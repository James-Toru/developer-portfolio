"use client";

import { useRef } from "react";
import "@/styles/header.css";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#about", label: "About" },
  { href: "/#experience", label: "Experience" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader() {
  const menu = useRef<HTMLDetailsElement>(null);
  const trigger = useRef<HTMLElement>(null);

  function closeMenu(restoreFocus = false) {
    if (menu.current) menu.current.open = false;
    if (restoreFocus) trigger.current?.focus();
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="wordmark" href="/" aria-label="James Gatoru home">
          JAMES <span>/</span> TORU
        </a>
        <span className="header-rule" aria-hidden="true" />
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(({ href, label }) => <a href={href} key={href}>{label}</a>)}
        </nav>
        <details className="mobile-menu" ref={menu} onKeyDown={(event) => {
          if (event.key === "Escape" && menu.current?.open) {
            event.preventDefault();
            closeMenu(true);
          }
        }}>
          <summary ref={trigger}>
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
            Menu
          </summary>
          <nav aria-label="Mobile navigation">
            {links.map(({ href, label }) => <a href={href} key={href} onClick={() => closeMenu()}>{label}</a>)}
          </nav>
        </details>
      </div>
    </header>
  );
}
