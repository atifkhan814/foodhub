import { useState } from 'react';
import { useCart } from '../../context/useCart';
import toast from 'react-hot-toast';
import './Checkout.css';

function Checkout({ cartitems, totalPrice }) {
  const { clearCart } = useCart();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    notes: '',
    paymentMethod: 'Cash on Delivery',
  });

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!cartitems || cartitems.length === 0) {
      toast.error('Your cart is empty.');
      return;
    }

    const phoneDigits = formData.phone.replace(/\D/g, '');

    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      toast.error('Please enter a valid phone number.');
      return;
    }

    let existingOrders;

    try {
      existingOrders = JSON.parse(
        localStorage.getItem('foodhub_orders') || '[]'
      );

      if (!Array.isArray(existingOrders)) {
        existingOrders = [];
      }
    } catch {
      toast.error('Unable to read saved orders.');
      return;
    }

    const newOrder = {
      id: `FH-${Date.now()}`,
      customer: { ...formData },

      // Save only essential food details, not large image data.
      items: cartitems.map((food) => ({
        name: food.name,
        price: food.price,
      })),

      total: totalPrice,
      status: 'Pending',
      paymentStatus: 'Unpaid',
      createdAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(
        'foodhub_orders',
        JSON.stringify([...existingOrders, newOrder])
      );
    } catch {
      toast.error(
        'Could not save the order. Browser storage may be full.'
      );
      return;
    }

    // Clear the cart only after the order has been saved.
    clearCart();

    setOrderNumber(newOrder.id);
    setOrderPlaced(true);

    toast.success('Your order has been placed!');
  }

  if (orderPlaced) {
    return (
      <section className="checkout-section checkout-success">
        <div className="success-icon">✓</div>

        <h2>Order placed successfully!</h2>

        <p>
          Thank you, {formData.fullName}. Your order has been
          saved and is awaiting confirmation.
        </p>

        <div className="success-order-number">
          <span>Your order number</span>
          <strong>{orderNumber}</strong>
        </div>

        <p>
          Payment: <strong>{formData.paymentMethod}</strong>
        </p>

        <p>
          Total: <strong>${totalPrice.toFixed(2)}</strong>
        </p>

        <button
          type="button"
          className="checkout-home-button"
          onClick={() => {
            window.location.assign('/');
          }}
        >
          Back to Home
        </button>
      </section>
    );
  }

  return (
    <section className="checkout-section">
      <div className="checkout-heading">
        <span className="checkout-eyebrow">FOODHUB CHECKOUT</span>
        <h2>Complete your order</h2>
        <p>Enter your details and confirm your delivery.</p>
      </div>

      <form className="checkout-layout" onSubmit={handleSubmit}>
        <div className="checkout-form">
          <div className="checkout-card-heading">
            <span className="checkout-step">01</span>
            <div>
              <h3>Customer details</h3>
              <p>Tell us where to deliver your food.</p>
            </div>
          </div>

          <div className="checkout-fields">
            <div className="checkout-field">
              <label htmlFor="fullName">Full name *</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
                minLength={2}
                required
              />
            </div>

            <div className="checkout-field">
              <label htmlFor="phone">Phone number *</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                autoComplete="tel"
                pattern="[0-9+() -]{7,20}"
                title="Enter a valid phone number."
                required
              />
            </div>

            <div className="checkout-field checkout-field-full">
              <label htmlFor="email">Email address *</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="checkout-field checkout-field-full">
              <label htmlFor="address">Delivery address *</label>
              <input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                placeholder="House number, street, and area"
                autoComplete="street-address"
                required
              />
            </div>

            <div className="checkout-field checkout-field-full">
              <label htmlFor="city">City *</label>
              <input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter your city"
                autoComplete="address-level2"
                required
              />
            </div>

            <div className="checkout-field checkout-field-full">
              <label htmlFor="notes">
                Delivery instructions (optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Nearby landmark or special instructions"
                rows={3}
              />
            </div>
          </div>

          <div className="checkout-card-heading payment-heading">
            <span className="checkout-step">02</span>
            <div>
              <h3>Payment method</h3>
              <p>Choose how you will pay.</p>
            </div>
          </div>

          <label className="payment-option">
            <input
              type="radio"
              name="paymentMethod"
              value="Cash on Delivery"
              checked={formData.paymentMethod === 'Cash on Delivery'}
              onChange={handleChange}
            />

            <span>
              <strong>Cash on Delivery</strong>
              <small>Pay when your food arrives.</small>
            </span>
          </label>

          <p className="payment-note">
            Online payments are not available yet.
          </p>
        </div>

        <aside className="order-summary">
          <h3>Order summary</h3>

          <p className="summary-caption">
            {cartitems.length} item(s) in your cart
          </p>

          <div className="summary-items">
            {cartitems.map((food, index) => (
              <div
                key={`${food.name}-${index}`}
                className="order-item"
              >
                <span>{food.name}</span>
                <strong>{food.price}</strong>
              </div>
            ))}
          </div>

          <div className="summary-total">
            <span>Total</span>
            <strong>${totalPrice.toFixed(2)}</strong>
          </div>

          <button
            type="submit"
            className="place-order-button"
            disabled={cartitems.length === 0}
          >
            Place Order · ${totalPrice.toFixed(2)}
          </button>

          <p className="summary-note">
            Your order details will be saved on this browser.
          </p>
        </aside>
      </form>
    </section>
  );
}

export default Checkout;