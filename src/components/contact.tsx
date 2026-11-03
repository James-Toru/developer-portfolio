import { profile } from "@/content/profile";
import { Arrow } from "./arrow";
import { ContactForm } from "./contact-form";
import { SocialLinks } from "./social-links";

export function Contact() {
  return <section id="contact" className="contact-band" aria-labelledby="contact-title">
    <div className="content-width contact-layout">
      <div className="contact-intro">
        <h2 id="contact-title">Let’s build something.</h2>
        <p className="contact-description">Have a project in mind? Send a message or email me directly.</p>
        <a className="contact-email" href={`mailto:${profile.email}`}>{profile.email}<Arrow /></a>
        <SocialLinks />
      </div>
      <ContactForm />
    </div>
  </section>;
}
