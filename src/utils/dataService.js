/**
 * Service de gestion des données pour l'application Dressing
 * Préparé pour une future migration vers une base de données et des comptes utilisateurs
 */

// Identifiant temporaire de l'utilisateur (sera remplacé par un système d'authentification)
const TEMP_USER_ID = "default-user";

// Clés de stockage
const STORAGE_KEYS = {
  CLOTHES: "wardrobeClothes",
  OUTFITS: "savedOutfits",
  USER_PREFS: "userPreferences",
};

/**
 * Récupère les vêtements de l'utilisateur
 * @param {string} userId - Identifiant de l'utilisateur (facultatif)
 * @returns {Array} - Tableau des vêtements
 */
export const getClothes = (userId = TEMP_USER_ID) => {
  try {
    const storedData = localStorage.getItem(
      `${STORAGE_KEYS.CLOTHES}_${userId}`
    );
    return storedData ? JSON.parse(storedData) : [];
  } catch (error) {
    console.error("Erreur lors de la récupération des vêtements:", error);
    return [];
  }
};

/**
 * Sauvegarde les vêtements de l'utilisateur
 * @param {Array} clothes - Tableau des vêtements
 * @param {string} userId - Identifiant de l'utilisateur (facultatif)
 */
export const saveClothes = (clothes, userId = TEMP_USER_ID) => {
  try {
    localStorage.setItem(
      `${STORAGE_KEYS.CLOTHES}_${userId}`,
      JSON.stringify(clothes)
    );
    return true;
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des vêtements:", error);
    return false;
  }
};

/**
 * Récupère les tenues de l'utilisateur
 * @param {string} userId - Identifiant de l'utilisateur (facultatif)
 * @returns {Array} - Tableau des tenues
 */
export const getOutfits = (userId = TEMP_USER_ID) => {
  try {
    const storedData = localStorage.getItem(
      `${STORAGE_KEYS.OUTFITS}_${userId}`
    );
    return storedData ? JSON.parse(storedData) : [];
  } catch (error) {
    console.error("Erreur lors de la récupération des tenues:", error);
    return [];
  }
};

/**
 * Sauvegarde les tenues de l'utilisateur
 * @param {Array} outfits - Tableau des tenues
 * @param {string} userId - Identifiant de l'utilisateur (facultatif)
 */
export const saveOutfits = (outfits, userId = TEMP_USER_ID) => {
  try {
    localStorage.setItem(
      `${STORAGE_KEYS.OUTFITS}_${userId}`,
      JSON.stringify(outfits)
    );
    return true;
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des tenues:", error);
    return false;
  }
};

/**
 * Récupère les préférences de l'utilisateur
 * @param {string} userId - Identifiant de l'utilisateur (facultatif)
 * @returns {Object} - Préférences de l'utilisateur
 */
export const getUserPreferences = (userId = TEMP_USER_ID) => {
  try {
    const storedData = localStorage.getItem(
      `${STORAGE_KEYS.USER_PREFS}_${userId}`
    );
    return storedData ? JSON.parse(storedData) : {};
  } catch (error) {
    console.error("Erreur lors de la récupération des préférences:", error);
    return {};
  }
};

/**
 * Sauvegarde les préférences de l'utilisateur
 * @param {Object} preferences - Préférences de l'utilisateur
 * @param {string} userId - Identifiant de l'utilisateur (facultatif)
 */
export const saveUserPreferences = (preferences, userId = TEMP_USER_ID) => {
  try {
    localStorage.setItem(
      `${STORAGE_KEYS.USER_PREFS}_${userId}`,
      JSON.stringify(preferences)
    );
    return true;
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des préférences:", error);
    return false;
  }
};

/**
 * Ajoute un nouveau vêtement
 * @param {Object} clothing - Objet vêtement à ajouter
 * @param {string} userId - Identifiant de l'utilisateur (facultatif)
 * @returns {string} - Identifiant du vêtement ajouté
 */
