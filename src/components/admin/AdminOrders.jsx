
import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import {
  Search,
  SlidersHorizontal,
  RefreshCw,
  Package,
  Clock3,
  CheckCircle2,
  XCircle,
  ShoppingBag,
  UserRound,
  MapPin,
  CreditCard,
  Phone,
  Mail,
  CalendarDays,
  ChefHat,
  Truck,
} from 'lucide-react';

import './AdminOrders.css';

const API_URL = 'http://localhost:8000/api/orders';

const orderStatuses = [
  'Pending',
  'Confirmed',
  'Preparing',
  'Dispatched',
  'Delivered',
  'Cancelled',
];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [updatingOrders, setUpdatingOrders] = useState([]);

  // Initial loading: fetch orders without setting state
  // synchronously inside useEffect.
  useEffect(() => {
    const controller = new AbortController();

    async function loadInitialOrders() {
      try {
        const response = await fetch(API_URL, {
          credentials: 'include',
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Unable to fetch orders.');
        }

        const fetchedOrders = Array.isArray(data.data)
          ? data.data
          : Array.isArray(data.orders)
            ? data.orders
            : Array.isArray(data)
              ? data
              : [];

        setOrders(fetchedOrders);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Fetch orders error:', err);
          setError(err.message || 'Something went wrong.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadInitialOrders();

    return () => {
      controller.abort();
    };
  }, []);

  // Refresh orders manually.
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(API_URL, {
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to fetch orders.');
      }

      const fetchedOrders = Array.isArray(data.data)
        ? data.data
        : Array.isArray(data.orders)
          ? data.orders
          : Array.isArray(data)
            ? data
            : [];

      setOrders(fetchedOrders);
    } catch (err) {
      console.error('Fetch orders error:', err);
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Dashboard statistics.
  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === 'Pending'
  ).length;

  const completedOrders = orders.filter(
    (order) => order.status === 'Delivered'
  ).length;

  const cancelledOrders = orders.filter(
    (order) => order.status === 'Cancelled'
  ).length;

  // Search and filter orders.
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchValue = search.toLowerCase().trim();

      const customerName = order.customer?.fullName || '';
      const customerEmail = order.customer?.email || '';
      const customerPhone = order.customer?.phone || '';
      const customerAddress = order.customer?.address || '';
      const customerCity = order.customer?.city || '';
      const orderNumber = order.orderNumber || '';

      const matchesSearch =
        !searchValue ||
        orderNumber.toLowerCase().includes(searchValue) ||
        customerName.toLowerCase().includes(searchValue) ||
        customerEmail.toLowerCase().includes(searchValue) ||
        customerPhone.toLowerCase().includes(searchValue) ||
        customerAddress.toLowerCase().includes(searchValue) ||
        customerCity.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === 'All' || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  // Update order status through the backend.
  async function handleStatusChange(orderId, newStatus) {
    try {
      setUpdatingOrders((current) => [...current, orderId]);

      const response = await fetch(`${API_URL}/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to update order.');
      }

      const updatedOrder =
        data.data?.order ||
        data.data ||
        data.order ||
        data;

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                ...(updatedOrder._id === orderId ? updatedOrder : {}),
                status: newStatus,
              }
            : order
        )
      );

      toast.success('Order status updated successfully.');
    } catch (err) {
      console.error('Update order error:', err);
      toast.error(err.message || 'Unable to update order status.');
    } finally {
      setUpdatingOrders((current) =>
        current.filter((id) => id !== orderId)
      );
    }
  }

  // Format order date.
  function formatDate(date) {
    if (!date) return 'Date unavailable';

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return 'Date unavailable';
    }

    return parsedDate.toLocaleString('en-PK', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }

  // Format price.
  function formatPrice(price) {
    const amount = Number(
      String(price ?? 0).replace(/[^0-9.-]/g, '')
    );

    return `$${(Number.isFinite(amount) ? amount : 0).toFixed(2)}`;
  }

  function getStatusClass(status) {
    return (status || 'pending').toLowerCase().replace(/\s+/g, '-');
  }

  return (
    <section className="admin-orders-section" id="admin-orders">

      {/* Page heading */}
      <div className="orders-page-heading">
        <div className="orders-heading-copy">
          <span className="orders-eyebrow">
            RESTAURANT MANAGEMENT
          </span>

          <h2>Order Management</h2>

          <p className="orders-description">
            Track customer orders and manage their delivery progress.
          </p>
        </div>

        <button
          className="orders-refresh-button"
          type="button"
          onClick={fetchOrders}
          disabled={loading}
        >
          <RefreshCw
            size={16}
            className={loading ? 'orders-refresh-spinning' : ''}
          />
          {loading ? 'Loading...' : 'Refresh Orders'}
        </button>
      </div>

      {/* Order statistics */}
      <div className="orders-stats-grid">

        <article className="order-stat-card">
          <div className="order-stat-top">
            <span className="order-stat-label">Total Orders</span>

            <span className="order-stat-icon total-stat-icon">
              <Package size={19} />
            </span>
          </div>

          <strong>{totalOrders}</strong>
          <span className="order-stat-note">All customer orders</span>
        </article>

        <article className="order-stat-card pending-stat">
          <div className="order-stat-top">
            <span className="order-stat-label">Pending Orders</span>

            <span className="order-stat-icon pending-stat-icon">
              <Clock3 size={19} />
            </span>
          </div>

          <strong>{pendingOrders}</strong>
          <span className="order-stat-note">Awaiting confirmation</span>
        </article>

        <article className="order-stat-card completed-stat">
          <div className="order-stat-top">
            <span className="order-stat-label">Completed Orders</span>

            <span className="order-stat-icon completed-stat-icon">
              <CheckCircle2 size={19} />
            </span>
          </div>

          <strong>{completedOrders}</strong>
          <span className="order-stat-note">Successfully delivered</span>
        </article>

        <article className="order-stat-card cancelled-stat">
          <div className="order-stat-top">
            <span className="order-stat-label">Cancelled Orders</span>

            <span className="order-stat-icon cancelled-stat-icon">
              <XCircle size={19} />
            </span>
          </div>

          <strong>{cancelledOrders}</strong>
          <span className="order-stat-note">Cancelled orders</span>
        </article>

      </div>

      {/* Main orders panel */}
      <div className="orders-content-panel">

        <div className="orders-panel-heading">
          <div>
            <span className="orders-panel-kicker">
              ORDER OVERVIEW
            </span>

            <h3>Customer Orders</h3>

            <p>
              View order details and update order status.
            </p>
          </div>

          <span className="orders-count">
            {filteredOrders.length}{' '}
            {filteredOrders.length === 1 ? 'Order' : 'Orders'}
          </span>
        </div>

        {/* Search and filter */}
        <div className="orders-toolbar">

          <label
            className="orders-search-wrap"
            htmlFor="admin-orders-search"
          >
            <Search size={18} />

            <input
              id="admin-orders-search"
              type="search"
              className="orders-search"
              placeholder="Search order, customer, email or phone..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <label
            className="orders-filter-wrap"
            htmlFor="admin-orders-filter"
          >
            <SlidersHorizontal size={17} />

            <select
              id="admin-orders-filter"
              className="orders-filter"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="All">All Statuses</option>

              {orderStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

        </div>

        {/* Loading state */}
        {loading && (
          <div className="orders-message">
            <span className="orders-message-icon">
              <RefreshCw size={22} className="orders-refresh-spinning" />
            </span>

            <h3>Loading orders</h3>

            <p>
              Please wait while we retrieve customer orders.
            </p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="orders-message orders-error">
            <span className="orders-message-icon">
              <XCircle size={23} />
            </span>

            <h3>Unable to load orders</h3>

            <p>{error}</p>

            <button type="button" onClick={fetchOrders}>
              Try Again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredOrders.length === 0 && (
          <div className="orders-message">
            <span className="orders-message-icon">
              <ShoppingBag size={24} />
            </span>

            <h3>No orders found</h3>

            <p>
              {orders.length === 0
                ? 'Customer orders will appear here when they place an order.'
                : 'Try changing your search or status filter.'}
            </p>
          </div>
        )}

        {/* Order cards */}
        {!loading && !error && filteredOrders.length > 0 && (
          <div className="orders-list">

            {filteredOrders.map((order) => (
              <article
                className="admin-order-card"
                key={order._id}
              >

                {/* Order header */}
                <div className="admin-order-header">

                  <div className="order-heading-main">
                    <span className="order-number-label">
                      ORDER NUMBER
                    </span>

                    <h3>
                      {order.orderNumber || 'Order'}
                    </h3>

                    <span className="order-date">
                      <CalendarDays size={14} />
                      {formatDate(order.createdAt)}
                    </span>
                  </div>

                  <span
                    className={`order-status-badge ${getStatusClass(order.status)}`}
                  >
                    {order.status || 'Pending'}
                  </span>

                </div>

                {/* Customer and delivery details */}
                <div className="admin-order-details">

                  {/* Customer */}
                  <div className="order-detail-block">
                    <span className="order-detail-label">
                      <UserRound size={14} />
                      CUSTOMER
                    </span>

                    <strong>
                      {order.customer?.fullName || 'Unknown'}
                    </strong>

                    <span className="order-detail-line">
                      <Mail size={13} />
                      {order.customer?.email || 'No email'}
                    </span>

                    <span className="order-detail-line">
                      <Phone size={13} />
                      {order.customer?.phone || 'No phone'}
                    </span>
                  </div>

                  {/* Delivery address */}
                  <div className="order-detail-block order-address-block">
                    <span className="order-detail-label">
                      <MapPin size={14} />
                      DELIVERY ADDRESS
                    </span>

                    <strong>
                      {order.customer?.city || 'City not provided'}
                    </strong>

                    <span>
                      {order.customer?.address || 'No address provided'}
                    </span>
                  </div>

                  {/* Payment */}
                  <div className="order-detail-block">
                    <span className="order-detail-label">
                      <CreditCard size={14} />
                      PAYMENT
                    </span>

                    <strong>
                      {order.paymentMethod || 'N/A'}
                    </strong>

                    <span>
                      Payment: {order.paymentStatus || 'Unpaid'}
                    </span>
                  </div>

                </div>

                {/* Ordered food items */}
                <div className="order-items-section">

                  <div className="order-items-heading">
                    <h4>
                      <ShoppingBag size={16} />
                      Ordered Items
                    </h4>

                    <span>
                      {order.items?.length || 0}{' '}
                      {(order.items?.length || 0) === 1 ? 'item' : 'items'}
                    </span>
                  </div>

                  <div className="order-items-list">

                    {order.items?.map((item, index) => {
                      const quantity = Number(item.quantity) || 0;

                      const itemPrice = Number(
                        String(item.price ?? 0).replace(/[^0-9.-]/g, '')
                      ) || 0;

                      const itemTotal = itemPrice * quantity;

                      return (
                        <div
                          className="admin-order-item"
                          key={`${order._id}-${index}`}
                        >
                          <span className="order-item-name">
                            {item.name || 'Food item'}
                          </span>

                          <span className="order-item-quantity">
                            × {quantity}
                          </span>

                          <strong>
                            {formatPrice(itemTotal)}
                          </strong>
                        </div>
                      );
                    })}

                  </div>
                </div>

                {/* Order footer */}
                <div className="admin-order-footer">

                  <div className="order-total">
                    <span>Total Amount</span>

                    <strong>
                      {formatPrice(order.total)}
                    </strong>
                  </div>

                  <div className="order-status-control">

                    <label htmlFor={`status-${order._id}`}>
                      Update Order Status
                    </label>

                    <div className="order-status-select-wrap">

                      {order.status === 'Preparing' && (
                        <ChefHat size={16} />
                      )}

                      {order.status === 'Dispatched' && (
                        <Truck size={16} />
                      )}

                      {order.status !== 'Preparing' &&
                        order.status !== 'Dispatched' && (
                          <SlidersHorizontal size={16} />
                        )}

                      <select
                        id={`status-${order._id}`}
                        value={order.status || 'Pending'}
                        disabled={updatingOrders.includes(order._id)}
                        onChange={(event) =>
                          handleStatusChange(
                            order._id,
                            event.target.value
                          )
                        }
                      >
                        {orderStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>

                    </div>

                    {updatingOrders.includes(order._id) && (
                      <span className="order-updating">
                        Updating order...
                      </span>
                    )}

                  </div>

                </div>

                {/* Customer notes */}
                {order.customer?.notes && (
                  <div className="order-customer-notes">
                    <strong>Customer Note</strong>
                    <span>{order.customer.notes}</span>
                  </div>
                )}

              </article>
            ))}

          </div>
        )}

      </div>
    </section>
  );
}

export default AdminOrders;
