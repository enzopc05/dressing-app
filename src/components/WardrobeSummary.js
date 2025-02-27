import React, { useMemo } from "react";
import "../styles/WardrobeSummary.css";

function WardrobeSummary({ clothes }) {
  // Calculer les statistiques
  const stats = useMemo(() => {
    // Prix total
    const totalPrice = clothes.reduce((sum, item) => {
      return sum + (item.price || 0);
    }, 0);

    // Répartition par type
    const countByType = clothes.reduce((acc, item) => {
      const type = item.type || "autre";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    // Prix par type
    const priceByType = clothes.reduce((acc, item) => {
      if (item.price) {
        const type = item.type || "autre";
        acc[type] = (acc[type] || 0) + item.price;
      }
      return acc;
    }, {});

    // Trouver le vêtement le plus cher
    let mostExpensiveItem = null;
    clothes.forEach((item) => {
      if (
        item.price &&
        (!mostExpensiveItem || item.price > mostExpensiveItem.price)
      ) {
        mostExpensiveItem = item;
      }
    });

    return {
      totalCount: clothes.length,
      totalPrice,
      countByType,
      priceByType,
      mostExpensiveItem,
      averagePrice: clothes.length > 0 ? totalPrice / clothes.length : 0,
      itemsWithPrice: clothes.filter(
        (item) => item.price !== undefined && item.price !== null
      ).length,
    };
  }, [clothes]);

  // Formater le prix pour l'affichage
  const formatPrice = (price) => {
    return `${price.toFixed(2)} €`;
  };

  return (
    <div className="wardrobe-summary">
      <h2>Résumé de ma garde-robe</h2>

      <div className="summary-cards">
        <div className="summary-card total-items">
          <div className="card-icon">👕</div>
          <div className="card-value">{stats.totalCount}</div>
          <div className="card-label">Vêtements</div>
        </div>

        <div className="summary-card total-value">
          <div className="card-icon">💰</div>
          <div className="card-value">{formatPrice(stats.totalPrice)}</div>
          <div className="card-label">Valeur totale</div>
          <div className="card-info">
            {stats.itemsWithPrice} vêtements sur {stats.totalCount} avec prix
            renseigné
          </div>
        </div>

        <div className="summary-card average-price">
          <div className="card-icon">📊</div>
          <div className="card-value">{formatPrice(stats.averagePrice)}</div>
          <div className="card-label">Prix moyen</div>
        </div>
      </div>

      {stats.mostExpensiveItem && (
        <div className="most-expensive">
          <h3>Vêtement le plus cher</h3>
          <div className="expensive-item">
            {stats.mostExpensiveItem.imageUrl ? (
              <img
                src={stats.mostExpensiveItem.imageUrl}
                alt={stats.mostExpensiveItem.name}
              />
            ) : (
              <div className="no-image">Pas d'image</div>
            )}
            <div className="expensive-details">
              <p className="item-name">{stats.mostExpensiveItem.name}</p>
              <p className="item-price">
                {formatPrice(stats.mostExpensiveItem.price)}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="type-distribution">
        <h3>Répartition par catégorie</h3>
        <table>
          <thead>
            <tr>
              <th>Catégorie</th>
              <th>Nombre</th>
              <th>Valeur</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(stats.countByType)
              .sort((a, b) => b[1] - a[1])
              .map(([type, count]) => (
                <tr key={type}>
                  <td>{type.charAt(0).toUpperCase() + type.slice(1)}</td>
                  <td>{count}</td>
                  <td>{formatPrice(stats.priceByType[type] || 0)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WardrobeSummary;
