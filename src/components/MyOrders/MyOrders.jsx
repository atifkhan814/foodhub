import { useEffect, useState } from "react";
import {
  X,
  Package,
  ShoppingBag,
  Clock3,
  CreditCard,
  RefreshCw,
  Utensils,
} from "lucide-react";

import "./MyOrders.css";

const API_URL = "http://localhost:8000/api/orders/my-orders";

const orderSteps = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Dispatched",
  "Delivered",
];

const MyOrders = ({ isOpen, onClose }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch orders whenever the drawer opens.
  useEffect(() => {
    if (!isOpen) return;

    const controller = new AbortController();

    const fetchOrders = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(API_URL, {
          method: "GET",
          credentials: "include",
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load your orders.");
        }

        setOrders(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error fetching orders:", err);
          setError(err.message || "Something went wrong.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchOrders();

    return () => controller.abort();
  }, [isOpen]);

  // Close drawer with Escape key.
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const formatPrice = (price) => {
    const value =
      typeof price === "object" && price !== null
        ? price.$numberDecimal
        : price;

    const amount = Number(String(value ?? 0).replace(/[$,]/g, ""));

    return Number.isFinite(amount) ? `$${amount.toFixed(2)}` : "$0.00";
  };

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (status) => {
    return status?.toLowerCase().replace(/\s+/g, "-") || "pending";
  };

  if (!isOpen) return null;

  return (
    <div
      className="my-orders-overlay"
      onClick={onClose}
      role="presentation"
    >
      <aside
        className="my-orders-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="my-orders-title"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="my-orders-header">
          <div className="my-orders-heading">
            <span className="my-orders-eyebrow">YOUR FOODHUB ACCOUNT</span>
            <h2 id="my-orders-title">My Orders</h2>
            <p>Keep track of your delicious orders.</p>
          </div>

          <button
            className="my-orders-close"
            onClick={onClose}
            aria-label="Close My Orders"
          >
            <X size={21} />
          </button>
        </div>

        {/* Order Summary */}
        <div className="my-orders-summary">
          <div className="summary-icon">
            <ShoppingBag size={21} />
          </div>

          <div>
            <strong>{orders.length} Orders</strong>
            <span>Your order history</span>
          </div>
        </div>

        {/* Drawer Content */}
        <div className="my-orders-content">
          {loading && (
            <div className="orders-state">
              <div className="orders-spinner" />
              <h3>Loading your orders</h3>
              <p>Please wait while we fetch your order history.</p>
            </div>
          )}

          {!loading && error && (
            <div className="orders-state">
              <div className="state-icon error-icon">
                <Package size={25} />
              </div>
              <h3>Unable to load orders</h3>
              <p>{error}</p>
              <button
                className="orders-retry-btn"
                onClick={() => {
                  setError("");
                  setLoading(true);
                  // Changing isOpen is not necessary; reload by refreshing the drawer.
                  window.location.reload();
                }}
              >
                <RefreshCw size={16} />
                Try again
              </button>
            </div>
          )}

          {!loading && !error && orders.length === 0 && (
            <div className="orders-state">
              <div className="state-icon">
                <ShoppingBag size={27} />
              </div>
              <h3>No orders yet</h3>
              <p>
                You haven't placed an order yet. Explore our menu and find
                something delicious.
              </p>
              <button className="orders-browse-btn" onClick={onClose}>
                Explore Food
              </button>
            </div>
          )}

          {!loading && !error && orders.length > 0 && (
            <div className="orders-list">
              {orders.map((order) => {
                const currentStep = orderSteps.indexOf(order.status);

                return (
                  <article className="order-card" key={order._id}>
                    {/* Order Card Header */}
                    <div className="order-card-header">
                      <div>
                        <span className="order-number-label">
                          ORDER NUMBER
                        </span>
                        <h3>{order.orderNumber}</h3>
                        <p className="order-date">
                          <Clock3 size={14} />
                          {formatDate(order.createdAt)}
                        </p>
                      </div>

                      <span
                        className={`order-status ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    {/* Food Items */}
                    <div className="order-items">
                      {order.items?.map((item, index) => (
                        <div
                          className="order-item"
                          key={item._id || `${item.foodId || "item"}-${index}`}
                        >
                          <div className="order-food-icon">
                            <Utensils size={19} />
                          </div>

                          <div className="order-item-info">
                            <h4>{item.name}</h4>
                            <p>Quantity: {item.quantity}</p>
                          </div>

                          <strong>
                            {formatPrice(
                              Number(item.price) * Number(item.quantity)
                            )}
                          </strong>
                        </div>
                      ))}
                    </div>

                    {/* Order Progress */}
                    <div className="order-progress-section">
                      <h4>Order progress</h4>

                      {order.status === "Cancelled" ? (
                        <p className="order-cancelled">
                          This order has been cancelled.
                        </p>
                      ) : (
                        <div className="order-progress">
                          {orderSteps.map((step, index) => {
                            const completed =
                              currentStep >= 0 && index <= currentStep;

                            return (
                              <div
                                className={`progress-step ${
                                  completed ? "completed" : ""
                                }`}
                                key={step}
                              >
                                <div className="progress-circle">
                                  {completed ? "✓" : index + 1}
                                </div>
                                <span>{step}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Order Footer */}
                    <div className="order-card-footer">
                      <div className="payment-info">
                        <CreditCard size={17} />
                        <div>
                          <span>Payment method</span>
                          <strong>{order.paymentMethod || "Not specified"}</strong>
                        </div>
                      </div>

                      <div className="order-total">
                        <span>Total amount</span>
                        <strong>{formatPrice(order.total)}</strong>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default MyOrders;