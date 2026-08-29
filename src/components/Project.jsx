import { ArrowUpRightIcon } from "@phosphor-icons/react/ArrowUpRight";
import { BrowserIcon } from "@phosphor-icons/react/Browser";
import { CodeIcon } from "@phosphor-icons/react/Code";
import { UsersThreeIcon } from "@phosphor-icons/react/UsersThree";
import portfolioData from "../data/portfolioData";
import CodeEditor from "./CodeEditor";
import SectionHeading from "./SectionHeading";

export default function Project() {
  return (
    <section className="content-section project-section" id="project">
      <div className="site-container">
        <SectionHeading
          number="03"
          label="Shared project"
          title="One React experience built around three real profiles."
          description="The portfolio itself is the shared project. Individual work remains credited to the member who supplied it."
        />

        <div className="shared-project" data-reveal>
          <div className="project-visual">
            <CodeEditor
              lines={portfolioData.sharedProject.codeLines}
              title="three-chapters.js"
            />
          </div>

          <article className="project-content">
            <span className="project-icon" aria-hidden="true">
              <UsersThreeIcon size={31} weight="duotone" />
            </span>
            <p className="section-kicker">{portfolioData.sharedProject.eyebrow}</p>
            <h3>{portfolioData.sharedProject.title}</h3>
            <p>{portfolioData.sharedProject.description}</p>
            <ul className="technology-list" aria-label="Project technologies">
              {portfolioData.sharedProject.technologies.map((technology) => (
                <li key={technology}>{technology}</li>
              ))}
            </ul>
            <a className="button button-primary" href="#team">
              Explore the member chapters
              <ArrowUpRightIcon size={19} weight="bold" aria-hidden="true" />
            </a>
          </article>
        </div>

        <div className="member-work-grid">
          {portfolioData.members.map((member) => (
            <article
              className={`member-work member-work--${member.accent}`}
              key={member.id}
              data-reveal
            >
              <header>
                <span>{member.chapter}</span>
                <div>
                  <h3>{member.name}</h3>
                  <p>
                    {member.projects.length
                      ? `${member.projects.length} project entries`
                      : "Projects coming soon"}
                  </p>
                </div>
              </header>

              {member.projects.length ? (
                <ul>
                  {member.projects.map((project) => (
                    <li key={`${member.id}-${project.title}`}>
                      <BrowserIcon size={20} weight="duotone" aria-hidden="true" />
                      <span>
                        <strong>{project.title}</strong>
                        {project.description ? <p>{project.description}</p> : null}
                      </span>
                      {project.url ? (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Open ${project.title}`}
                        >
                          <ArrowUpRightIcon size={18} weight="bold" aria-hidden="true" />
                        </a>
                      ) : (
                        <CodeIcon size={18} weight="duotone" aria-hidden="true" />
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="member-work-pending">
                  No project information has been provided for this chapter.
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
