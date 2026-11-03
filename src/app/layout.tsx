import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteMotion } from "@/components/site-motion";
import { FloatingBackground } from "@/components/floating-background";
import { EffectsControl } from "@/components/effects-control";
import { BackToTop } from "@/components/back-to-top";
import "./globals.css";
import "@/styles/contact.css";
import "@/styles/motion.css";

export const metadata: Metadata = {
  title: { default: "James Gatoru — Software Developer & AI Agentic Engineer", template: "%s — James Gatoru" },
  description: "James Gatoru builds web applications and AI workflows, connecting responsive interfaces, backend systems and human oversight. Explore his work and get in touch.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/fonts/barlow-condensed-800-italic-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/exo-2-400-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        <FloatingBackground />
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteHeader />
        {children}
        <footer className="site-footer"><a href="/">James / Toru</a><span>© {new Date().getFullYear()} James Gatoru. All rights reserved.</span><EffectsControl /><a href="/james-gatoru-cv.pdf" download="James Gatoru Curriculum Vitae.pdf">Download CV <span className="file-label">(PDF)</span></a></footer>
        <SiteMotion />
        <BackToTop />
      </body>
    </html>
  );
}
