import { ArrowUpRightIcon } from "@phosphor-icons/react/ArrowUpRight";
import { EnvelopeSimpleIcon } from "@phosphor-icons/react/EnvelopeSimple";
import { MapPinIcon } from "@phosphor-icons/react/MapPin";
import { SparkleIcon } from "@phosphor-icons/react/Sparkle";
import portfolioData from "../data/portfolioData";

export default function Contact() {
  return (
    <section className="contact-section" id="contact">
      <div className="site-container contact-stage" data-reveal>
        <div className="contact-intro">
          <p className="section-kicker">
            <span>05</span>
            Contact the team
          </p>
          <h2>Connect with the member you need.</h2>
          <p>
            Each email and social account remains attached to the correct
            member profile.
          </p>
          <span className="contact-location">
            <MapPinIcon size={18} weight="fill" aria-hidden="true" />
            {portfolioData.site.location}
          </span>
        </div>

        <div className="contact-directory">
          {portfolioData.members.map((member) => (
            <article
              className={`contact-member contact-member--${member.accent}`}
              key={member.id}
            >
              <header>
                <span>{member.chapter}</span>
                <div>
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                </div>
              </header>

              {member.contact.email ? (
                <a className="contact-email" href={`mailto:${member.contact.email}`}>
                  <EnvelopeSimpleIcon
                    size={22}
                    weight="duotone"
                    aria-hidden="true"
                  />
                  <span>{member.contact.email}</span>
                  <ArrowUpRightIcon size={18} aria-hidden="true" />
                </a>
              ) : (
                <p className="contact-pending" role="status">
                  Contact information coming soon.
                </p>
              )}

              {member.contact.socials.length ? (
                <ul className="contact-socials">
                  {member.contact.socials.map((social) => (
                    <li key={`${member.id}-${social.platform}`}>
                      <SparkleIcon size={16} weight="duotone" aria-hidden="true" />
                      <span>
                        <small>{social.platform}</small>
                        {social.url ? (
                          <a href={social.url} target="_blank" rel="noreferrer">
                            {social.label}
                          </a>
                        ) : (
                          <strong>{social.label}</strong>
                        )}
                      </span>
                      {!social.url ? <em>Display only</em> : null}
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
