import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { FiArrowRight, FiMail } from "react-icons/fi";

import profileImage from "../assets/PNG3.png";

function HeroSection() {
  return (
    <section id="home" className="hero-section section-block">
      <div className="hero-copy">
        <p className="eyebrow">Web Developer</p>

        <h1>
          Hi, I&apos;m
          <span>Joel Dibdib</span>
        </h1>

        <p className="hero-description">
          I design and build modern, responsive web experiences with clean code,
          glowing visuals, and interfaces that feel smooth from the first click.
        </p>

        <div className="hero-actions">
          <a className="primary-button" href="#projects">
            View Projects
            <FiArrowRight />
          </a>
          <a className="secondary-button" href="#contact">
            Hire Me
          </a>
        </div>

        <div className="social-row" aria-label="Social links">
          <a href="https://github.com/" aria-label="GitHub">
            <FaGithub />
          </a>
          <a href="https://www.linkedin.com/" aria-label="LinkedIn">
            <FaLinkedinIn />
          </a>
          <a href="mailto:joel@example.com" aria-label="Email">
            <FiMail />
          </a>
        </div>
      </div>

      <div className="hero-visual" aria-label="Portrait graphic">
        <div className="orbit orbit-one"></div>
        <div className="orbit orbit-two"></div>
        <span className="orb orb-one"></span>
        <span className="orb orb-two"></span>
        <span className="orb orb-three"></span>
        <span className="slash-line"></span>
        <img src={profileImage} alt="Joel Dibdib" />
      </div>
    </section>
  );
}

export default HeroSection;
