import { FaHtml5, FaReact, FaUsers } from "react-icons/fa";
import { FiArrowRight, FiBriefcase, FiCode, FiCoffee, FiCpu } from "react-icons/fi";
import { SiCss, SiJavascript, SiTailwindcss, SiTypescript } from "react-icons/si";

const stats = [
  { icon: <FiCode />, value: "1+", label: "Years Experience" },
  { icon: <FiBriefcase />, value: "10+", label: "Projects Completed" },
  { icon: <FaUsers />, value: "5+", label: "Happy Clients" },
  { icon: <FiCoffee />, value: "100+", label: "Cups of Coffee" },
];

const stack = [
  { icon: <FaReact />, label: "React" },
  { icon: <SiTypescript />, label: "TypeScript" },
  { icon: <FaHtml5 />, label: "HTML5" },
  { icon: <SiCss />, label: "CSS3" },
  { icon: <SiTailwindcss />, label: "Tailwind CSS" },
  { icon: <SiJavascript />, label: "JavaScript" },
];

function AboutSection() {
  return (
    <section id="about" className="glass-panel overview-panel section-block">
      <div className="about-copy">
        <p className="section-kicker">About Me</p>
        <h2>
          Crafting Digital Experiences That Make <span>Impact</span>
        </h2>
        <p>
          I&apos;m a dedicated Frontend Developer with a keen eye for design and a
          love for clean code. I specialize in building interactive, user-friendly
          interfaces that deliver seamless experiences.
        </p>
        <a className="connect-button" href="#contact">
          Let&apos;s Connect
          <FiArrowRight />
        </a>
      </div>

      <div className="metrics-area">
        <div className="stats-grid">
          {stats.map((item) => (
            <article className="stat-card" key={item.label}>
              <span className="stat-icon">{item.icon}</span>
              <strong>{item.value}</strong>
              <small>{item.label}</small>
            </article>
          ))}
        </div>

        <div id="skills" className="tech-card">
          <h3>
            <FiCpu />
            Tech Stack
          </h3>
          <div className="stack-list">
            {stack.map((item) => (
              <span className="stack-pill" key={item.label}>
                {item.icon}
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
