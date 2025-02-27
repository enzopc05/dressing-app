import React, { useState, useEffect } from "react";
import OrderForm from "./OrderForm";
import {
  getPendingOrders,
  addPendingOrder,
  deletePendingOrder,
  receiveOrder,
} from "../utils/dataService";
import { getCurrentUserId } from "../utils/simpleAuthService";
import "../styles/PendingOrders.css";

function PendingOrders() {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [receivedOrders, setReceivedOrders] = useState([]);
  const [isAddingOrder, setIsAddingOrder] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Charger les commandes au démarrage
  useEffect(() => {
    loadOrders();
  }, []);

  // Charger les commandes depuis le service de données
  const loadOrders = () => {
    const userId = getCurrentUserId();
    const allOrders = getPendingOrders(userId);

    // Séparer les commandes en attente et reçues
    const pending = allOrders.filter((order) => order.status === "pending");
    const received = allOrders.filter((order) => order.status === "received");

    setPendingOrders(pending);
    setReceivedOrders(received);
  };

  // Gérer l'ajout d'une nouvelle commande
  const handleAddOrder = (orderData) => {
    setIsLoading(true);
    try {
      const userId = getCurrentUserId();
      addPendingOrder(orderData, userId);
      loadOrders();
      setIsAddingOrder(false);
      setMessage({
        text: "Commande ajoutée avec succès!",
        type: "success",
      });
    } catch (error) {
      setMessage({
        text: `Erreur lors de l'ajout de la commande: ${error.message}`,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Gérer la suppression d'une commande
  const handleDeleteOrder = (orderId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette commande?")) {
      setIsLoading(true);
      try {
        const userId = getCurrentUserId();
        deletePendingOrder(orderId, userId);
        loadOrders();
        setMessage({
          text: "Commande supprimée avec succès!",
          type: "success",
        });
      } catch (error) {
        setMessage({
          text: `Erreur lors de la suppression de la commande: ${error.message}`,
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Gérer la réception d'une commande
  const handleReceiveOrder = (orderId) => {
    if (
      window.confirm(
        "Confirmer la réception de cette commande? Les vêtements seront ajoutés à votre dressing."
      )
    ) {
      setIsLoading(true);
      try {
        const userId = getCurrentUserId();
        const result = receiveOrder(orderId, userId);

        if (result.success) {
          loadOrders();
          setMessage({
            text: result.message,
            type: "success",
          });
        } else {
          setMessage({
            text: result.message,
            type: "error",
          });
        }
      } catch (error) {
        setMessage({
          text: `Erreur lors de la réception de la commande: ${error.message}`,
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Gérer l'expansion d'une commande pour voir les détails
  const toggleOrderExpansion = (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  // Formater le prix
  const formatPrice = (price) => {
    if (price === undefined || price === null) return "";
    return `${price.toFixed(2)} €`;
  };

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Calculer le prix total d'une commande
  const calculateOrderTotal = (order) => {
    return order.items.reduce((total, item) => total + (item.price || 0), 0);
  };

  // Rendre le composant OrderCard
  const OrderCard = ({ order, isPending }) => (
    <div
      className={`order-card ${expandedOrderId === order.id ? "expanded" : ""}`}
    >
      <div
        className="order-header"
        onClick={() => toggleOrderExpansion(order.id)}
      >
        <div className="order-title">
          <h3>{order.name}</h3>
          <div className="order-meta">
            {order.store && <span className="store">{order.store}</span>}
            <span className="item-count">{order.items.length} articles</span>
            <span className="total-price">
              {formatPrice(calculateOrderTotal(order))}
            </span>
          </div>
        </div>
        <div className="order-date">
          {isPending ? (
            order.expectedDate ? (
              <span>Livraison prévue: {formatDate(order.expectedDate)}</span>
            ) : (
              <span>Date créée: {formatDate(order.createdAt)}</span>
            )
          ) : (
            <span>Reçue le: {formatDate(order.receivedAt)}</span>
          )}
        </div>
      </div>

      {expandedOrderId === order.id && (
        <div className="order-details">
          <div className="order-items">
            <h4>Articles ({order.items.length})</h4>
            <ul className="items-list">
              {order.items.map((item, index) => (
                <li key={index} className="item-detail">
                  {item.imageUrl && (
                    <div className="item-image">
                      <img src={item.imageUrl} alt={item.name} />
                    </div>
                  )}
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    <span className="item-type">
                      {item.type} {item.subType ? `(${item.subType})` : ""}
                    </span>
                    <span className="item-color">{item.color}</span>
                    {item.price !== undefined && (
                      <span className="item-price">
                        {formatPrice(item.price)}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {order.note && (
            <div className="order-note">
              <h4>Notes</h4>
              <p>{order.note}</p>
            </div>
          )}

          {order.trackingNumber && (
            <div className="order-tracking">
              <h4>Numéro de suivi</h4>
              <p>{order.trackingNumber}</p>
            </div>
          )}

          {isPending && (
            <div className="order-actions">
              <button
                className="receive-order-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleReceiveOrder(order.id);
                }}
                disabled={isLoading}
              >
                Marquer comme reçue
              </button>
              <button
                className="delete-order-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteOrder(order.id);
                }}
                disabled={isLoading}
              >
                Supprimer
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="pending-orders-container">
      {isAddingOrder ? (
        <OrderForm
          onSubmit={handleAddOrder}
          onCancel={() => setIsAddingOrder(false)}
        />
      ) : (
        <>
          <div className="pending-orders-header">
            <h2>Commandes en attente</h2>
            <button
              className="add-order-btn"
              onClick={() => setIsAddingOrder(true)}
            >
              Nouvelle commande
            </button>
          </div>

          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
              <button
                className="close-message"
                onClick={() => setMessage({ text: "", type: "" })}
              >
                ×
              </button>
            </div>
          )}

          {pendingOrders.length > 0 ? (
            <div className="order-list">
              {pendingOrders.map((order) => (
                <OrderCard key={order.id} order={order} isPending={true} />
              ))}
            </div>
          ) : (
            <div className="no-orders">
              <p>Vous n'avez pas de commandes en attente.</p>
            </div>
          )}

          {receivedOrders.length > 0 && (
            <div className="received-orders">
              <h3>Commandes reçues récemment</h3>
              <div className="order-list">
                {receivedOrders.slice(0, 5).map((order) => (
                  <OrderCard key={order.id} order={order} isPending={false} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default PendingOrders;
