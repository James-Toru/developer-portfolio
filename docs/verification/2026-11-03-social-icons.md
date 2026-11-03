# Contact and footer social icons

Replaced the contact section's GitHub/LinkedIn text-and-arrow links with filled inline SVG icons and added the same server-rendered component to the shared footer. Existing destinations and native same-tab link behavior are unchanged. Each icon has a 44×44px target, aria-label and native title; decorative SVGs are aria-hidden and nonfocusable. Footer spacing wraps naturally and preserves the final CV link's reserved back-to-top clearance. No new client runtime, icon font or dependency was added.

Fresh production build passed. All 17 initial-HTML tests passed. Static checker: 17 pages, 13 project pages and zero errors. Additional initial-HTML assertions verified two labeled icon links in the homepage/archive contact sections and in homepage/archive/project/recovery footers, with no visible text labels inside the links.

Browser inspection at 390×844 and 1440×1000 confirmed all four homepage icon targets compute to 44×44px and the document has no horizontal overflow. Keyboard Tab moves between the footer icons; focused LinkedIn has a solid outline and cyan foreground. Captures remain in ignored tmp/social-icons/mobile-footer.png and desktop.png. Local IAB desktop captures have lower raster clarity than the mobile capture, so sizing/focus checks also use computed geometry. No real email or external profile navigation was triggered.
