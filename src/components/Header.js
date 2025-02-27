import React from "react";
import "../styles/Header.css";

function Header({ setView }) {
  return (
    <header className="app-header">
      <h1>Mon Dressing Virtuel</h1>
      <nav>
        <button onClick={() => setView("list")}>Mes Vêtements</button>
        <button onClick={() => setView("add")}>Ajouter</button>
        <button onClick={() => setView("outfit")}>Créer des Tenues</button>
        <button onClick={() => setView("color")}>Assistant Couleur</button>
      </nav>
    </header>
  );
}

export default Header;
