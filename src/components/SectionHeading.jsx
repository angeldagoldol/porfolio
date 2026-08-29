export default function SectionHeading({ number, label, title, description }) {
  return (
    <div className="section-heading" data-reveal>
      <p className="section-kicker">
        <span>{number}</span>
        {label}
      </p>
      <div className="section-heading-row">
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
    </div>
  );
}
