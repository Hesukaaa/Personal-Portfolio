import { useState } from "react";
import { FiMessageCircle, FiX, FiSend } from "react-icons/fi";
import "./AiAssistant.css";

const initialMessages = [
  {
    role: "assistant",
    text: "Hi! I'm your Joel assistant. Ask me any question about this portfolio, contact options, or project services.",
  },
];

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

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: trimmed }),
      });

      const data = await response.json();
      const reply = data?.reply || "I’m sorry, I couldn’t generate a response right now.";
      setMessages((current) => [...current, { role: "assistant", text: reply }]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: "I’m sorry, something went wrong. Please try again later.",
        },
      ]);
    } finally {
      setStatus("idle");
    }
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
