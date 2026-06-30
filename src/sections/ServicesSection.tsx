import { FiFigma, FiMonitor, FiSmartphone, FiZap } from "react-icons/fi";

const services = [
  {
    icon: <FiMonitor />,
    title: "Frontend Development",
    text: "Responsive interfaces built with clean structure, reusable components, and smooth interactions.",
  },
  {
    icon: <FiFigma />,
    title: "UI/UX Design",
    text: "Modern layouts, visual hierarchy, and user flows shaped for clarity, confidence, and delight.",
  },
  {
    icon: <FiSmartphone />,
    title: "Responsive Websites",
    text: "Desktop, tablet, and mobile experiences tuned so every section feels intentional.",
  },
  {
    icon: <FiZap />,
    title: "Performance Polish",
    text: "Fast-loading pages with refined spacing, accessible states, and production-ready details.",
  },
];

function ServicesSection() {
  return (
    <section id="services" className="section-block">
      <div className="section-heading">
        <p className="section-kicker">Services</p>
        <h2>What I Can Build For You</h2>
        <p>
          From first layout to final polish, I focus on websites that look sharp,
          load fast, and feel easy to use.
        </p>
      </div>

      <div className="services-grid">
        {services.map((service) => (
          <article className="feature-card" key={service.title}>
            <span>{service.icon}</span>
            <h3>{service.title}</h3>
            <p>{service.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ServicesSection;
