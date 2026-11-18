
import { useState } from 'react';
import { useCart } from '../context/useCart';
import CartItem from '../components/Cart/CartItem';
import Checkout from '../components/Cart/Checkout';
import './CartPage.css';

function Cart() {
  const [showCheckout, setShowCheckout] = useState(false);

  const { cart, removeFromCart } = useCart();

  const totalPrice = cart.reduce((total, food) => {
    const price = Number(
      food.price?.$numberDecimal ?? food.price
    );

    return total + (Number.isFinite(price) ? price : 0);
  }, 0);

  return (
    <section className="cart-section">

      {/* CART HEADER */}
      <div className="cart-header">
        <div>
          <p className="cart-subtitle">FOODHUB ORDER</p>
          <h2>Your Shopping Cart</h2>
          <p className="cart-description">
            Review your selected food before placing your order.
          </p>
        </div>

        <div className="cart-items-count">
          {cart.length} {cart.length === 1 ? 'item' : 'items'}
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>
            Add some delicious food from our menu to get started.
          </p>
        </div>
      ) : (
        <>
          {/* CHECKOUT SUMMARY AT TOP */}
          <div className="cart-summary">
            <div className="cart-total-info">
              <span>Total Amount</span>
              <strong>${totalPrice.toFixed(2)}</strong>
            </div>

            <button
              type="button"
              className="checkout-button"
              onClick={() => setShowCheckout(!showCheckout)}
              aria-expanded={showCheckout}
            >
              {showCheckout ? 'Close Checkout' : 'Proceed to Checkout'}
              <span>{showCheckout ? ' ↑' : ' →'}</span>
            </button>
          </div>

          {/* CHECKOUT FORM - ONLY AFTER CLICK */}
          {showCheckout && (
            <div className="checkout-form-wrapper">
              <Checkout
                cartitems={cart}
                totalPrice={totalPrice}
              />
            </div>
          )}

          {/* CART FOOD ITEMS */}
          <div className="cart-items-heading">
            <h3>Your Selected Items</h3>
            <span>{cart.length} items</span>
          </div>

          <div className="cart-items">
            {cart.map((food, index) => (
              <CartItem
                key={`${food.name}-${index}`}
                food={food}
                onRemove={removeFromCart}
              />
            ))}
          </div>
        </>
      )}

    </section>
  );
}

export default Cart;