export const addClothing = (clothing, userId = TEMP_USER_ID) => {
  const clothes = getClothes(userId);
  const newId = Date.now().toString();

  const newClothing = {
    ...clothing,
    id: newId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  clothes.push(newClothing);
  saveClothes(clothes, userId);

  return newId;
};

/**
 * Met à jour un vêtement existant
 * @param {Object} clothing - Objet vêtement à mettre à jour
 * @param {string} userId - Identifiant de l'utilisateur (facultatif)
 * @returns {boolean} - Succès de la mise à jour
 */
export const updateClothing = (clothing, userId = TEMP_USER_ID) => {
  const clothes = getClothes(userId);
  const index = clothes.findIndex((item) => item.id === clothing.id);

  if (index === -1) return false;

  const updatedClothing = {
    ...clothing,
    updatedAt: new Date().toISOString(),
  };

  clothes[index] = updatedClothing;
  saveClothes(clothes, userId);

  return true;
};

/**
 * Supprime un vêtement
 * @param {string} clothingId - Identifiant du vêtement à supprimer
 * @param {string} userId - Identifiant de l'utilisateur (facultatif)
 * @returns {boolean} - Succès de la suppression
 */
export const deleteClothing = (clothingId, userId = TEMP_USER_ID) => {
  const clothes = getClothes(userId);
  const filteredClothes = clothes.filter((item) => item.id !== clothingId);

  if (filteredClothes.length === clothes.length) return false;

  saveClothes(filteredClothes, userId);

  // Mettre à jour les tenues qui contiennent ce vêtement
  const outfits = getOutfits(userId);
  let outfitsUpdated = false;

  const updatedOutfits = outfits.map((outfit) => {
    const filteredItems = outfit.items.filter((item) => item.id !== clothingId);

    if (filteredItems.length !== outfit.items.length) {
      outfitsUpdated = true;
      return { ...outfit, items: filteredItems };
    }

    return outfit;
  });

  if (outfitsUpdated) {
    saveOutfits(updatedOutfits, userId);
  }

  return true;
};

/**
 * Ajoute une nouvelle tenue
 * @param {Object} outfit - Objet tenue à ajouter
 * @param {string} userId - Identifiant de l'utilisateur (facultatif)
 * @returns {string} - Identifiant de la tenue ajoutée
 */
export const addOutfit = (outfit, userId = TEMP_USER_ID) => {
  const outfits = getOutfits(userId);
  const newId = Date.now().toString();

  const newOutfit = {
    ...outfit,
    id: newId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  outfits.push(newOutfit);
  saveOutfits(outfits, userId);

  return newId;
};

/**
 * Supprime une tenue
 * @param {string} outfitId - Identifiant de la tenue à supprimer
 * @param {string} userId - Identifiant de l'utilisateur (facultatif)
 * @returns {boolean} - Succès de la suppression
 */
export const deleteOutfit = (outfitId, userId = TEMP_USER_ID) => {
  const outfits = getOutfits(userId);
  const filteredOutfits = outfits.filter((outfit) => outfit.id !== outfitId);

  if (filteredOutfits.length === outfits.length) return false;

  saveOutfits(filteredOutfits, userId);
  return true;
};

/**
 * Exporte toutes les données de l'utilisateur (pour la sauvegarde)
 * @param {string} userId - Identifiant de l'utilisateur (facultatif)
 * @returns {Object} - Données complètes de l'utilisateur
 */
export const exportUserData = (userId = TEMP_USER_ID) => {
  return {
    clothes: getClothes(userId),
    outfits: getOutfits(userId),
    preferences: getUserPreferences(userId),
    exportDate: new Date().toISOString(),
    userId: userId,
  };
};

/**
 * Importe les données d'un utilisateur
 * @param {Object} userData - Données de l'utilisateur à importer
 * @param {string} userId - Identifiant de l'utilisateur (facultatif)
 * @returns {boolean} - Succès de l'importation
 */
export const importUserData = (userData, userId = TEMP_USER_ID) => {
  try {
    if (userData.clothes) saveClothes(userData.clothes, userId);
    if (userData.outfits) saveOutfits(userData.outfits, userId);
    if (userData.preferences) saveUserPreferences(userData.preferences, userId);
    return true;
  } catch (error) {
    console.error("Erreur lors de l'importation des données:", error);
    return false;
  }
};
