
import { ShoppingCart, ArrowUpRight } from 'lucide-react';
import './FoodCard.css';

function FoodCard({ name, price, description, image, onAddToCart }) {
  return (
    <article className="food-card">
      <div className="food-card-image-wrapper">
        <img
          className="food-card-image"
          src={image}
          alt={name}
          loading="lazy"
        />

        <span className="food-card-tag">Fresh & Delicious</span>
      </div>

      <div className="food-card-content">
        <div className="food-card-title-row">
          <h3>{name}</h3>
          <ArrowUpRight className="food-card-arrow" size={17} />
        </div>

        <p className="food-card-description">{description}</p>

        <div className="food-card-divider" />

        <div className="food-card-bottom">
          <div className="food-card-price-wrapper">
            <span className="food-card-price-label">PRICE</span>
            <span className="food-card-price">{price}</span>
          </div>

          <button
            className="add-to-cart-button"
            type="button"
            onClick={onAddToCart}
          >
            <ShoppingCart size={15} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </article>
  );
}

export default FoodCard;
