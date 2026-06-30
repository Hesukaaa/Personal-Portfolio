import { FiCheckCircle } from "react-icons/fi";

const timeline = [
  "Discovery and visual direction",
  "Wireframe and component planning",
  "Frontend build and responsive polish",
  "Launch review and final refinement",
];

function ProcessSection() {
  return (
    <section className="process-panel section-block">
      <div>
        <p className="section-kicker">Process</p>
        <h2>Simple Workflow, Polished Result</h2>
        <p>
          I keep the process clear, collaborative, and focused on building a final
          website that matches your goals.
        </p>
      </div>

      <div className="timeline-list">
        {timeline.map((step, index) => (
          <article key={step}>
            <span>{index + 1}</span>
            <p>{step}</p>
            <FiCheckCircle />
          </article>
        ))}
      </div>
    </section>
  );
}

export default ProcessSection;
