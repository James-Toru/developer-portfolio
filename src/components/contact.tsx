import { profile } from "@/content/profile";
import { Arrow } from "./arrow";

export function Contact() {
  return <section id="contact" className="contact-band" aria-labelledby="contact-title">
    <div className="content-width"><h2 id="contact-title">Let’s build something.</h2><a className="contact-email" href={`mailto:${profile.email}`}>{profile.email}<Arrow /></a><div className="social-links">{profile.socialLinks.map((link) => <a href={link.href} key={link.label}>{link.label}<Arrow /></a>)}</div></div>
  </section>;
}
