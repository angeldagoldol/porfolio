export default function MemberPortrait({ member, eager = false, context = "card" }) {
  const hasRealPhoto = member.photoStatus === "provided";
  const altText = hasRealPhoto
    ? `${member.name}, ${member.role}`
    : `Non-identifying placeholder portrait for ${member.name}; a real photo has not been provided`;

  return (
    <figure
      className={`member-portrait member-portrait--${context}${
        hasRealPhoto ? " has-photo" : " is-placeholder"
      }`}
    >
      <picture>
        <img
          src={member.profileImage}
          srcSet={member.profileImageSources}
          sizes={
            context === "hero"
              ? "(max-width: 767px) 84vw, (max-width: 1199px) 68vw, 33vw"
              : "(max-width: 767px) 88vw, (max-width: 1100px) 42vw, 360px"
          }
          alt={altText}
          width="720"
          height="720"
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          decoding="async"
        />
      </picture>
      {!hasRealPhoto ? <figcaption>Photo pending</figcaption> : null}
    </figure>
  );
}
