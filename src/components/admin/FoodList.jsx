
import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Search,
  SlidersHorizontal,
  Pencil,
  Trash2,
  UtensilsCrossed,
  RotateCcw,
} from 'lucide-react';

import './FoodList.css';

function FoodList({ foods, onEdit, onDelete }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    ...new Set(foods.map((food) => food.category).filter(Boolean)),
  ];

  // Search and filter food items.
  const filteredFoods = foods.filter((food) => {
    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      (food.name || '').toLowerCase().includes(search) ||
      (food.description || '').toLowerCase().includes(search);

    const matchesCategory =
      selectedCategory === 'All' ||
      food.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Convert price into a number safely.
  function formatPrice(price) {
    const numericPrice = Number(
      String(price ?? '').replace(/[^0-9.-]/g, '')
    );

    return Number.isFinite(numericPrice)
      ? `$${numericPrice.toFixed(2)}`
      : 'Price unavailable';
  }

  // Handle Edit.
  function handleEdit(food) {
    if (typeof onEdit !== 'function') {
      toast.error('Edit function is not connected.');
      return;
    }

    onEdit(food);
    toast.success(`${food.name} selected for editing`);
  }

  // Handle Delete.
  function handleDelete(food) {
    if (typeof onDelete !== 'function') {
      toast.error('Delete function is not connected.');
      return;
    }

    onDelete(food.id);
    toast.success(`${food.name} deleted successfully`);
  }

  // Clear filters.
  function clearFilters() {
    setSearchTerm('');
    setSelectedCategory('All');
  }

  return (
    <section className="admin-food-list">

      <div className="food-list-header">
        <div className="food-list-heading">
          <span className="food-list-label">MENU MANAGEMENT</span>
          <h2>Manage Food Items</h2>
          <p>
            Keep your menu up to date. Search, filter, and manage your dishes.
          </p>
        </div>

        <div className="food-count" aria-live="polite">
          <span className="food-count-number">
            {filteredFoods.length}
          </span>
          <span>
            {filteredFoods.length === 1 ? 'item shown' : 'items shown'}
          </span>
        </div>
      </div>

      <div className="food-list-toolbar">

        <label className="food-search" htmlFor="food-list-search">
          <Search size={19} aria-hidden="true" />

          <input
            id="food-list-search"
            type="search"
            placeholder="Search food..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </label>

        <label
          className="food-category-filter"
          htmlFor="food-list-category"
        >
          <SlidersHorizontal size={17} aria-hidden="true" />

          <span className="food-filter-label">Category</span>

          <select
            id="food-list-category"
            value={selectedCategory}
            onChange={(event) =>
              setSelectedCategory(event.target.value)
            }
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <button
          className="food-clear-filters"
          type="button"
          onClick={clearFilters}
        >
          <RotateCcw size={16} aria-hidden="true" />
          Clear filters
        </button>

      </div>

      {filteredFoods.length > 0 ? (

        <div className="food-items-grid">

          {filteredFoods.map((food) => (

            <article className="food-item-card" key={food.id}>

              <div className="food-item-image">

                {food.image ? (
                  <img
                    src={food.image}
                    alt={food.name || 'Food item'}
                  />
                ) : (
                  <div className="food-image-placeholder">
                    <UtensilsCrossed size={35} />
                  </div>
                )}

                {food.category && (
                  <span className="food-item-category">
                    {food.category}
                  </span>
                )}

              </div>

              <div className="food-item-details">

                <h3>{food.name || 'Unnamed food'}</h3>

                <p>
                  {food.description || 'No description available.'}
                </p>

                <strong className="food-item-price">
                  {formatPrice(food.price)}
                </strong>

              </div>

              <div className="food-item-actions">

                <button
                  className="food-edit-btn"
                  type="button"
                  onClick={() => handleEdit(food)}
                  aria-label={`Edit ${food.name}`}
                >
                  <Pencil size={17} />
                  Edit
                </button>

                <button
                  className="food-delete-btn"
                  type="button"
                  onClick={() => handleDelete(food)}
                  aria-label={`Delete ${food.name}`}
                >
                  <Trash2 size={17} />
                  Delete
                </button>

              </div>

            </article>

          ))}

        </div>

      ) : (

        <p className="food-list-empty" role="status">
          No food items match your search.
        </p>

      )}

    </section>
  );
}

export default FoodList;
