import React from "react";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="app-footer">
      <p>&copy; {new Date().getFullYear()} Mon Dressing Virtuel</p>
    </footer>
  );
}

export default Footer;
