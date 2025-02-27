import React, { useState } from "react";
import {
  getAuthorizedUsers,
  loginUser,
  logoutUser,
  getCurrentUser,
} from "../utils/simpleAuthService";
import UserProfile from "./UserProfile";
import "../styles/UserSelection.css";

function UserSelection() {
  const users = getAuthorizedUsers();
  const currentUser = getCurrentUser();
  const [showProfileModal, setShowProfileModal] = useState(false);

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

  const openProfileModal = () => {
    setShowProfileModal(true);
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
  };

  return (
    <div className="user-selection">
      {currentUser ? (
        <div className="current-user">
          <div
            className="user-avatar"
            style={{
              backgroundColor: currentUser.color,
              backgroundImage: currentUser.avatar
                ? `url(${currentUser.avatar})`
                : "none",
            }}
          >
            {!currentUser.avatar && currentUser.name.charAt(0)}
          </div>
          <span className="user-name">{currentUser.name}</span>
          <div className="user-actions">
            <button onClick={openProfileModal} className="edit-profile-button">
              Modifier
            </button>
            <button onClick={handleLogout} className="logout-button">
              Déconnexion
            </button>
          </div>

          {showProfileModal && <UserProfile onClose={closeProfileModal} />}
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
                  style={{
                    backgroundColor: user.color,
                    backgroundImage: user.avatar
                      ? `url(${user.avatar})`
                      : "none",
                  }}
                >
                  {!user.avatar && user.name.charAt(0)}
                </div>
                <span className="user-name">{user.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserSelection;
