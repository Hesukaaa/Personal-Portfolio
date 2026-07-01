import { useState } from "react";
import { FiMessageCircle, FiX, FiSend } from "react-icons/fi";
import "./AiAssistant.css";

const initialMessages = [
  {
    role: "assistant",
    text: "Hi! I'm your Joel assistant. Ask me any question about this portfolio, contact options, or project services.",
  },
];

function getAssistantReply(prompt: string) {
  const normalized = prompt.toLowerCase();

  if (normalized.includes("contact") || normalized.includes("email")) {
    return "You can contact Joel through the form, or directly via email at dibdibjoel4@gmail.com. The form is monitored and replies are sent quickly.";
  }

  if (normalized.includes("services") || normalized.includes("what can you do")) {
    return "Joel builds responsive websites, front-end interfaces, UI/UX design, and polished portfolio projects with modern visuals and fast performance.";
  }

  if (normalized.includes("portfolio") || normalized.includes("work")) {
    return "This portfolio showcases services, projects, and contact details. Use the navigation links to explore sections like About, Skills, Projects, and Contact.";
  }

  if (normalized.includes("price") || normalized.includes("cost")) {
    return "Pricing depends on the scope of the project. Please reach out with your project details so Joel can provide a clear quote.";
  }

  if (normalized.includes("hello") || normalized.includes("hi") || normalized.includes("hey")) {
    return "Hello! I'm the AI assistant for this portfolio. How can I help you today?";
  }

  return "Thanks for your message! Joel will review your request and reply shortly. If you want a faster answer, ask about services, contact, or project types.";
}

function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const [status, setStatus] = useState<"idle" | "sending">("idle");

  const toggleOpen = () => setIsOpen((value) => !value);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage = { role: "user", text: trimmed };
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setStatus("sending");

    window.setTimeout(() => {
      const reply = getAssistantReply(trimmed);
      setMessages((current) => [...current, { role: "assistant", text: reply }]);
      setStatus("idle");
    }, 500);
  };

  return (
    <div className={`ai-assistant ${isOpen ? "open" : ""}`}>
      <button className="ai-toggle" type="button" onClick={toggleOpen} aria-label="Toggle Joel assistant">
        {isOpen ? <FiX /> : <FiMessageCircle />}
        <span>{isOpen ? "Close" : "Joel Assistant"}</span>
      </button>

      {isOpen ? (
        <div className="ai-panel">
          <div className="ai-header">
            <div className="ai-title">Joel Assistant</div>
            <div className="ai-subtitle">Get help with the portfolio, services, or contact details.</div>
          </div>

          <div className="ai-messages">
            {messages.map((message, index) => (
              <div key={index} className={`ai-message ${message.role}`}>
                <span>{message.text}</span>
              </div>
            ))}
          </div>

          <form className="ai-input-form" onSubmit={handleSubmit}>
            <input
              aria-label="Ask the assistant"
              placeholder="Ask a question..."
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
            <button type="submit" disabled={status === "sending"} aria-label="Send message">
              <FiSend />
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}

export default AiAssistant;
