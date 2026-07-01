import { useState } from "react";
import { FiMail, FiMapPin, FiPhone, FiSend } from "react-icons/fi";

function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setFeedback("");

    try {
      const apiUrl = (import.meta.env.VITE_API_URL as string) || "/api/contact";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to send message.");
      }

      setStatus("success");
      setFeedback("Your message has been sent successfully.");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setStatus("error");
      setFeedback(
        error instanceof Error ? error.message : "Something went wrong."
      );
    }
  };

  return (
    <section id="contact" className="contact-panel section-block">
      <div className="contact-copy">
        <p className="section-kicker">Contact</p>
        <h2>Ready To Build Something Memorable?</h2>
        <p>
          Send a message and let&apos;s turn your idea into a clean, modern web
          experience.
        </p>

        <div className="contact-list">
          <a href="mailto:dibdibjoel4@gmail.com">
            <FiMail />
            dibdibjoel4@gmail.com
          </a>
          <a href="tel:+639273535464">
            <FiPhone />
            09273535464
          </a>
          <span>
            <FiMapPin />
            Dalaguete, Cebu Philippines
          </span>
        </div>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
        <label>
          Name
          <input
            type="text"
            name="name"
            placeholder="Your name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email
          <input
            type="email"
            name="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Project
          <textarea
            name="message"
            rows={5}
            placeholder="Tell me about your idea"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Sending..." : "Send Message"}
          <FiSend />
        </button>
        {feedback ? (
          <p className={status === "success" ? "form-success" : "form-error"}>
            {feedback}
          </p>
        ) : null}
      </form>
    </section>
  );
}

export default ContactSection;
