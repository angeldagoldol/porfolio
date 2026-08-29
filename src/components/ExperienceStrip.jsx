import { SparkleIcon } from "@phosphor-icons/react/Sparkle";
import portfolioData from "../data/portfolioData";

export default function ExperienceStrip() {
  const highlights = [
    ...portfolioData.sharedHighlights,
    ...portfolioData.sharedHighlights,
  ];

  return (
    <div className="experience-strip" aria-hidden="true">
      <div className="experience-track">
        {highlights.map((highlight, index) => (
          <span key={`${highlight}-${index}`}>
            {highlight}
            <SparkleIcon size={12} weight="fill" aria-hidden="true" />
          </span>
        ))}
      </div>
    </div>
  );
}
