import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

import profileImage from "../assets/PNG3.png";

import "./FrontPage.css";

const WORDS = ["FRONTEND DEVELOPER", "GRAPHIC DESIGNER", "WEB DEVELOPER", "UI/UX DESIGNER"];

function FrontPage() {

  const navigate = useNavigate();
  const [displayText, setDisplayText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEnter = () => {
    navigate("/portfolio/home");
  };

  useEffect(() => {
    const currentWord = WORDS[wordIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        const nextValue = currentWord.slice(0, displayText.length + 1);
        setDisplayText(nextValue);

        if (nextValue === currentWord) {
          setTimeout(() => setIsDeleting(true), 1200);
        }
      } else {
        const nextValue = currentWord.slice(0, Math.max(0, displayText.length - 1));
        setDisplayText(nextValue);

        if (nextValue === "") {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % WORDS.length);
        }
      }
    }, isDeleting ? 70 : 110);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, wordIndex]);

  return (

    <section className="frontpage">

      {/* BACKGROUND LIGHTS */}

      <div className="bg-light"></div>
      <div className="bg-light2"></div>

      {/* CHEMICAL BACKGROUND */}

      <div className="chemistry-bg">

        <span className="atom atom1"></span>
        <span className="atom atom2"></span>
        <span className="atom atom3"></span>
        <span className="atom atom4"></span>
        <span className="atom atom5"></span>
        <span className="atom atom6"></span>
        <span className="atom atom7"></span>
        <span className="atom atom8"></span>

        <div className="bond bond1"></div>
        <div className="bond bond2"></div>
        <div className="bond bond3"></div>
        <div className="bond bond4"></div>
        <div className="bond bond5"></div>

      </div>

      {/* LEFT CONTENT */}

      <div className="content">

        <div className="hero-badge">Frontend Developer • UI/UX Enthusiast</div>

        <div className="small-title">
          <span className="typing-text" aria-live="polite">
            {displayText}
            <span className="typing-cursor"></span>
          </span>
        </div>

        <h1 className="main-title">
          Hello, I’m Joel
          <span>I build modern digital experiences</span>
        </h1>

        <p className="description">
          I create clean, responsive, and engaging web experiences with a strong focus on usability, visual polish, and thoughtful interactions.
        </p>

        <button
          className="scroll-btn"
          onClick={handleEnter}
        >
          <span>Explore my work</span>
          <FaArrowRight className="arrow-icon" />
        </button>

      </div>

      {/* IMAGE SECTION */}

      <div className="image-section">

        <div className="image-glow"></div>

        <div className="image-card">
          <span className="image-card-dot"></span>
          <span>Available for select projects</span>
        </div>

        <img
          src={profileImage}
          alt="Profile"
          className="profile-image"
        />

      </div>

    </section>

  );
}

export default FrontPage;