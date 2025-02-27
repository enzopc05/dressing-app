import React, { useState, useEffect } from "react";
import {
  getAuthorizedUsers,
  isCurrentUserAdmin,
  addUser,
  updateUser,
  deleteUser,
  getCurrentUser,
} from "../utils/simpleAuthService";
import "../styles/UserAdmin.css";

function UserAdmin() {
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    color: "#3498db",
    isAdmin: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Charger les données au démarrage
  useEffect(() => {
    loadUsers();
    const currentUser = getCurrentUser();
    if (currentUser) {
      setIsAdmin(currentUser.isAdmin);
      setCurrentUserId(currentUser.id);
    }
  }, []);

  // Charger la liste des utilisateurs
  const loadUsers = () => {
    try {
      const usersList = getAuthorizedUsers();
      setUsers(usersList);
    } catch (error) {
      setError(`Erreur lors du chargement des utilisateurs: ${error.message}`);
    }
  };

  // Gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      color: "#3498db",
      isAdmin: false,
    });
    setIsEditing(false);
    setSelectedUser(null);
    setError("");
    setSuccess("");
  };

  // Éditer un utilisateur
  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      id: user.id,
      name: user.name,
      color: user.color,
      isAdmin: user.isAdmin || false,
    });
    setIsEditing(true);
  };

  // Supprimer un utilisateur
  const handleDelete = (userId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur?")) {
      try {
        const result = deleteUser(userId);
        if (result) {
          setSuccess("Utilisateur supprimé avec succès");
          loadUsers();
        } else {
          setError("Impossible de supprimer l'utilisateur");
        }
      } catch (error) {
        setError(`Erreur lors de la suppression: ${error.message}`);
      }
    }
  };

  // Soumettre le formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (isEditing) {
        // Mettre à jour un utilisateur existant
        updateUser(formData);
        setSuccess("Utilisateur mis à jour avec succès");
      } else {
        // Ajouter un nouvel utilisateur
        addUser(formData);
        setSuccess("Nouvel utilisateur ajouté avec succès");
      }
      loadUsers();
      resetForm();
    } catch (error) {
      setError(`Erreur: ${error.message}`);
    }
  };

  // Si l'utilisateur n'est pas administrateur, afficher un message
  if (!isAdmin) {
    return (
      <div className="user-admin no-access">
        <h2>Administration des utilisateurs</h2>
        <p>Vous n'avez pas les droits d'accès à cette section.</p>
      </div>
    );
  }

  return (
    <div className="user-admin">
      <h2>Administration des utilisateurs</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="user-form">
        <h3>
          {isEditing ? "Modifier un utilisateur" : "Ajouter un utilisateur"}
        </h3>

        <div className="form-group">
          <label htmlFor="id">Identifiant</label>
          <input
            type="text"
            id="id"
            name="id"
            value={formData.id}
            onChange={handleChange}
            required
            disabled={isEditing} // Ne pas permettre de modifier l'ID lors de l'édition
          />
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
          <label htmlFor="color">Couleur</label>
          <div className="color-picker-container">
            <input
              type="color"
              id="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="color-picker"
            />
            <input
              type="text"
              value={formData.color}
              onChange={handleChange}
              name="color"
              className="color-text"
            />
          </div>
        </div>

        <div className="form-group checkbox-group">
          <label htmlFor="isAdmin">
            <input
              type="checkbox"
              id="isAdmin"
              name="isAdmin"
              checked={formData.isAdmin}
              onChange={handleChange}
            />
            Administrateur
          </label>
        </div>

        <div className="form-actions">
          <button type="button" onClick={resetForm} className="cancel-btn">
            Annuler
          </button>
          <button type="submit" className="submit-btn">
            {isEditing ? "Mettre à jour" : "Ajouter"}
          </button>
        </div>
      </form>

      <div className="users-list">
        <h3>Utilisateurs ({users.length})</h3>

        {users.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Couleur</th>
                <th>Administrateur</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>
                    <div className="user-name">
                      <div
                        className="user-avatar"
                        style={{ backgroundColor: user.color }}
                      >
                        {user.name.charAt(0)}
                      </div>
                      {user.name}
                      {user.id === currentUserId && " (Vous)"}
                    </div>
                  </td>
                  <td>
                    <div
                      className="color-sample"
                      style={{ backgroundColor: user.color }}
                    >
                      <span className="color-value">{user.color}</span>
                    </div>
                  </td>
                  <td>{user.isAdmin ? "Oui" : "Non"}</td>
                  <td>
                    <div className="user-actions">
                      <button
                        onClick={() => handleEdit(user)}
                        className="edit-user-btn"
                      >
                        Modifier
                      </button>
                      {user.id !== currentUserId && (
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="delete-user-btn"
                        >
                          Supprimer
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Aucun utilisateur trouvé.</p>
        )}
      </div>
    </div>
  );
}

export default UserAdmin;
