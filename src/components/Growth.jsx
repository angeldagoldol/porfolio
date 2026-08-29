import { CheckCircleIcon } from "@phosphor-icons/react/CheckCircle";
import { SparkleIcon } from "@phosphor-icons/react/Sparkle";
import portfolioData from "../data/portfolioData";
import SectionHeading from "./SectionHeading";

export default function Growth() {
  return (
    <section className="content-section growth-section" id="growth">
      <div className="site-container">
        <SectionHeading
          number="04"
          label="Learning journey"
          title="Progress is personal. Growth is something we share."
          description="These achievements use only the information each member supplied."
        />

        <div className="growth-layout">
          <figure className="growth-scene" data-reveal>
            <picture>
              <img
                src={portfolioData.heroSceneImage}
                srcSet={portfolioData.heroSceneSources}
                sizes="(max-width: 980px) 92vw, 44vw"
                alt="A cinematic student desk with a laptop and guitar, representing learning and creative practice"
                width="1536"
                height="1024"
                loading="lazy"
                decoding="async"
              />
            </picture>
            <figcaption>
              <SparkleIcon size={18} weight="duotone" aria-hidden="true" />
              Learning, practicing, and building one project at a time.
            </figcaption>
          </figure>

          <div className="achievement-groups">
            {portfolioData.members.map((member) => (
              <article
                className={`achievement-group achievement-group--${member.accent}`}
                key={member.id}
                data-reveal
              >
                <header>
                  <span>{member.chapter}</span>
                  <div>
                    <h3>{member.name}</h3>
                    <p>
                      {member.achievements.length
                        ? "Achievements and progress"
                        : "Information coming soon"}
                    </p>
                  </div>
                </header>
                {member.achievements.length ? (
                  <ul>
                    {member.achievements.map((achievement) => (
                      <li key={achievement}>
                        <CheckCircleIcon
                          size={20}
                          weight="duotone"
                          aria-hidden="true"
                        />
                        {achievement}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="achievement-pending">
                    This chapter is ready for the third member's real achievements.
                  </p>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
