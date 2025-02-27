import React, { useState } from "react";
import ClothingItem from "./ClothingItem";
import WardrobeSummary from "./WardrobeSummary";
import "../styles/ClothingList.css";
import {
  getMainCategories,
  getSubCategories,
} from "../utils/clothingCategories";

function ClothingList({ clothes, onDelete, onEdit }) {
  const [filter, setFilter] = useState({
    type: "",
    subType: "",
    color: "",
    season: "",
  });

  const [showSummary, setShowSummary] = useState(true); // État pour afficher/masquer le résumé

  // Ajouter un state pour les sous-catégories disponibles dans le filtre
  const [filterSubCategories, setFilterSubCategories] = useState({});

  // Obtenir les valeurs uniques pour les filtres
  const colors = [...new Set(clothes.map((item) => item.color))];
  const seasons = [
    ...new Set(
      clothes.filter((item) => item.season).map((item) => item.season)
    ),
  ];

  // Gérer le changement de filtre
  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    if (name === "type") {
      // Réinitialiser la sous-catégorie quand la catégorie principale change
      setFilter({ ...filter, [name]: value, subType: "" });
      // Mettre à jour les sous-catégories disponibles
      setFilterSubCategories(value ? getSubCategories(value) : {});
    } else {
      setFilter({ ...filter, [name]: value });
    }
  };

  // Filtrer les vêtements
  const filteredClothes = clothes.filter((item) => {
    return (
      (filter.type === "" || item.type === filter.type) &&
      (filter.subType === "" || item.subType === filter.subType) &&
      (filter.color === "" || item.color === filter.color) &&
      (filter.season === "" || item.season === filter.season)
    );
  });

  // Réinitialiser les filtres
  const resetFilters = () => {
    setFilter({ type: "", subType: "", color: "", season: "" });
    setFilterSubCategories({});
  };

  return (
    <div className="clothing-list-container">
      {/* Ajouter le résumé de la garde-robe */}
      {showSummary && <WardrobeSummary clothes={clothes} />}

      <div className="list-header">
        <h2>Liste de mes vêtements ({clothes.length})</h2>
        <button
          className="toggle-summary-btn"
          onClick={() => setShowSummary(!showSummary)}
        >
          {showSummary ? "Masquer le résumé" : "Afficher le résumé"}
        </button>
      </div>

      <div className="filters">
        <h3>Filtres</h3>

        <div className="filter-group">
          <label htmlFor="type-filter">Catégorie</label>
          <select
            id="type-filter"
            name="type"
            value={filter.type}
            onChange={handleFilterChange}
          >
            <option value="">Toutes</option>
            {Object.entries(getMainCategories()).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {filter.type && Object.keys(filterSubCategories).length > 0 && (
          <div className="filter-group">
            <label htmlFor="subType-filter">Sous-catégorie</label>
            <select
              id="subType-filter"
              name="subType"
              value={filter.subType}
              onChange={handleFilterChange}
            >
              <option value="">Toutes</option>
              {Object.entries(filterSubCategories).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="filter-group">
          <label htmlFor="color-filter">Couleur</label>
          <select
            id="color-filter"
            name="color"
            value={filter.color}
            onChange={handleFilterChange}
          >
            <option value="">Toutes</option>
            {colors.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="season-filter">Saison</label>
          <select
            id="season-filter"
            name="season"
            value={filter.season}
            onChange={handleFilterChange}
          >
            <option value="">Toutes</option>
            {seasons.map((season) => (
              <option key={season} value={season}>
                {season}
              </option>
            ))}
          </select>
        </div>

        <button className="reset-filter-btn" onClick={resetFilters}>
          Réinitialiser les filtres
        </button>
      </div>

      <div className="clothing-grid">
        {filteredClothes.length > 0 ? (
          filteredClothes.map((item) => (
            <ClothingItem
              key={item.id}
              item={item}
              onDelete={onDelete}
              onEdit={onEdit}
              selectable={false}
            />
          ))
        ) : (
          <p className="no-items">
            Aucun vêtement trouvé. Ajoutez-en ou modifiez vos filtres.
          </p>
        )}
      </div>
    </div>
  );
}

export default ClothingList;
