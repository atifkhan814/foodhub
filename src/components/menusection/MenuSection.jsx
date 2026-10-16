import { useState } from 'react';
import './MenuSection.css';
import FoodCard from './FoodCard';
import { useFood } from '../../context/food/useFood';

function MenuSection({ selectedCategory, onAddToCart }) {
  const { foods } = useFood();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFoods = foods.filter((food) => {
    const search = searchTerm.trim().toLowerCase();

    const matchesSearch =
      (food.name || '').toLowerCase().includes(search) ||
      (food.description || '').toLowerCase().includes(search);

    const matchesCategory =
      selectedCategory === 'All' ||
      food.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <section id="menu" className="menu-section">
      <div className="menu-heading">
        <span className="menu-eyebrow">MADE FRESH FOR YOU</span>
        <h2>Popular Dishes</h2>
        <p>Discover something delicious today.</p>
      </div>

      <div className="menu-search-wrapper">
        <span className="menu-search-icon" aria-hidden="true">
          🔍
        </span>

        <input
          className="menu-search-input"
          type="search"
          placeholder="Search pizza, burgers, chicken..."
          aria-label="Search menu items"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        {searchTerm && (
          <button
            className="menu-search-clear"
            type="button"
            onClick={() => setSearchTerm('')}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      <div className="menu-results-info">
        <span>
          {selectedCategory === 'All'
            ? 'All dishes'
            : `${selectedCategory} dishes`}
        </span>
        <span>
          {filteredFoods.length} {filteredFoods.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {filteredFoods.length > 0 ? (
        <div className="food-list">
          {filteredFoods.map((food) => (
            <FoodCard
              key={food.id}
              name={food.name}
              description={food.description}
              price={food.price}
              image={food.image}
              onAddToCart={() => onAddToCart(food)}
            />
          ))}
        </div>
      ) : (
        <div className="menu-empty-state">
          <span className="empty-food-icon">🍽️</span>
          <h3>No dishes found</h3>
          <p>Try another search or choose a different category.</p>

          <button
            type="button"
            onClick={() => setSearchTerm('')}
          >
            Clear search
          </button>
        </div>
      )}
    </section>
  );
}

export default MenuSection;