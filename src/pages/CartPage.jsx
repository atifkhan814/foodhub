
import { useState } from 'react';
import { useCart } from '../context/useCart';
import CartItem from '../components/cart/CartItem';
import Checkout from '../components/cart/Checkout';
import './CartPage.css';

function Cart() {
  const [showCheckout, setShowCheckout] = useState(false);

  const { cart, removeFromCart } = useCart();

  const totalPrice = cart.reduce((total, food) => {
    const price = Number(food.price.replace('$', ''));
    return total + price;
  }, 0);

  return (
    <section className="cart-section">
      <div className="cart-header">
        <div>
          <p className="cart-subtitle">FOODHUB ORDER</p>
          <h2>Your Shopping Cart</h2>
          <p className="cart-description">
            Review your favorite food before checking out.
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
          <p>Add some delicious food from our menu to get started.</p>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((food, index) => (
              <CartItem
                key={`${food.name}-${index}`}
                food={food}
                onRemove={removeFromCart}
              />
            ))}
          </div>

          <div className="cart-summary">
            <div className="cart-total-row">
              <span>Total Amount</span>
              <strong>${totalPrice.toFixed(2)}</strong>
            </div>

            <p className="cart-summary-note">
              Your order total before any additional charges.
            </p>

            <button
              type="button"
              className="checkout-button"
              onClick={() => setShowCheckout(true)}
            >
              Proceed to Checkout
              <span aria-hidden="true"> →</span>
            </button>
          </div>

          {showCheckout && (
            <Checkout
              cartitems={cart}
              totalPrice={totalPrice}
            />
          )}
        </>
      )}
    </section>
  );
}

export default Cart;
