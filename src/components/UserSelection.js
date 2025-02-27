import React from "react";
import {
  getAuthorizedUsers,
  loginUser,
  logoutUser,
  getCurrentUser,
} from "../utils/simpleAuthService";
import "../styles/UserSelection.css";

function UserSelection() {
  const users = getAuthorizedUsers();
  const currentUser = getCurrentUser();

  const handleUserSelection = (userId) => {
    loginUser(userId);
    // Forcer le rechargement de la page pour mettre à jour les données
    window.location.reload();
  };

  const handleLogout = () => {
    logoutUser();
    // Forcer le rechargement de la page pour mettre à jour les données
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
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserSelection;
