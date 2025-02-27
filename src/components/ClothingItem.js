import React from "react";
import "../styles/ClothingItem.css";

function ClothingItem({
  item,
  onDelete,
  onEdit,
  selectable,
  onSelect,
  isSelected,
}) {
  return (
    <div className={`clothing-item ${isSelected ? "selected" : ""}`}>
      <div className="clothing-image">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} />
        ) : (
          <div className="no-image">Pas d'image</div>
        )}
      </div>

      <div className="clothing-details">
        <h3>{item.name}</h3>
        <p className="clothing-type">{item.type}</p>
        <p className="clothing-color">Couleur: {item.color}</p>
        {item.season && (
          <p className="clothing-season">Saison: {item.season}</p>
        )}
      </div>

      <div className="clothing-actions">
        {selectable ? (
          <button className="select-btn" onClick={() => onSelect(item)}>
            {isSelected ? "Désélectionner" : "Sélectionner"}
          </button>
        ) : (
          <>
            <button className="edit-btn" onClick={() => onEdit(item.id)}>
              Modifier
            </button>
            <button className="delete-btn" onClick={() => onDelete(item.id)}>
              Supprimer
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ClothingItem;
