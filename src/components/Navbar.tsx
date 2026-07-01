import { useState } from "react";
import { FiDownload, FiMenu, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import { jsPDF } from "jspdf";
import cvImage from "../assets/CV.png";
import "./Navbar.css";

const CV_FILE_NAME = "Joel-Dibdib-CV.pdf";
const CV_FILE_PATH = cvImage;

function downloadCv() {
  if (typeof window === "undefined") return;

  const img = new Image();
  img.src = cvImage;
  img.crossOrigin = "anonymous";

  img.onload = () => {
    const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [img.width, img.height] });
    pdf.addImage(img, "PNG", 0, 0, img.width, img.height);
    pdf.save(CV_FILE_NAME);
  };

  img.onerror = () => {
    const anchor = document.createElement("a");
    anchor.href = cvImage;
    anchor.download = "CV.png";
    anchor.click();
  };
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((open) => !open);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className={`navbar ${menuOpen ? "open" : ""}`}>
      <Link className="brand-link" to="/portfolio/home#home" aria-label="Joel Dibdib portfolio home">
        <span className="brand-mark">JD</span>
        <span>Joel Dibdib</span>
      </Link>

      <div id="navigation" className={`right-links ${menuOpen ? "open" : ""}`}>
        {/* <div className="mobile-brand" role="img" aria-label="Joel Dibdib logo">
          <span className="brand-mark">JD</span>
          <span className="mobile-brand-name">Joel Dibdib</span>
        </div> */}
        <Link className="nav-link" to="/portfolio/home#home" onClick={closeMenu}>
          Home
        </Link>
        <Link className="nav-link" to="/portfolio/home#about" onClick={closeMenu}>
          About
        </Link>
        <Link className="nav-link" to="/portfolio/home#skills" onClick={closeMenu}>
          Skills
        </Link>
        <Link className="nav-link" to="/portfolio/home#services" onClick={closeMenu}>
          Services
        </Link>
        <Link className="nav-link" to="/portfolio/home#projects" onClick={closeMenu}>
          Projects
        </Link>
        <Link className="nav-link" to="/portfolio/home#contact" onClick={closeMenu}>
          Contact
        </Link>
        <a
          className="cv-link"
          href={CV_FILE_PATH}
          onClick={(event) => {
            event.preventDefault();
            downloadCv();
            closeMenu();
          }}
          aria-label="Download CV"
        >
          <span>Download CV</span>
          <FiDownload aria-hidden="true" />
        </a>
      </div>

      <button
        className={`menu-toggle ${menuOpen ? "open" : ""}`}
        type="button"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen ? "true" : "false"}
        aria-controls="navigation"
        onClick={toggleMenu}
      >
        {menuOpen ? <FiX /> : <FiMenu />}
      </button>
    </nav>
  );
}

export default Navbar;
