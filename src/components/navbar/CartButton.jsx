
import './CartButton.css';

function CartButton({ cartCount, onCartClick }) {
  return (
    <button
      type="button"
      className="cart-button"
      onClick={onCartClick}
      aria-label={`Open shopping cart with ${cartCount} items`}
    >
      <span className="cart-icon" aria-hidden="true">
        🛒
      </span>

      <span className="cart-label">Cart</span>

      <span className="cart-count">{cartCount}</span>
    </button>
  );
}

export default CartButton;
