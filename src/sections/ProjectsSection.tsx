import { FiExternalLink } from "react-icons/fi";
import coverPhoto from "../assets/COVER PHOTO OF MINE.png";
import sampleTarp from "../assets/SAMLPLE TARP.png";
import sampleBranding from "../assets/SAMPLE BRANDING AND IDENTY.png";
import minePreview from "../assets/MINE.png";
import socialMediaPreview from "../assets/SAMPLE SOCIAL MEDIA DESIGN.png";
import logoPreview from "../assets/SAMPLE LOGO.png";
import creativeSolutionsPreview from "../assets/CREATIVE SOLUTIONS SAMPLE.png";

const projects = [
  {
    title: "Cover Photo Showcase",
    type: "Brand Visual",
    text: "A bold cover photo concept that anchors the portfolio with strong imagery and distinctive styling.",
    preview: coverPhoto,
    action: "Explore Cover Photo",
    tags: ["Brand", "Photography", "Visual Design"],
  },
  {
    title: "Sample TARP Concept",
    type: "Creative Landing",
    text: "A modern landing page layout using strong typography, layered content, and an attention-grabbing hero.",
    preview: sampleTarp,
    action: "Explore Sample TARP",
    tags: ["UI Design", "Layout", "Branding"],
  },
  {
    title: "Branding & Identity",
    type: "Identity System",
    text: "A cohesive brand identity concept focused on color, typography, and polished visual consistency.",
    preview: sampleBranding,
    action: "Explore Branding",
    tags: ["Brand Identity", "Design", "Strategy"],
  },
  {
    title: "Personal Brand Visual",
    type: "Portfolio Image",
    text: "A polished personal brand image designed to represent the portfolio with a distinctive visual identity.",
    preview: minePreview,
    action: "Explore Personal Brand",
    tags: ["Personal", "Visual Identity", "Brand"],
  },
  {
    title: "Social Media Concept",
    type: "Social Media",
    text: "An eye-catching social media mockup with bold composition and brand-driven layout for digital engagement.",
    preview: socialMediaPreview,
    action: "Explore Social Media",
    tags: ["Social", "Digital", "Engagement"],
  },
  {
    title: "Logo Sample",
    type: "Logo Design",
    text: "A clean logo exploration that reinforces brand recognition through thoughtful shape and style.",
    preview: logoPreview,
    action: "Explore Logo Design",
    tags: ["Logo", "Identity", "Concept"],
  },
  {
    title: "Creative Solutions",
    type: "Design Strategy",
    text: "A creative solutions sample that blends concept development with polished visual execution.",
    preview: creativeSolutionsPreview,
    action: "Explore Creative Solutions",
    tags: ["Strategy", "Concept", "Design"],
  },
];

function ProjectsSection() {
  const handleCardClick = (preview: string) => {
    window.open(preview, "_blank", "noopener,noreferrer");
  };

  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLElement>, preview: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      window.open(preview, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <section id="projects" className="section-block">
      <div className="section-heading split-heading">
        <div>
          <p className="section-kicker">Projects</p>
          <h2>Selected Work</h2>
        </div>
        <p>
          A snapshot of portfolio-ready concepts that show layout, interaction,
          and frontend attention to detail.
        </p>
      </div>

      <div className="projects-grid">
        {projects.map((project, index) => (
          <article
            className="project-card"
            key={project.title}
            onClick={() => handleCardClick(project.preview)}
            tabIndex={0}
            onKeyDown={(event) => handleCardKeyDown(event, project.preview)}
            role="link"
          >
            <div className="project-preview">
              <img
                src={project.preview}
                alt={`${project.title} preview`}
                loading="lazy"
              />
              <span>0{index + 1}</span>
            </div>
            <p>{project.type}</p>
            <h3>{project.title}</h3>
            <p>{project.text}</p>
            <div className="tag-row">
              {project.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <a href="#contact" onClick={(event) => event.stopPropagation()}>
              {project.action || "Discuss Project"}
              <FiExternalLink />
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ProjectsSection;
