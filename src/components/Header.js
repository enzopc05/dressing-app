import React from "react";
import "../styles/Header.css";

function Header({ setView, currentView }) {
  return (
    <header className="app-header">
      <h1>Mon Dressing Virtuel</h1>
      <nav>
        <button
          onClick={() => setView("list")}
          className={currentView === "list" ? "active" : ""}
        >
          <span className="nav-icon icon-list"></span>
          Mes Vêtements
        </button>
        <button
          onClick={() => setView("add")}
          className={currentView === "add" ? "active" : ""}
        >
          <span className="nav-icon icon-add"></span>
          Ajouter
        </button>
        <button
          onClick={() => setView("outfit")}
          className={currentView === "outfit" ? "active" : ""}
        >
          <span className="nav-icon icon-outfit"></span>
          Créer des Tenues
        </button>
      </nav>
    </header>
  );
}

export default Header;
