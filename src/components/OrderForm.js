import React, { useState, useEffect } from "react";
import {
  getMainCategories,
  getSubCategories,
} from "../utils/clothingCategories";
import "../styles/OrderForm.css";

function OrderForm({ onSubmit, onCancel }) {
  const [orderInfo, setOrderInfo] = useState({
    name: "",
    store: "",
    expectedDate: "",
    trackingNumber: "",
    note: "",
  });

  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({
    name: "",
    type: "",
    subType: "",
    color: "",
    price: "",
    imageUrl: "", // Ajout du champ imageUrl
  });

  const [subCategories, setSubCategories] = useState({});
  const [errors, setErrors] = useState({});
  const [imageError, setImageError] = useState(false);

  const handleOrderInfoChange = (e) => {
    const { name, value } = e.target;
    setOrderInfo({ ...orderInfo, [name]: value });
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;

    if (name === "type") {
      setCurrentItem({ ...currentItem, [name]: value, subType: "" });
      setSubCategories(getSubCategories(value));
    } else if (name === "price") {
      // Validation pour ne permettre que des nombres et une virgule/point
      const isValidPrice = /^[0-9]*[.,]?[0-9]*$/.test(value);
      if (isValidPrice || value === "") {
        setCurrentItem({ ...currentItem, [name]: value });
      }
    } else {
      setCurrentItem({ ...currentItem, [name]: value });
    }
  };

  // Réinitialiser l'erreur d'image quand l'URL change
  useEffect(() => {
    setImageError(false);
  }, [currentItem.imageUrl]);

  // Fonction pour gérer les erreurs d'image
  const handleImageError = () => {
    setImageError(true);
  };

  const validateItem = () => {
    const newErrors = {};

    if (!currentItem.name) newErrors.name = "Le nom est obligatoire";
    if (!currentItem.type) newErrors.type = "La catégorie est obligatoire";
    if (!currentItem.color) newErrors.color = "La couleur est obligatoire";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addItem = () => {
    if (!validateItem()) return;

    // Formater le prix si nécessaire
    let formattedItem = { ...currentItem };
    if (formattedItem.price) {
      formattedItem.price = parseFloat(formattedItem.price.replace(",", "."));
    }

    // Ajouter l'item à la liste
    formattedItem.id = Date.now().toString();
    setItems([...items, formattedItem]);

    // Réinitialiser le formulaire de l'item
    setCurrentItem({
      name: "",
      type: "",
      subType: "",
      color: "",
      price: "",
      imageUrl: "", // Réinitialiser aussi l'URL de l'image
    });
    setErrors({});
  };

  const removeItem = (itemId) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation de la commande
    if (!orderInfo.name) {
      setErrors({ order: "Le nom de la commande est obligatoire" });
      return;
    }

    if (items.length === 0) {
      setErrors({ order: "Ajoutez au moins un vêtement à la commande" });
      return;
    }

    // Format de la date attendue (si fournie)
    let formattedOrderInfo = { ...orderInfo };
    if (formattedOrderInfo.expectedDate) {
      formattedOrderInfo.expectedDate = new Date(
        formattedOrderInfo.expectedDate
      ).toISOString();
    }

    // Soumettre la commande
    onSubmit({
      ...formattedOrderInfo,
      items: items,
    });
  };

  return (
    <div className="order-form-container">
      <h2>Nouvelle commande en attente</h2>

      {errors.order && <div className="error-message">{errors.order}</div>}

      <form onSubmit={handleSubmit} className="order-form">
        <div className="order-info-section">
          <h3>Informations de commande</h3>

          <div className="form-group">
            <label htmlFor="name">Nom de la commande*</label>
            <input
              type="text"
              id="name"
              name="name"
              value={orderInfo.name}
              onChange={handleOrderInfoChange}
              placeholder="Ex: Commande Zara printemps"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="store">Magasin / Site web</label>
            <input
              type="text"
              id="store"
              name="store"
              value={orderInfo.store}
              onChange={handleOrderInfoChange}
              placeholder="Ex: Zara, Amazon, etc."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="expectedDate">Date de livraison estimée</label>
              <input
                type="date"
                id="expectedDate"
                name="expectedDate"
                value={orderInfo.expectedDate}
                onChange={handleOrderInfoChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="trackingNumber">Numéro de suivi</label>
              <input
                type="text"
                id="trackingNumber"
                name="trackingNumber"
                value={orderInfo.trackingNumber}
                onChange={handleOrderInfoChange}
                placeholder="Ex: 1Z999AA10123456784"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="note">Note</label>
            <textarea
              id="note"
              name="note"
              value={orderInfo.note}
              onChange={handleOrderInfoChange}
              placeholder="Notes additionnelles..."
              rows="3"
            ></textarea>
          </div>
        </div>

        <div className="order-items-section">
          <h3>Vêtements dans la commande</h3>

          <div className="current-items">
            {items.length > 0 ? (
              <ul className="items-list">
                {items.map((item) => (
                  <li key={item.id} className="item-entry">
                    {item.imageUrl && (
                      <div className="item-thumb">
                        <img src={item.imageUrl} alt={item.name} />
                      </div>
                    )}
                    <div className="item-info">
                      <span className="item-name">{item.name}</span>
                      <span className="item-details">
                        {item.type} {item.subType ? `(${item.subType})` : ""},{" "}
                        {item.color}
                        {item.price ? `, ${item.price} €` : ""}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="remove-item-btn"
                      onClick={() => removeItem(item.id)}
                    >
                      Retirer
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-items">Aucun vêtement ajouté à cette commande</p>
            )}
          </div>

          <div className="add-item-form">
            <h4>Ajouter un vêtement</h4>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="item-name">Nom*</label>
                <input
                  type="text"
                  id="item-name"
                  name="name"
                  value={currentItem.name}
                  onChange={handleItemChange}
                  placeholder="Ex: T-shirt rayé"
                />
                {errors.name && (
                  <div className="field-error">{errors.name}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="item-color">Couleur*</label>
                <input
                  type="text"
                  id="item-color"
                  name="color"
                  value={currentItem.color}
                  onChange={handleItemChange}
                  placeholder="Ex: Bleu"
                />
                {errors.color && (
                  <div className="field-error">{errors.color}</div>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="item-type">Catégorie*</label>
                <select
                  id="item-type"
                  name="type"
                  value={currentItem.type}
                  onChange={handleItemChange}
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {Object.entries(getMainCategories()).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <div className="field-error">{errors.type}</div>
                )}
              </div>

              {currentItem.type && Object.keys(subCategories).length > 0 && (
                <div className="form-group">
                  <label htmlFor="item-subType">Sous-catégorie</label>
                  <select
                    id="item-subType"
                    name="subType"
                    value={currentItem.subType}
                    onChange={handleItemChange}
                  >
                    <option value="">Sélectionnez une sous-catégorie</option>
                    {Object.entries(subCategories).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="item-price">Prix (€)</label>
                <input
                  type="text"
                  id="item-price"
                  name="price"
                  value={currentItem.price}
                  onChange={handleItemChange}
                  placeholder="Ex: 29.99"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="item-imageUrl">URL de l'image (facultatif)</label>
              <input
                type="url"
                id="item-imageUrl"
                name="imageUrl"
                value={currentItem.imageUrl}
                onChange={handleItemChange}
                placeholder="https://exemple.com/image.jpg"
              />

              {currentItem.imageUrl && !imageError && (
                <div className="image-preview">
                  <img
                    src={currentItem.imageUrl}
                    alt="Aperçu"
                    onError={handleImageError}
                  />
                </div>
              )}

              {imageError && (
                <div className="image-error">
                  L'image ne peut pas être chargée. Veuillez vérifier l'URL.
                </div>
              )}
            </div>

            <button type="button" className="add-item-btn" onClick={addItem}>
              Ajouter ce vêtement
            </button>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Annuler
          </button>
          <button type="submit" className="submit-btn">
            Enregistrer la commande
          </button>
        </div>
      </form>
    </div>
  );
}

export default OrderForm;
