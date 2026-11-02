import { profile } from "@/content/profile";

export function Experience() {
  return <section id="experience" className="content-section content-width" aria-labelledby="experience-title">
    <div className="experience-layout"><h2 id="experience-title" className="section-title">Experience</h2>
      <div className="experience-list">{profile.experience.map((item) => <article className="experience-row" key={item.organization}>
        <p className="experience-period">{item.period}</p><div><h3>{item.role}</h3><p className="organization">{item.organization}</p><p>{item.summary}</p></div>
      </article>)}</div>
    </div>
  </section>;
}
