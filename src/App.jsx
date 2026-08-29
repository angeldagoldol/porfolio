import Header from "./components/Header";
import Hero from "./components/Hero";
import ExperienceStrip from "./components/ExperienceStrip";
import About from "./components/About";
import Skills from "./components/Skills";
import Project from "./components/Project";
import Growth from "./components/Growth";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ScrollReveal from "./components/ScrollReveal";
import PageEffects from "./components/PageEffects";

export default function App() {
  return (
    <div className="portfolio-shell">
      <PageEffects />
      <ScrollReveal />
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <ExperienceStrip />
        <About />
        <Skills />
        <Project />
        <Growth />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
