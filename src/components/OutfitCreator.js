import React, { useState, useEffect } from "react";
import ClothingItem from "./ClothingItem";
import "../styles/OutfitCreator.css";
import {
  getOutfits,
  saveOutfits,
  addOutfit,
  deleteOutfit,
} from "../utils/dataService";

function OutfitCreator({ clothes }) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [outfitName, setOutfitName] = useState("");
  const [savedOutfits, setSavedOutfits] = useState([]);

  // Charger les tenues sauvegardées
  useEffect(() => {
    const loadedOutfits = getOutfits();
    setSavedOutfits(loadedOutfits);
  }, []);

  // Grouper les vêtements par type
  const groupedClothes = clothes.reduce((groups, item) => {
    const type = item.type || "autre";
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(item);
    return groups;
  }, {});

  // Vérifier si un vêtement est sélectionné
  const isSelected = (item) => {
    return selectedItems.some((selected) => selected.id === item.id);
  };

  // Gérer la sélection/désélection d'un vêtement
  const toggleSelect = (item) => {
    if (isSelected(item)) {
      setSelectedItems(
        selectedItems.filter((selected) => selected.id !== item.id)
      );
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  // Sauvegarder une tenue
  const saveOutfit = () => {
    if (selectedItems.length === 0) {
      alert("Veuillez sélectionner au moins un vêtement");
      return;
    }

    if (!outfitName.trim()) {
      alert("Veuillez donner un nom à votre tenue");
      return;
    }

    const newOutfit = {
      name: outfitName,
      items: selectedItems,
    };

    // Ajouter la tenue via le service de données
    const outfitId = addOutfit(newOutfit);

    // Mettre à jour l'état local
    const outfitWithId = {
      ...newOutfit,
      id: outfitId,
    };

    setSavedOutfits([...savedOutfits, outfitWithId]);

    // Réinitialiser
    setSelectedItems([]);
    setOutfitName("");

    alert("Tenue sauvegardée !");
  };

  // Supprimer une tenue
  const handleDeleteOutfit = (outfitId) => {
    if (deleteOutfit(outfitId)) {
      const updatedOutfits = savedOutfits.filter(
        (outfit) => outfit.id !== outfitId
      );
      setSavedOutfits(updatedOutfits);
    }
  };

  return (
    <div className="outfit-creator">
      <div className="outfit-builder">
        <h2>Créer une tenue</h2>

        <div className="outfit-name-field">
          <label htmlFor="outfit-name">Nom de la tenue:</label>
          <input
            type="text"
            id="outfit-name"
            value={outfitName}
            onChange={(e) => setOutfitName(e.target.value)}
            placeholder="Ex: Tenue de soirée"
          />
        </div>

        <div className="selected-items">
          <h3>Vêtements sélectionnés ({selectedItems.length})</h3>
          {selectedItems.length > 0 ? (
            <div className="selected-grid">
              {selectedItems.map((item) => (
                <div key={item.id} className="selected-item">
                  <img src={item.imageUrl} alt={item.name} />
                  <p>{item.name}</p>
                  <button
                    className="remove-btn"
                    onClick={() => toggleSelect(item)}
                  >
                    Retirer
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>Aucun vêtement sélectionné</p>
          )}

          <button
            className="save-outfit-btn"
            onClick={saveOutfit}
            disabled={selectedItems.length === 0 || !outfitName.trim()}
          >
            Sauvegarder cette tenue
          </button>
        </div>

        <div className="available-items">
          <h3>Vêtements disponibles</h3>

          {Object.entries(groupedClothes).map(([type, items]) => (
            <div key={type} className="clothing-type-section">
              <h4>{type.charAt(0).toUpperCase() + type.slice(1)}s</h4>
              <div className="clothing-group">
                {items.map((item) => (
                  <ClothingItem
                    key={item.id}
                    item={item}
                    selectable={true}
                    onSelect={toggleSelect}
                    isSelected={isSelected(item)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="saved-outfits">
        <h2>Tenues sauvegardées</h2>

        {savedOutfits.length > 0 ? (
          <div className="outfits-list">
            {savedOutfits.map((outfit) => (
              <div key={outfit.id} className="saved-outfit">
                <h3>{outfit.name}</h3>
                <div className="outfit-items">
                  {outfit.items.map((item) => (
                    <div key={item.id} className="outfit-item">
                      <img src={item.imageUrl} alt={item.name} />
                      <p>{item.name}</p>
                    </div>
                  ))}
                </div>
                <button
                  className="delete-outfit"
                  onClick={() => handleDeleteOutfit(outfit.id)}
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>Aucune tenue sauvegardée</p>
        )}
      </div>
    </div>
  );
}

export default OutfitCreator;
