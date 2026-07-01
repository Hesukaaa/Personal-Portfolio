import { Link } from "react-router-dom";

function FooterSection() {
  return (
    <footer className="site-footer footer-panel">
      <Link className="footer-logo" to="/" aria-label="Go to frontpage">
        <span>JD</span>
      </Link>

      <div className="footer-copy">
        <p>Designed and built by Joel Dibdib.</p>
      </div>

      <a className="footer-back-to-top" href="#home" aria-label="Back to top">
        <span className="footer-arrow">↑</span>
      </a>
    </footer>
  );
}

export default FooterSection;
