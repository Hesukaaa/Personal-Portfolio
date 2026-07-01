import { useState } from "react";
import { FiDownload, FiMenu, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import "./Navbar.css";

const CV_FILE_NAME = "Joel-Dibdib-CV.pdf";
const CV_FILE_PATH = `${import.meta.env.BASE_URL}CV.pdf`;

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((open) => !open);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className={`navbar ${menuOpen ? "open" : ""}`}>
      <Link className="brand-link" to="/home#home" aria-label="Joel Dibdib portfolio home">
        <span className="brand-mark">JD</span>
        <span>Joel Dibdib</span>
      </Link>

      <div id="navigation" className={`right-links ${menuOpen ? "open" : ""}`}>
        {/* <div className="mobile-brand" role="img" aria-label="Joel Dibdib logo">
          <span className="brand-mark">JD</span>
          <span className="mobile-brand-name">Joel Dibdib</span>
        </div> */}
        <Link className="nav-link" to="/home#home" onClick={closeMenu}>
          Home
        </Link>
        <Link className="nav-link" to="/home#about" onClick={closeMenu}>
          About
        </Link>
        <Link className="nav-link" to="/home#skills" onClick={closeMenu}>
          Skills
        </Link>
        <Link className="nav-link" to="/home#services" onClick={closeMenu}>
          Services
        </Link>
        <Link className="nav-link" to="/home#projects" onClick={closeMenu}>
          Projects
        </Link>
        <Link className="nav-link" to="/home#contact" onClick={closeMenu}>
          Contact
        </Link>
        <a
          className="cv-link"
          href={CV_FILE_PATH}
          download={CV_FILE_NAME}
          onClick={closeMenu}
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
