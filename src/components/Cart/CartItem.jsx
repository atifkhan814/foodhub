
import './CartItem.css';

function CartItem({ food, onRemove }) {
  const price = Number(
    food.price?.$numberDecimal ?? food.price ?? 0
  );

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img src={food.image} alt={food.name} />
      </div>

      <div className="cart-item-info">
        <h3>{food.name}</h3>

        <span className="cart-item-label">
          FoodHub Menu
        </span>

        <p className="cart-item-price">
          ${Number.isFinite(price) ? price.toFixed(2) : '0.00'}
        </p>
      </div>

      <div className="cart-item-actions">
        <button
          type="button"
          className="remove-button"
          onClick={() => onRemove(food)}
          aria-label={`Remove ${food.name} from cart`}
        >
          <span aria-hidden="true">×</span>
          Remove
        </button>
      </div>
    </div>
  );
}

export default CartItem;
