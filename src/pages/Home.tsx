import { useEffect } from "react";
import AboutSection from "../sections/AboutSection";
import ContactSection from "../sections/ContactSection";
import FooterSection from "../sections/FooterSection";
import HeroSection from "../sections/HeroSection";
import ProcessSection from "../sections/ProcessSection";
import ProjectsSection from "../sections/ProjectsSection";
import ServicesSection from "../sections/ServicesSection";
import "./Home.css";

function Home() {
  useEffect(() => {
    const sections = document.querySelectorAll(".section-block");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <main className="portfolio-shell">
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <ProcessSection />
      <ContactSection />
      <FooterSection />
    </main>
  );
}

export default Home;
