import React, { useState, useEffect } from "react";
import {
  getAuthorizedUsers,
  loginUser,
  logoutUser,
  getCurrentUser,
} from "../utils/simpleAuthService";
import "../styles/UserSelection.css";

function UserSelection() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Charger les utilisateurs et l'utilisateur actuel
  useEffect(() => {
    loadUsers();
    setCurrentUser(getCurrentUser());

    // Ajouter un écouteur d'événement pour le stockage local
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Gérer les changements de stockage local
  const handleStorageChange = (e) => {
    if (e.key === "usersList") {
      loadUsers();
    } else if (e.key === "currentUser") {
      setCurrentUser(getCurrentUser());
    }
  };

  // Charger la liste des utilisateurs
  const loadUsers = () => {
    const authorizedUsers = getAuthorizedUsers();
    setUsers(authorizedUsers);
  };

  const handleUserSelection = (userId) => {
    loginUser(userId);
    // Mettre à jour l'utilisateur courant
    setCurrentUser(getCurrentUser());
    // Recharger la page pour mettre à jour les données
    window.location.reload();
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    // Recharger la page pour mettre à jour les données
    window.location.reload();
  };

  return (
    <div className="user-selection">
      {currentUser ? (
        <div className="current-user">
          <div
            className="user-avatar"
            style={{ backgroundColor: currentUser.color }}
          >
            {currentUser.name.charAt(0)}
          </div>
          <span>{currentUser.name}</span>
          {currentUser.isAdmin && <span className="admin-badge">Admin</span>}
          <button onClick={handleLogout} className="logout-button">
            Déconnexion
          </button>
        </div>
      ) : (
        <div className="user-list">
          <h3>Choisir un utilisateur</h3>
          <div className="users">
            {users.map((user) => (
              <div
                key={user.id}
                className="user-item"
                onClick={() => handleUserSelection(user.id)}
              >
                <div
                  className="user-avatar"
                  style={{ backgroundColor: user.color }}
                >
                  {user.name.charAt(0)}
                </div>
                <span>{user.name}</span>
                {user.isAdmin && (
                  <span className="user-admin-indicator">Admin</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserSelection;
