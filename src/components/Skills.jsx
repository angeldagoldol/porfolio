import { BrowserIcon } from "@phosphor-icons/react/Browser";
import { ChatCircleIcon } from "@phosphor-icons/react/ChatCircle";
import { ClockIcon } from "@phosphor-icons/react/Clock";
import { CodeIcon } from "@phosphor-icons/react/Code";
import { DatabaseIcon } from "@phosphor-icons/react/Database";
import { GameControllerIcon } from "@phosphor-icons/react/GameController";
import { GuitarIcon } from "@phosphor-icons/react/Guitar";
import { PingPongIcon } from "@phosphor-icons/react/PingPong";
import { SparkleIcon } from "@phosphor-icons/react/Sparkle";
import { UsersThreeIcon } from "@phosphor-icons/react/UsersThree";
import { WrenchIcon } from "@phosphor-icons/react/Wrench";
import portfolioData from "../data/portfolioData";
import SectionHeading from "./SectionHeading";

const getSkillIcon = (skillName) => {
  const value = skillName.toLowerCase();
  if (value.includes("guitar")) return GuitarIcon;
  if (value.includes("table tennis")) return PingPongIcon;
  if (value.includes("database")) return DatabaseIcon;
  if (value.includes("web") || value.includes("html")) return BrowserIcon;
  if (value.includes("troubleshooting")) return WrenchIcon;
  if (value.includes("team")) return UsersThreeIcon;
  if (value.includes("communication")) return ChatCircleIcon;
  if (value.includes("time")) return ClockIcon;
  if (value.includes("game")) return GameControllerIcon;
  if (value.includes("program") || value.includes("javascript")) return CodeIcon;
  return SparkleIcon;
};

const triggerSkillMotion = (skillName) => {
  if (skillName === "Guitar") {
    window.dispatchEvent(new Event("portfolio:guitar-pluck"));
  }
  if (skillName === "Table Tennis") {
    window.dispatchEvent(new Event("portfolio:ball-smash"));
  }
};

function SkillItem({ member, skill }) {
  const SkillIcon = getSkillIcon(skill.name);
  const hasMotion = skill.name === "Guitar" || skill.name === "Table Tennis";

  return (
    <article className="team-skill-item">
      <span className="team-skill-icon" aria-hidden="true">
        <SkillIcon size={24} weight="duotone" />
      </span>
      <div>
        <h4>{skill.name}</h4>
        <p>{skill.category}</p>
      </div>
      {hasMotion ? (
        <button
          type="button"
          onClick={() => triggerSkillMotion(skill.name)}
          aria-label={`Play the ${skill.name} page animation`}
        >
          Animate
        </button>
      ) : null}
      <span className="skill-owner">{member.firstName}</span>
    </article>
  );
}

export default function Skills() {
  return (
    <section className="content-section skills-section" id="skills">
      <div className="site-container">
        <SectionHeading
          number="02"
          label="Shared strengths"
          title="Different interests. One growing collection of skills."
          description="Each skill remains connected to the member who provided it, so every profile stays accurate."
        />

        <div className="team-skill-groups">
          {portfolioData.members.map((member) => (
            <section
              className={`team-skill-group team-skill-group--${member.accent}`}
              aria-labelledby={`skills-${member.id}`}
              key={member.id}
              data-reveal
            >
              <header>
                <span>{member.chapter}</span>
                <div>
                  <h3 id={`skills-${member.id}`}>{member.name}</h3>
                  <p>
                    {member.status === "pending"
                      ? "Skills coming soon"
                      : `${member.skills.length} listed skills`}
                  </p>
                </div>
              </header>

              {member.skills.length ? (
                <div className="team-skill-list">
                  {member.skills.map((skill) => (
                    <SkillItem
                      member={member}
                      skill={skill}
                      key={`${member.id}-${skill.name}`}
                    />
                  ))}
                </div>
              ) : (
                <div className="skills-pending" role="status">
                  This space will be completed when the member information is
                  provided.
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
