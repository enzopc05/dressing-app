import React, { useState } from "react";
import { getCurrentUser, updateUserProfile } from "../utils/simpleAuthService";
import "../styles/UserProfile.css";

function UserProfile({ onClose }) {
  const user = getCurrentUser();
  const [formData, setFormData] = useState({
    name: user.name,
    color: user.color,
    avatar: user.avatar,
  });
  const [avatarPreview, setAvatarPreview] = useState(user.avatar);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result;
      setAvatarPreview(imageUrl);
      setFormData({
        ...formData,
        avatar: imageUrl,
      });
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      updateUserProfile(formData);
      alert("Profil mis à jour avec succès!");

      // Forcer le rechargement de la page pour mettre à jour les données
      window.location.reload();
    } catch (error) {
      alert(`Erreur lors de la mise à jour du profil: ${error.message}`);
    }
  };

  if (!user) return null;

  return (
    <div className="user-profile-modal">
      <div className="user-profile-content">
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        <h2>Modifier mon profil</h2>

        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="avatar-section">
            <div
              className="avatar-preview"
              style={{
                backgroundColor: formData.color,
                backgroundImage: avatarPreview
                  ? `url(${avatarPreview})`
                  : "none",
              }}
            >
              {!avatarPreview && formData.name.charAt(0)}
            </div>

            <div className="avatar-upload">
              <label htmlFor="avatar-upload" className="upload-button">
                Changer la photo
              </label>
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: "none" }}
              />
              {isUploading && <p>Chargement de l'image...</p>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="name">Nom</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="color">Couleur du profil</label>
            <input
              type="color"
              id="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="submit-btn" disabled={isUploading}>
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserProfile;
