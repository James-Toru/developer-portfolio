import { skillGroups } from "@/content/skills";
import { Arrow } from "@/components/arrow";

export function Skills() {
  return (
    <section id="skills" className="skills-section content-section" aria-labelledby="skills-title">
      <div className="content-width">
        <div className="skills-heading">
          <h2 id="skills-title" className="section-title">Skills</h2>
          <p>A connected toolchain for web applications and supervised AI.</p>
        </div>
        <div className="skills-toolchain">
          {skillGroups.map((group) => (
            <article className={`skills-group skills-group--${group.id}`} key={group.id} aria-labelledby={`skills-${group.id}-title`}>
              <h3 id={`skills-${group.id}-title`}>{group.title}</h3>
              <p className="skills-group-description">{group.description}</p>
              <ul className="skills-tools">
                {group.tools.map((tool) => <li key={tool}>{tool}</li>)}
              </ul>
              {group.evidence && (
                <a className="skills-evidence text-link" href={group.evidence.href}>{group.evidence.label}<Arrow /></a>
              )}
            </article>
          ))}
        </div>
        <div className="skills-footer">
          <p>See the toolchain in practice.</p>
          <a className="text-link" href="/work/">Explore all work <Arrow /></a>
        </div>
      </div>
    </section>
  );
}
