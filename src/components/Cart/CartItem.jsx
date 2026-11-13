import './CartItem.css';

function CartItem({ food, onRemove }) {
  const price = Number(
    food.price?.$numberDecimal ?? food.price ?? 0
  );

  return (
    <div className="cart-item">
      <img src={food.image} alt={food.name} />
      <h3>{food.name}</h3>
      <p>
        ${Number.isFinite(price) ? price.toFixed(2) : '0.00'}
      </p>
      <button
        className="remove-button"
        onClick={() => onRemove(food)}
      >
        Remove
      </button>
    </div>
  );
}

export default CartItem;