import { useState } from "react";
import { FiDownload, FiMenu, FiX } from "react-icons/fi";
import "./Navbar.css";

const CV_FILE_NAME = "Joel-Dibdib-CV.pdf";
const CV_FILE_PATH = `/${CV_FILE_NAME}`;

function downloadCv() {
  if (typeof window === "undefined") return;

  const anchor = document.createElement("a");
  anchor.href = CV_FILE_PATH;
  anchor.download = CV_FILE_NAME;
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((open) => !open);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className={`navbar ${menuOpen ? "open" : ""}`}>
      <a className="brand-link" href="/portfolio/home#home" aria-label="Joel Dibdib portfolio home">
        <span className="brand-mark">JD</span>
        <span>Joel Dibdib</span>
      </a>

      <div id="navigation" className={`right-links ${menuOpen ? "open" : ""}`}>
        {/* <div className="mobile-brand" role="img" aria-label="Joel Dibdib logo">
          <span className="brand-mark">JD</span>
          <span className="mobile-brand-name">Joel Dibdib</span>
        </div> */}
        <a className="nav-link" href="/portfolio/home#home" onClick={closeMenu}>
          Home
        </a>
        <a className="nav-link" href="/portfolio/home#about" onClick={closeMenu}>
          About
        </a>
        <a className="nav-link" href="/portfolio/home#skills" onClick={closeMenu}>
          Skills
        </a>
        <a className="nav-link" href="/portfolio/home#services" onClick={closeMenu}>
          Services
        </a>
        <a className="nav-link" href="/portfolio/home#projects" onClick={closeMenu}>
          Projects
        </a>
        <a className="nav-link" href="/portfolio/home#contact" onClick={closeMenu}>
          Contact
        </a>
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
