import React, { useState, useEffect } from "react";
import "../styles/ClothingForm.css";
import { getShoppingWebsiteTips } from "../utils/urlHelper";

function ClothingForm({ onSubmit, clothing, onCancel }) {
  // Initialiser l'état avec les valeurs par défaut ou les valeurs du vêtement à modifier
  const [form, setForm] = useState({
    name: "",
    type: "",
    color: "",
    season: "",
    imageUrl: "",
    imageSource: "upload", // 'upload' ou 'url'
  });

  const [imagePreview, setImagePreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [imageError, setImageError] = useState("");

  // Si un vêtement est fourni pour modification, remplir le formulaire
  useEffect(() => {
    if (clothing) {
      setForm({
        ...clothing,
        imageSource: clothing.imageUrl ? "url" : "upload", // Par défaut, supposer que les images existantes viennent d'URL
      });
      setImagePreview(clothing.imageUrl || "");
    }
  }, [clothing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Simuler le chargement d'une image
    // Dans une vraie application, vous utiliseriez un service de stockage
    setIsUploading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result;
      setImagePreview(imageUrl);
      setForm({ ...form, imageUrl, imageSource: "upload" });
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setForm({ ...form, imageUrl: url, imageSource: "url" });

    // Réinitialiser l'erreur précédente
    if (imageError) setImageError("");

    // Pas besoin de prévisualiser une URL vide
    if (!url) {
      setImagePreview("");
      return;
    }

    // Prévisualiser l'image depuis l'URL
    setImagePreview(url);
  };

  // Gérer l'erreur de chargement d'une image depuis une URL
  const handleImageError = () => {
    setImageError(
      "Impossible de charger l'image depuis cette URL. Vérifiez que l'URL est correcte et accessible."
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation de base
    if (!form.name || !form.type || !form.color) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    // Soumission du formulaire
    onSubmit(form);
  };

  // Composant d'aide pour les URL d'images
  const ImageUrlHelp = () => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const tips = getShoppingWebsiteTips();

    return (
      <div className="url-help-text">
        <p>Pour utiliser une image d'un site marchand :</p>
        <ol>
          <li>Rendez-vous sur la page du produit</li>
          <li>Faites un clic droit sur l'image du vêtement</li>
          <li>Sélectionnez "Ouvrir l'image dans un nouvel onglet"</li>
          <li>Copiez l'URL de la nouvelle page qui s'ouvre</li>
        </ol>

        <button
          type="button"
          className="toggle-advanced-help"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced
            ? "Masquer l'aide avancée"
            : "Afficher l'aide pour les sites spécifiques"}
        </button>

        {showAdvanced && (
          <div className="advanced-help">
            <p>Aide spécifique pour les sites populaires :</p>
            <ul className="site-tips">
              {tips.map((site, index) => (
                <li key={index}>
                  <strong>{site.name}</strong>: {site.tip}
                </li>
              ))}
            </ul>

            <p>
              Pour le site <strong>amosesclothing.com</strong> :
            </p>
            <ol>
              <li>Faites un clic droit sur l'image principale du produit</li>
              <li>Sélectionnez "Ouvrir l'image dans un nouvel onglet"</li>
              <li>
                L'URL devrait ressembler à quelque chose comme
                "https://cdn.shopify.com/s/files/..."
              </li>
              <li>Copiez cette URL dans le champ ci-dessus</li>
            </ol>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="clothing-form-container">
      <h2>{clothing ? "Modifier un vêtement" : "Ajouter un vêtement"}</h2>

      <form className="clothing-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nom*</label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="type">Type*</label>
          <select
            id="type"
            name="type"
            value={form.type}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionnez un type</option>
            <option value="haut">Haut</option>
            <option value="bas">Bas</option>
            <option value="chaussures">Chaussures</option>
            <option value="accessoire">Accessoire</option>
            <option value="veste">Veste</option>
            <option value="robe">Robe</option>
            <option value="autre">Autre</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="color">Couleur*</label>
          <input
            type="text"
            id="color"
            name="color"
            value={form.color}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="season">Saison</label>
          <select
            id="season"
            name="season"
            value={form.season}
            onChange={handleChange}
          >
            <option value="">Toutes saisons</option>
            <option value="printemps">Printemps</option>
            <option value="été">Été</option>
            <option value="automne">Automne</option>
            <option value="hiver">Hiver</option>
          </select>
        </div>

        <div className="form-group">
          <label>Source de l'image</label>
          <div className="image-source-options">
            <label className="radio-label">
              <input
                type="radio"
                name="imageSource"
                value="upload"
                checked={form.imageSource === "upload"}
                onChange={() => setForm({ ...form, imageSource: "upload" })}
              />
              Télécharger une image
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="imageSource"
                value="url"
                checked={form.imageSource === "url"}
                onChange={() => setForm({ ...form, imageSource: "url" })}
              />
              Utiliser un lien URL
            </label>
          </div>
        </div>

        {form.imageSource === "upload" ? (
          <div className="form-group">
            <label htmlFor="image">Télécharger une image</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
            />
            {isUploading && <p>Chargement de l'image...</p>}
          </div>
        ) : (
          <div className="form-group">
            <label htmlFor="imageUrl">URL de l'image</label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleImageUrlChange}
              placeholder="https://exemple.com/image.jpg"
            />
            <ImageUrlHelp />
            {imageError && <p className="error-message">{imageError}</p>}
          </div>
        )}

        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Aperçu" onError={handleImageError} />
          </div>
        )}

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Annuler
          </button>
          <button type="submit" className="submit-btn" disabled={isUploading}>
            {clothing ? "Mettre à jour" : "Ajouter"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ClothingForm;
