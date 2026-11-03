import { profile } from "@/content/profile";
import "@/styles/experience.css";

const monthNumbers: Readonly<Record<string, string>> = {
  January: "01", February: "02", March: "03", April: "04", May: "05", June: "06",
  July: "07", August: "08", September: "09", October: "10", November: "11", December: "12",
};

function CareerDate({ value }: { value: string }) {
  const [month, year] = value.split(" ");
  const monthNumber = monthNumbers[month];
  return monthNumber && year
    ? <time dateTime={`${year}-${monthNumber}`}>{value}</time>
    : <span>{value}</span>;
}

export function Experience() {
  return (
    <section id="experience" className="content-section content-width" aria-labelledby="experience-title">
      <div className="career-layout">
        <h2 id="experience-title" className="section-title">Experience</h2>
        <ol className="career-route" aria-label="Career history, most recent first" role="list">
          {profile.experience.map((item, index) => {
            const [start, end] = item.period.split("–");
            const isCurrent = end === "present";
            return (
              <li className={`career-stop${isCurrent ? " career-stop-current" : ""}`} key={item.organization}>
                <article className="career-entry" aria-labelledby={`career-role-${index}`}>
                  <p className="career-period"><CareerDate value={start} />–<CareerDate value={end} /></p>
                  <div className="career-copy">
                    <h3 id={`career-role-${index}`} className="career-role">{item.role}</h3>
                    <div className="career-organization-line">
                      <p className="career-organization">{item.organization}</p>
                      {isCurrent && <span className="career-current-label">Current role</span>}
                    </div>
                    <p className="career-summary">{item.summary}</p>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
