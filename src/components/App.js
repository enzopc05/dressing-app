import React, { useState, useEffect } from "react";
import "../styles/App.css";
import Header from "./Header";
import ClothingList from "./ClothingList";
import ClothingForm from "./ClothingForm";
import OutfitCreator from "./OutfitCreator";
import ColorAssistant from "./ColorAssistant";
import UserSelection from "./UserSelection";
import UserAdmin from "./UserAdmin"; // Importer le nouveau composant
import Footer from "./Footer";
import PendingOrders from "./PendingOrders";
import DataBackup from "./DataBackup";
import {
  getClothes,
  saveClothes,
  addClothing,
  updateClothing,
  deleteClothing,
} from "../utils/dataService";
import {
  isLoggedIn,
  getCurrentUserId,
  isCurrentUserAdmin, // Nouvelle fonction
} from "../utils/simpleAuthService";

function App() {
  const [clothes, setClothes] = useState([]);
  const [view, setView] = useState("list"); // 'list', 'add', 'outfit', 'color', 'admin', 'orders', 'backup'
  const [selectedClothes, setSelectedClothes] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Nouvel état pour vérifier si l'utilisateur est admin

  // Vérifier si un utilisateur est connecté
  useEffect(() => {
    const loggedInStatus = isLoggedIn();
    setLoggedIn(loggedInStatus);
    setIsAdmin(loggedInStatus ? isCurrentUserAdmin() : false);
  }, []);

  // Charger les vêtements depuis le service de données au démarrage
  useEffect(() => {
    if (loggedIn) {
      const userId = getCurrentUserId();
      const loadedClothes = getClothes(userId);
      setClothes(loadedClothes);
    }
  }, [loggedIn]);

  // Ajouter un nouveau vêtement
  const handleAddClothing = (clothing) => {
    if (!loggedIn) return;

    const userId = getCurrentUserId();
    const newId = addClothing(clothing, userId);
    const newClothing = {
      ...clothing,
      id: newId,
    };
    setClothes([...clothes, newClothing]);
    setView("list");
  };

  // Supprimer un vêtement
  const handleDeleteClothing = (id) => {
    if (!loggedIn) return;

    const userId = getCurrentUserId();
    if (deleteClothing(id, userId)) {
      setClothes(clothes.filter((item) => item.id !== id));
    }
  };

  // Modifier un vêtement
  const handleEditClothing = (id) => {
    const clothingToEdit = clothes.find((item) => item.id === id);
    setSelectedClothes(clothingToEdit);
    setView("add");
  };

  // Mettre à jour un vêtement
  const handleUpdateClothing = (updatedClothing) => {
    if (!loggedIn) return;

    const userId = getCurrentUserId();
    if (updateClothing(updatedClothing, userId)) {
      setClothes(
        clothes.map((item) =>
          item.id === updatedClothing.id ? updatedClothing : item
        )
      );
      setSelectedClothes(null);
      setView("list");
    }
  };

  return (
    <div className="App">
      <Header setView={setView} isAdmin={isAdmin} />{" "}
      {/* Passer isAdmin au Header */}
      <main className="app-content">
        <UserSelection />

        {!loggedIn ? (
          <div className="login-message">
            <h2>Bienvenue dans votre Dressing Virtuel</h2>
            <p>
              Veuillez sélectionner un utilisateur pour accéder à votre
              dressing.
            </p>
          </div>
        ) : (
          <>
            {view === "list" && (
              <ClothingList
                clothes={clothes}
                onDelete={handleDeleteClothing}
                onEdit={handleEditClothing}
              />
            )}
            {view === "add" && (
              <ClothingForm
                onSubmit={
                  selectedClothes ? handleUpdateClothing : handleAddClothing
                }
                clothing={selectedClothes}
                onCancel={() => {
                  setSelectedClothes(null);
                  setView("list");
                }}
              />
            )}
            {view === "outfit" && <OutfitCreator clothes={clothes} />}
            {view === "color" && <ColorAssistant />}
            {view === "admin" && <UserAdmin />}{" "}
            {view === "orders" && <PendingOrders />}
            {view === "backup" && <DataBackup />}
            {/* Nouveau rendu conditionnel pour l'admin */}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
