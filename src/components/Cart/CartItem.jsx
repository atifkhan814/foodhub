import './CartItem.css';
function CartItem({ food ,onRemove}) {
  return (
    <div className="cart-item">
      <img src={food.image} alt={food.name} />
      <h3>{food.name}</h3>
      <p>{food.price}</p>
      <button className='remove-button' onClick={() => onRemove(food)}>Remove</button>
    </div>
  );
}

export default CartItem;