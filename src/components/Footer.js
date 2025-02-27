import React from "react";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-links">
          <a href="#about" className="footer-link">
            À propos
          </a>
          <a href="#help" className="footer-link">
            Aide
          </a>
          <a href="#contact" className="footer-link">
            Contact
          </a>
        </div>

        <p>
          &copy; {new Date().getFullYear()} Mon Dressing Virtuel - Tous droits
          réservés
        </p>
      </div>
    </footer>
  );
}

export default Footer;
