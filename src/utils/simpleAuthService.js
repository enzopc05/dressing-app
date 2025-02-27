/**
 * Service d'authentification simplifié pour une utilisation entre amis
 */

// Liste prédéfinie des utilisateurs autorisés (par défaut)
const DEFAULT_USERS = [
  { id: "user1", name: "Moi", color: "#3498db", avatar: null },
  { id: "user2", name: "Ami 1", color: "#e74c3c", avatar: null },
  { id: "user3", name: "Ami 2", color: "#2ecc71", avatar: null },
  { id: "user4", name: "Ami 3", color: "#f39c12", avatar: null },
];

// Récupérer les utilisateurs du stockage local ou utiliser les valeurs par défaut
const loadUsers = () => {
  const storedUsers = localStorage.getItem("appUsers");
  if (storedUsers) {
    return JSON.parse(storedUsers);
  }
  // Si aucun utilisateur n'est stocké, initialiser avec les valeurs par défaut
  localStorage.setItem("appUsers", JSON.stringify(DEFAULT_USERS));
  return DEFAULT_USERS;
};

// Sauvegarder les utilisateurs dans le stockage local
const saveUsers = (users) => {
  localStorage.setItem("appUsers", JSON.stringify(users));
};

// Récupérer l'utilisateur actuel du stockage local
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

/**
 * Obtient la liste des utilisateurs autorisés
 * @returns {Array} - Liste des utilisateurs
 */
export const getAuthorizedUsers = () => {
  return loadUsers();
};

/**
 * Connecte un utilisateur par son ID
 * @param {string} userId - ID de l'utilisateur
 * @returns {Object} - Informations de l'utilisateur
 */
export const loginUser = (userId) => {
  const users = loadUsers();
  const user = users.find((u) => u.id === userId);

  if (!user) {
    throw new Error("Utilisateur non autorisé");
  }

  localStorage.setItem("currentUser", JSON.stringify(user));
  currentUser = user;

  return user;
};

/**
 * Déconnecte l'utilisateur actuel
 */
export const logoutUser = () => {
  localStorage.removeItem("currentUser");
  currentUser = null;
};

/**
 * Vérifie si un utilisateur est connecté
 * @returns {boolean} - True si un utilisateur est connecté
 */
export const isLoggedIn = () => {
  return !!currentUser;
};

/**
 * Obtient l'utilisateur actuellement connecté
 * @returns {Object|null} - Utilisateur connecté ou null
 */
export const getCurrentUser = () => {
  return currentUser;
};

/**
 * Obtient l'ID de l'utilisateur actuel
 * @returns {string|null} - ID de l'utilisateur ou null
 */
export const getCurrentUserId = () => {
  return currentUser ? currentUser.id : null;
};

/**
 * Met à jour le profil d'un utilisateur
 * @param {object} updates - Mises à jour du profil (name, color, avatar)
 * @returns {object} - Utilisateur mis à jour
 */
export const updateUserProfile = (updates) => {
  if (!currentUser) {
    throw new Error("Aucun utilisateur connecté");
  }

  const users = loadUsers();
  const userIndex = users.findIndex((u) => u.id === currentUser.id);

  if (userIndex === -1) {
    throw new Error("Utilisateur non trouvé");
  }

  // Mettre à jour les propriétés spécifiées
  const updatedUser = {
    ...users[userIndex],
    ...updates,
  };

  // Mettre à jour l'utilisateur dans la liste
  users[userIndex] = updatedUser;
  saveUsers(users);

  // Mettre à jour l'utilisateur actuel
  localStorage.setItem("currentUser", JSON.stringify(updatedUser));
  currentUser = updatedUser;

  return updatedUser;
};
