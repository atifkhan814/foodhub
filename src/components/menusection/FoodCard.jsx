import './FoodCard.css';

function FoodCard({ name, price, description,image, onAddToCart }) {
  return (
    <article className="food-card">
      <img
      className='food-card-image '
        src={image} alt={name} />

      <div className="food-card-content">
        <h3>{name}</h3>

        <p>{description}</p>

        <div className="food-card-bottom">
          <span className="food-card-price">{price}</span>

          <button className="add-to-cart-button"
          onClick={onAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}

export default FoodCard;