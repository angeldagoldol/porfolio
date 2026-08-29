import { ArrowRightIcon } from "@phosphor-icons/react/ArrowRight";
import { CodeIcon } from "@phosphor-icons/react/Code";
import { GameControllerIcon } from "@phosphor-icons/react/GameController";
import { MapPinIcon } from "@phosphor-icons/react/MapPin";
import { SparkleIcon } from "@phosphor-icons/react/Sparkle";
import { UsersThreeIcon } from "@phosphor-icons/react/UsersThree";
import { WaveSineIcon } from "@phosphor-icons/react/WaveSine";
import portfolioData from "../data/portfolioData";
import MemberPortrait from "./MemberPortrait";
import TeamSignal from "./TeamSignal";

const motifIcons = {
  code: CodeIcon,
  technology: GameControllerIcon,
  constellation: SparkleIcon,
};

function HeroMember({ member, index }) {
  const MotifIcon = motifIcons[member.motif] ?? SparkleIcon;
  const headingId = `hero-member-${member.id}`;

  return (
    <article
      className={`hero-member hero-member--${member.accent}`}
      data-status={member.status}
      aria-labelledby={headingId}
    >
      <p className="chapter-label">
        <strong>{member.chapter}</strong>
        <span>Chapter</span>
      </p>

      <div className="hero-member-visual">
        <span className="member-orbit" aria-hidden="true" />
        <span className="member-motif" aria-hidden="true">
          <MotifIcon size={44} weight="duotone" />
        </span>
        {member.motif === "code" ? (
          <pre className="hero-code-fragment" aria-hidden="true">
            <code>{"import React\nfrom 'react';\n\nfunction Portfolio() {\n  return <Team />;\n}"}</code>
          </pre>
        ) : null}
        <MemberPortrait member={member} eager={index === 0} context="hero" />
      </div>

      <div className="hero-member-copy">
        <h2 id={headingId}>{member.name}</h2>
        <p>{member.role}</p>
        <a href={`#profile-${member.id}`}>
          View profile
          <ArrowRightIcon size={18} weight="bold" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

export default function Hero() {
  return (
    <section className="hero-section" id="home" aria-labelledby="hero-title">
      <div className="site-container hero-header-copy">
        <p className="hero-eyebrow">
          <UsersThreeIcon size={18} weight="duotone" aria-hidden="true" />
          Three student chapters · one shared portfolio
        </p>
        <h1 id="hero-title">
          {portfolioData.site.headlineLead}{" "}
          <span>{portfolioData.site.headlineAccent}</span>
        </h1>
        <p>{portfolioData.site.description}</p>
      </div>

      <div className="hero-members">
        {portfolioData.members.map((member, index) => (
          <HeroMember member={member} index={index} key={member.id} />
        ))}
        <TeamSignal />
      </div>

      <div className="hero-collaboration" aria-label="Group portfolio summary">
        <CodeIcon size={24} weight="duotone" aria-hidden="true" />
        <span>One portfolio · Three stories · Shared work</span>
        <WaveSineIcon size={25} weight="duotone" aria-hidden="true" />
        <UsersThreeIcon size={24} weight="duotone" aria-hidden="true" />
      </div>

      <div className="hero-location" aria-hidden="true">
        <MapPinIcon size={18} weight="fill" />
        {portfolioData.site.location}
      </div>
    </section>
  );
}
