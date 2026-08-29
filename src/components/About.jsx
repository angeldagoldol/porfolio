import { ArrowUpRightIcon } from "@phosphor-icons/react/ArrowUpRight";
import { EnvelopeSimpleIcon } from "@phosphor-icons/react/EnvelopeSimple";
import { GraduationCapIcon } from "@phosphor-icons/react/GraduationCap";
import { MapPinIcon } from "@phosphor-icons/react/MapPin";
import { SparkleIcon } from "@phosphor-icons/react/Sparkle";
import portfolioData from "../data/portfolioData";
import MemberPortrait from "./MemberPortrait";
import SectionHeading from "./SectionHeading";

const getMemberFacts = (member) =>
  [
    ["Age", member.age ? `${member.age} years old` : null],
    ["Location", member.location],
    ["Year level", member.yearLevel],
    ["Program", member.course],
    ["School", member.school],
  ].filter(([, value]) => Boolean(value));

function ProjectList({ projects }) {
  return (
    <ul className="profile-list project-list">
      {projects.map((project) => (
        <li key={project.title}>
          <div>
            <strong>{project.title}</strong>
            {project.description ? <p>{project.description}</p> : null}
          </div>
          {project.url ? (
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${project.title}`}
            >
              {project.displayUrl ?? "Visit project"}
              <ArrowUpRightIcon size={16} weight="bold" aria-hidden="true" />
            </a>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function ContactDetails({ member }) {
  return (
    <div className="profile-contact-list">
      {member.contact.email ? (
        <a href={`mailto:${member.contact.email}`}>
          <EnvelopeSimpleIcon size={20} weight="duotone" aria-hidden="true" />
          <span>
            <small>Email</small>
            <strong>{member.contact.email}</strong>
          </span>
          <ArrowUpRightIcon size={17} aria-hidden="true" />
        </a>
      ) : null}
      {member.contact.socials.map((social) =>
        social.url ? (
          <a
            href={social.url}
            target="_blank"
            rel="noreferrer"
            key={`${member.id}-${social.platform}`}
          >
            <SparkleIcon size={20} weight="duotone" aria-hidden="true" />
            <span>
              <small>{social.platform}</small>
              <strong>{social.label}</strong>
            </span>
            <ArrowUpRightIcon size={17} aria-hidden="true" />
          </a>
        ) : (
          <div
            className="contact-display-only"
            key={`${member.id}-${social.platform}`}
          >
            <SparkleIcon size={20} weight="duotone" aria-hidden="true" />
            <span>
              <small>{social.platform}</small>
              <strong>{social.label}</strong>
            </span>
            <em>Link not provided</em>
          </div>
        ),
      )}
    </div>
  );
}

function MemberProfile({ member }) {
  const headingId = `profile-heading-${member.id}`;
  const pending = member.status === "pending";

  return (
    <section
      className={`member-profile member-profile--${member.accent}`}
      id={`profile-${member.id}`}
      aria-labelledby={headingId}
      data-reveal
    >
      <header className="member-profile-header">
        <p className="chapter-label">
          <strong>{member.chapter}</strong>
          <span>Chapter</span>
        </p>
        <div>
          <span className={`profile-status${pending ? " is-pending" : ""}`}>
            {pending ? "Information coming soon" : "Profile available"}
          </span>
          <h3 id={headingId}>{member.name}</h3>
          <p>{member.role}</p>
        </div>
      </header>

      <div className="member-profile-lead">
        <MemberPortrait member={member} context="detail" />
        <div className="profile-introduction">
          <p className="profile-about">{member.about}</p>
          <p>{member.aboutSupporting}</p>
          {!pending ? <blockquote>“{member.tagline}”</blockquote> : null}
          {pending ? (
            <div className="pending-message" role="status">
              This chapter is reserved for the third group member. Their real
              information and photo will be added when provided.
            </div>
          ) : null}
        </div>

        {!pending ? (
          <dl className="member-facts">
            {getMemberFacts(member).map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>

      {!pending ? (
        <div className="member-profile-grid">
          <article className="profile-panel profile-panel--skills">
            <p className="panel-label">
              <GraduationCapIcon size={19} weight="duotone" aria-hidden="true" />
              Skills
            </p>
            <ul className="skill-chip-list">
              {member.skills.map((skill) => (
                <li key={`${member.id}-${skill.name}`}>
                  <strong>{skill.name}</strong>
                  <span>{skill.category}</span>
                  {skill.description ? <p>{skill.description}</p> : null}
                </li>
              ))}
            </ul>
          </article>

          <article className="profile-panel">
            <p className="panel-label">Projects and activities</p>
            <ProjectList projects={member.projects} />
          </article>

          <article className="profile-panel">
            <p className="panel-label">Achievements</p>
            <ul className="profile-list">
              {member.achievements.map((achievement) => (
                <li key={achievement}>{achievement}</li>
              ))}
            </ul>
          </article>

          <article className="profile-panel">
            <p className="panel-label">Hobbies and interests</p>
            <ul className="interest-list">
              {member.hobbies.map((hobby) => (
                <li key={hobby}>{hobby}</li>
              ))}
            </ul>
          </article>

          <article className="profile-panel profile-panel--contact">
            <p className="panel-label">
              <MapPinIcon size={18} weight="duotone" aria-hidden="true" />
              Contact and social profiles
            </p>
            <ContactDetails member={member} />
          </article>
        </div>
      ) : null}
    </section>
  );
}

export default function About() {
  return (
    <section className="content-section team-section" id="team">
      <div className="site-container">
        <SectionHeading
          number="01"
          label="Our team"
          title="Three equal chapters. Every story has its own space."
          description="Angel, Mike, and Van Yowrick each have a complete chapter with their own information, strengths, interests, and goals."
        />

        <div className="member-profiles">
          {portfolioData.members.map((member) => (
            <MemberProfile member={member} key={member.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
