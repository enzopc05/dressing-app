import React, { useState } from "react";
import { exportUserData, importUserData } from "../utils/dataService";
import { getCurrentUserId } from "../utils/simpleAuthService";
import "../styles/DataBackup.css";

function DataBackup() {
  const [importStatus, setImportStatus] = useState(null);
  const [exportStatus, setExportStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Exporter les données
  const handleExport = () => {
    setIsLoading(true);
    setExportStatus(null);

    try {
      const userId = getCurrentUserId();
      const data = exportUserData(userId);

      // Convertir en JSON et créer un fichier téléchargeable
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `dressing-virtuel-sauvegarde-${new Date()
        .toISOString()
        .slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setExportStatus({
        success: true,
        message: "Sauvegarde exportée avec succès!",
      });
    } catch (error) {
      setExportStatus({
        success: false,
        message: `Erreur lors de l'exportation: ${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Importer les données
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsLoading(true);
    setImportStatus(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        const userId = getCurrentUserId();

        // Validation basique du fichier
        if (!data.clothes || !data.outfits) {
          throw new Error(
            "Format de fichier invalide. Certaines données sont manquantes."
          );
        }

        // Importer les données
        const result = importUserData(data, userId);

        if (result) {
          setImportStatus({
            success: true,
            message: "Données importées avec succès! La page va se recharger.",
            details: {
              vetements: data.clothes?.length || 0,
              tenues: data.outfits?.length || 0,
              commandes: data.pendingOrders?.length || 0,
            },
          });

          // Recharger la page après 2 secondes
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          throw new Error("Échec de l'importation des données.");
        }
      } catch (error) {
        setImportStatus({
          success: false,
          message: `Erreur lors de l'importation: ${error.message}`,
        });
      } finally {
        setIsLoading(false);
        // Réinitialiser le champ de fichier
        event.target.value = "";
      }
    };

    reader.onerror = () => {
      setImportStatus({
        success: false,
        message: "Erreur lors de la lecture du fichier.",
      });
      setIsLoading(false);
    };

    reader.readAsText(file);
  };

  return (
    <div className="data-backup-container">
      <h2>Sauvegarde et Restauration des Données</h2>

      <div className="backup-section">
        <div className="backup-card export-card">
          <h3>Exporter vos données</h3>
          <p>
            Téléchargez une sauvegarde de toutes vos données (vêtements, tenues,
            commandes, etc.) sous forme de fichier JSON. Vous pourrez utiliser
            ce fichier pour restaurer vos données ultérieurement.
          </p>
          <button
            className="export-btn"
            onClick={handleExport}
            disabled={isLoading}
          >
            {isLoading ? "Exportation en cours..." : "Exporter mes données"}
          </button>

          {exportStatus && (
            <div
              className={`status-message ${
                exportStatus.success ? "success" : "error"
              }`}
            >
              {exportStatus.message}
            </div>
          )}
        </div>

        <div className="backup-card import-card">
          <h3>Restaurer vos données</h3>
          <p>
            Importez une sauvegarde précédemment exportée pour restaurer votre
            dressing, vos tenues et vos commandes. <strong>Attention:</strong>{" "}
            Cela remplacera toutes vos données actuelles!
          </p>
          <label className="import-label">
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              disabled={isLoading}
              className="import-input"
            />
            <span className="import-btn">
              {isLoading
                ? "Importation en cours..."
                : "Importer une sauvegarde"}
            </span>
          </label>

          {importStatus && (
            <div
              className={`status-message ${
                importStatus.success ? "success" : "error"
              }`}
            >
              {importStatus.message}

              {importStatus.success && importStatus.details && (
                <div className="import-details">
                  <p>Résumé des données importées:</p>
                  <ul>
                    <li>{importStatus.details.vetements} vêtements</li>
                    <li>{importStatus.details.tenues} tenues</li>
                    <li>
                      {importStatus.details.commandes} commandes en attente
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="backup-tips">
        <h3>Conseils de sauvegarde</h3>
        <ul>
          <li>Exportez régulièrement vos données pour éviter toute perte.</li>
          <li>Conservez votre fichier de sauvegarde dans un endroit sûr.</li>
          <li>
            Si vous utilisez plusieurs appareils, exportez et importez vos
            données pour les synchroniser.
          </li>
          <li>
            En navigation privée, vos données seront perdues à la fermeture du
            navigateur. Pensez à les exporter avant!
          </li>
        </ul>
      </div>
    </div>
  );
}

export default DataBackup;
