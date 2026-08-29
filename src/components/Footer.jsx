import { ArrowUpIcon } from "@phosphor-icons/react/ArrowUp";
import portfolioData from "../data/portfolioData";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-container footer-inner">
        <a className="footer-brand" href="#home">
          <span aria-hidden="true">{portfolioData.site.initials}</span>
          {portfolioData.site.title}
        </a>
        <p>Three student profiles · One responsive React portfolio</p>
        <a href="#home">
          Back to top
          <ArrowUpIcon size={17} weight="bold" aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}
