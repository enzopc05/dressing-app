/**
 * Service d'authentification simplifié pour une utilisation entre amis
 */

// Liste prédéfinie des utilisateurs autorisés
const AUTHORIZED_USERS = [
  { id: "user1", name: "Moi", color: "#3498db" },
  { id: "user2", name: "Ami 1", color: "#e74c3c" },
  { id: "user3", name: "Ami 2", color: "#2ecc71" },
  { id: "user4", name: "Ami 3", color: "#f39c12" },
  // Vous pouvez ajouter d'autres utilisateurs ici
];

// Récupérer l'utilisateur actuel du stockage local
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

/**
 * Obtient la liste des utilisateurs autorisés
 * @returns {Array} - Liste des utilisateurs
 */
export const getAuthorizedUsers = () => {
  return AUTHORIZED_USERS;
};

/**
 * Connecte un utilisateur par son ID
 * @param {string} userId - ID de l'utilisateur
 * @returns {Object} - Informations de l'utilisateur
 */
export const loginUser = (userId) => {
  const user = AUTHORIZED_USERS.find((u) => u.id === userId);

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
