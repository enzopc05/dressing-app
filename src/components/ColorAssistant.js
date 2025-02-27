import React, { useState } from "react";
import {
  suggestColorCombinations,
  checkColorHarmony,
  colorMap,
} from "../utils/colorTheory";
import "../styles/ColorAssistant.css";

function ColorAssistant() {
  const [selectedColor, setSelectedColor] = useState("");
  const [customColor, setCustomColor] = useState("");
  const [suggestions, setSuggestions] = useState(null);
  const [harmonyCheck, setHarmonyCheck] = useState(null);
  const [secondColor, setSecondColor] = useState("");

  // Récupérer la liste des couleurs disponibles
  const availableColors = Object.keys(colorMap).sort();

  // Gérer la sélection d'une couleur dans la liste déroulante
  const handleColorSelect = (e) => {
    const color = e.target.value;
    setSelectedColor(color);
    if (color) {
      setSuggestions(suggestColorCombinations(color));
      setCustomColor("");
    } else {
      setSuggestions(null);
    }
  };

  // Gérer la saisie d'une couleur personnalisée
  const handleCustomColorChange = (e) => {
    setCustomColor(e.target.value);
  };

  // Gérer la soumission d'une couleur personnalisée
  const handleCustomColorSubmit = (e) => {
    e.preventDefault();
    if (customColor.trim()) {
      const suggestions = suggestColorCombinations(customColor);
      setSuggestions(suggestions);
      setSelectedColor("");
    }
  };

  // Gérer la vérification d'harmonie entre deux couleurs
  const handleHarmonyCheck = (e) => {
    e.preventDefault();
    if ((selectedColor || customColor) && secondColor) {
      const colorToCheck = selectedColor || customColor;
      const harmonyResult = checkColorHarmony(colorToCheck, secondColor);
      setHarmonyCheck(harmonyResult);
    }
  };

  // Afficher la pastille de couleur
  const ColorSwatch = ({ colorName }) => {
    const hexColor = colorMap[colorName] || "#CCCCCC";
    return (
      <span
        className="color-swatch"
        style={{ backgroundColor: hexColor }}
        title={colorName}
      />
    );
  };

  return (
    <div className="color-assistant">
      <h2>Assistant de combinaison de couleurs</h2>

      <div className="color-assistant-container">
        <div className="color-selection-section">
          <h3>Choisissez une couleur</h3>

          <div className="color-selection">
            <select
              value={selectedColor}
              onChange={handleColorSelect}
              className="color-dropdown"
            >
              <option value="">Sélectionnez une couleur</option>
              {availableColors.map((color) => (
                <option key={color} value={color}>
                  {color.charAt(0).toUpperCase() + color.slice(1)}
                </option>
              ))}
            </select>

            <div className="or-divider">OU</div>

            <form
              onSubmit={handleCustomColorSubmit}
              className="custom-color-form"
            >
              <input
                type="text"
                value={customColor}
                onChange={handleCustomColorChange}
                placeholder="Entrez une couleur"
                className="custom-color-input"
              />
              <button type="submit" className="custom-color-btn">
                Trouver des combinaisons
              </button>
            </form>
          </div>
        </div>

        {suggestions && (
          <div className="suggestions-section">
            <h3>Suggestions de combinaisons</h3>

            {suggestions.message && (
              <p className="suggestion-message">{suggestions.message}</p>
            )}

            {suggestions.complementaires &&
              suggestions.complementaires.length > 0 && (
                <div className="suggestion-group">
                  <h4>Couleurs complémentaires</h4>
                  <p className="suggestion-description">
                    Les couleurs complémentaires créent un contraste fort et
                    dynamique.
                  </p>
                  <div className="color-list">
                    {suggestions.complementaires.map((color) => (
                      <div key={color} className="color-item">
                        <ColorSwatch colorName={color} />
                        <span>
                          {color.charAt(0).toUpperCase() + color.slice(1)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {suggestions.analogues && suggestions.analogues.length > 0 && (
              <div className="suggestion-group">
                <h4>Couleurs analogues</h4>
                <p className="suggestion-description">
                  Les couleurs analogues sont proches sur la roue chromatique et
                  créent une harmonie naturelle.
                </p>
                <div className="color-list">
                  {suggestions.analogues.map((color) => (
                    <div key={color} className="color-item">
                      <ColorSwatch colorName={color} />
                      <span>
                        {color.charAt(0).toUpperCase() + color.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {suggestions.triades && suggestions.triades.length > 0 && (
              <div className="suggestion-group">
                <h4>Combinaisons triadiques</h4>
                <p className="suggestion-description">
                  Les triades sont trois couleurs équidistantes sur la roue
                  chromatique, offrant un équilibre vibrant.
                </p>
                <div className="color-list">
                  {suggestions.triades.map((color) => (
                    <div key={color} className="color-item">
                      <ColorSwatch colorName={color} />
                      <span>
                        {color.charAt(0).toUpperCase() + color.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="suggestion-group">
              <h4>Couleurs neutres</h4>
              <p className="suggestion-description">
                Les couleurs neutres se combinent bien avec presque toutes les
                autres couleurs.
              </p>
              <div className="color-list">
                {suggestions.neutres.map((color) => (
                  <div key={color} className="color-item">
                    <ColorSwatch colorName={color} />
                    <span>
                      {color.charAt(0).toUpperCase() + color.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="harmony-checker-section">
          <h3>Vérifier l'harmonie entre deux couleurs</h3>

          <form onSubmit={handleHarmonyCheck} className="harmony-form">
            <div className="harmony-inputs">
              <div className="harmony-color">
                <label>Première couleur</label>
                <div className="color-input-container">
                  {selectedColor || customColor ? (
                    <span className="selected-color-display">
                      {selectedColor || customColor}
                    </span>
                  ) : (
                    <span className="selected-color-prompt">
                      Sélectionnez une couleur ci-dessus
                    </span>
                  )}
                </div>
              </div>

              <div className="harmony-color">
                <label>Deuxième couleur</label>
                <select
                  value={secondColor}
                  onChange={(e) => setSecondColor(e.target.value)}
                  className="color-dropdown"
                  required
                >
                  <option value="">Sélectionnez une couleur</option>
                  {availableColors.map((color) => (
                    <option key={color} value={color}>
                      {color.charAt(0).toUpperCase() + color.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="harmony-check-btn"
              disabled={!((selectedColor || customColor) && secondColor)}
            >
              Vérifier l'harmonie
            </button>
          </form>

          {harmonyCheck && (
            <div className={`harmony-result ${harmonyCheck.level}`}>
              <h4>Résultat</h4>
              <p>{harmonyCheck.explanation}</p>
              <div className="harmony-display">
                <div
                  className="harmony-color-box"
                  style={{
                    backgroundColor:
                      colorMap[selectedColor] ||
                      colorMap[
                        Object.keys(colorMap).find((key) =>
                          key.toLowerCase().includes(customColor.toLowerCase())
                        )
                      ] ||
                      "#CCCCCC",
                  }}
                ></div>
                <span className="harmony-plus">+</span>
                <div
                  className="harmony-color-box"
                  style={{
                    backgroundColor: colorMap[secondColor] || "#CCCCCC",
                  }}
                ></div>
                <span className="harmony-equals">=</span>
                <div
                  className={`harmony-badge ${
                    harmonyCheck.harmony ? "harmony-good" : "harmony-bad"
                  }`}
                >
                  {harmonyCheck.harmony ? "Harmonieux" : "Difficile"}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="color-theory-info">
        <h3>Guide de théorie des couleurs</h3>
        <div className="color-theory-content">
          <div className="color-theory-section">
            <h4>Couleurs complémentaires</h4>
            <p>
              Les couleurs complémentaires sont situées à l'opposé l'une de
              l'autre sur la roue chromatique. Elles créent un fort contraste
              visuel et peuvent être utilisées pour mettre en valeur des
              éléments spécifiques.
            </p>
            <p>Exemples : rouge et vert, bleu et orange, jaune et violet.</p>
          </div>

          <div className="color-theory-section">
            <h4>Couleurs analogues</h4>
            <p>
              Les couleurs analogues sont adjacentes sur la roue chromatique.
              Elles créent des combinaisons harmonieuses et naturelles qui sont
              agréables à l'œil.
            </p>
            <p>
              Exemples : bleu, bleu-vert et vert ou rouge, rouge-orange et
              orange.
            </p>
          </div>

          <div className="color-theory-section">
            <h4>Combinaisons triadiques</h4>
            <p>
              Les triades sont trois couleurs équidistantes sur la roue
              chromatique. Elles offrent un bon équilibre entre harmonie et
              contraste.
            </p>
            <p>Exemples : rouge, jaune et bleu ou orange, vert et violet.</p>
          </div>

          <div className="color-theory-section">
            <h4>Règle 60-30-10</h4>
            <p>Pour une tenue équilibrée, utilisez :</p>
            <ul>
              <li>60% de couleur dominante (souvent neutre)</li>
              <li>30% de couleur secondaire (pour créer de l'intérêt)</li>
              <li>10% de couleur d'accent (pour les accessoires)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ColorAssistant;
