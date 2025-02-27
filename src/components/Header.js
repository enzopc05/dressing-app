import React from "react";
import "../styles/Header.css";

function Header({ setView, isAdmin }) {
  return (
    <header className="app-header">
      <h1>Mon Dressing Virtuel</h1>
      <nav>
        <button onClick={() => setView("list")}>Mes Vêtements</button>
        <button onClick={() => setView("add")}>Ajouter</button>
        <button onClick={() => setView("outfit")}>Créer des Tenues</button>
        <button onClick={() => setView("orders")}>Commandes</button>
        <button onClick={() => setView("color")}>Assistant Couleur</button>
        <button onClick={() => setView("backup")} className="backup-button">
          Sauvegarde
        </button>
        {isAdmin && (
          <button onClick={() => setView("admin")} className="admin-button">
            Administration
          </button>
        )}
      </nav>
    </header>
  );
}

export default Header;
