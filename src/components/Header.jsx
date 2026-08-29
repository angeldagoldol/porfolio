"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRightIcon } from "@phosphor-icons/react/ArrowUpRight";
import { ListIcon } from "@phosphor-icons/react/List";
import { UsersThreeIcon } from "@phosphor-icons/react/UsersThree";
import { XIcon } from "@phosphor-icons/react/X";
import portfolioData from "../data/portfolioData";

const navigation = [
  { label: "Home", href: "#home", section: "home" },
  { label: "Our Team", href: "#team", section: "team" },
  { label: "Project", href: "#project", section: "project" },
  { label: "Contact", href: "#contact", section: "contact" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isMobileViewport, setIsMobileViewport] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 980px)").matches
      : false,
  );
  const menuToggleRef = useRef(null);
  const navigationRef = useRef(null);

  useEffect(() => {
    let scrollFrame = null;
    const updateHeader = () => {
      if (scrollFrame !== null) return;
      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = null;
        const nextIsScrolled = window.scrollY > 24;
        setIsScrolled((current) =>
          current === nextIsScrolled ? current : nextIsScrolled,
        );
      });
    };
    const sections = navigation
      .map((item) => document.getElementById(item.section))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];
        if (visibleEntry) setActiveSection(visibleEntry.target.id);
      },
      { rootMargin: "-28% 0px -58%", threshold: [0.05, 0.25, 0.55] },
    );

    updateHeader();
    sections.forEach((section) => observer.observe(section));
    window.addEventListener("scroll", updateHeader, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateHeader);
      if (scrollFrame !== null) window.cancelAnimationFrame(scrollFrame);
    };
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 980px)");
    const updateViewport = (event) => {
      setIsMobileViewport(event.matches);
      if (!event.matches) setIsMenuOpen(false);
    };
    query.addEventListener("change", updateViewport);
    return () => query.removeEventListener("change", updateViewport);
  }, []);

  useEffect(() => {
    const focusFrame =
      isMenuOpen && isMobileViewport
        ? window.requestAnimationFrame(() => {
            navigationRef.current?.querySelector("a")?.focus();
          })
        : null;
    const closeWithEscape = (event) => {
      if (event.key !== "Escape" || !isMenuOpen) return;
      event.preventDefault();
      setIsMenuOpen(false);
      menuToggleRef.current?.focus({ preventScroll: true });
    };

    document.body.classList.toggle("navigation-open", isMenuOpen);
    window.addEventListener("keydown", closeWithEscape);
    return () => {
      if (focusFrame !== null) window.cancelAnimationFrame(focusFrame);
      document.body.classList.remove("navigation-open");
      window.removeEventListener("keydown", closeWithEscape);
    };
  }, [isMenuOpen, isMobileViewport]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header
      className={`site-header${isScrolled ? " is-scrolled" : ""}${
        isMenuOpen ? " menu-is-open" : ""
      }`}
    >
      <div className="site-container header-inner">
        <a
          className="brand"
          href="#home"
          aria-label={`${portfolioData.site.title} home`}
          onClick={closeMenu}
        >
          <span className="brand-mark" aria-hidden="true">
            {portfolioData.site.initials}
          </span>
          <span className="brand-name">{portfolioData.site.title}</span>
        </a>

        <nav
          ref={navigationRef}
          className={`main-navigation${isMenuOpen ? " is-open" : ""}`}
          id="primary-navigation"
          aria-label="Main navigation"
          aria-hidden={isMobileViewport && !isMenuOpen ? true : undefined}
          inert={isMobileViewport && !isMenuOpen}
        >
          <ul>
            {navigation.map((item) => (
              <li key={item.href}>
                <a
                  className={activeSection === item.section ? "is-active" : ""}
                  href={item.href}
                  aria-current={
                    activeSection === item.section ? "location" : undefined
                  }
                  onClick={closeMenu}
                >
                  <span>{item.label}</span>
                  <ArrowUpRightIcon size={17} aria-hidden="true" />
                </a>
              </li>
            ))}
            <li className="mobile-contact-item">
              <a href="#contact" onClick={closeMenu}>
                <UsersThreeIcon size={18} aria-hidden="true" />
                Contact the team
                <ArrowUpRightIcon size={17} aria-hidden="true" />
              </a>
            </li>
          </ul>
        </nav>

        <a className="header-contact" href="#contact">
          Contact the team
        </a>

        <button
          ref={menuToggleRef}
          className="menu-toggle"
          type="button"
          aria-label={
            isMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-controls="primary-navigation"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          {isMenuOpen ? (
            <XIcon size={24} weight="bold" aria-hidden="true" />
          ) : (
            <ListIcon size={25} weight="bold" aria-hidden="true" />
          )}
        </button>
      </div>

      <button
        className={`menu-backdrop${isMenuOpen ? " is-visible" : ""}`}
        type="button"
        aria-label="Close navigation menu"
        tabIndex={isMenuOpen ? 0 : -1}
        onClick={closeMenu}
      />
    </header>
  );
}
