import React, { useState } from 'react';
import ClothingItem from './ClothingItem';
import '../styles/ClothingList.css';

function ClothingList({ clothes, onDelete, onEdit }) {
  const [filter, setFilter] = useState({
    type: '',
    color: '',
    season: ''
  });

  // Obtenir les valeurs uniques pour les filtres
  const types = [...new Set(clothes.map(item => item.type))];
  const colors = [...new Set(clothes.map(item => item.color))];
  const seasons = [...new Set(clothes.filter(item => item.season).map(item => item.season))];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  // Filtrer les vêtements
  const filteredClothes = clothes.filter(item => {
    return (
      (filter.type === '' || item.type === filter.type) &&
      (filter.color === '' || item.color === filter.color) &&
      (filter.season === '' || item.season === filter.season)
    );
  });

  // Réinitialiser les filtres
  const resetFilters = () => {
    setFilter({ type: '', color: '', season: '' });
  };

  return (
    <div className="clothing-list-container">
      <div className="filters">
        <h3>Filtres</h3>
        
        <div className="filter-group">
          <label htmlFor="type-filter">Type</label>
          <select
            id="type-filter"
            name="type"
            value={filter.type}
            onChange={handleFilterChange}
          >
            <option value="">Tous</option>
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="color-filter">Couleur</label>
          <select
            id="color-filter"
            name="color"
            value={filter.color}
            onChange={handleFilterChange}
          >
            <option value="">Toutes</option>
            {colors.map(color => (
              <option key={color} value={color}>{color}</option>
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
            {seasons.map(season => (
              <option key={season} value={season}>{season}</option>
            ))}
          </select>
        </div>
        
        <button className="reset-filter-btn" onClick={resetFilters}>
          Réinitialiser les filtres
        </button>
      </div>
      
      <div className="clothing-grid">
        {filteredClothes.length > 0 ? (
          filteredClothes.map(item => (
            <ClothingItem
              key={item.id}
              item={item}
              onDelete={onDelete}
              onEdit={onEdit}
              selectable={false}
            />
          ))
        ) : (
          <p className="no-items">Aucun vêtement trouvé. Ajoutez-en ou modifiez vos filtres.</p>
        )}
      </div>
    </div>
  );
}

export default ClothingList;