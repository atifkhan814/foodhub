
import { useState } from 'react';
import toast from 'react-hot-toast';
import './FoodList.css';

function FoodList({ foods, onEdit, onDelete }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    ...new Set(
      foods.map((food) => food.category).filter(Boolean)
    ),
  ];

  // Search by name or description and filter by category.
  const filteredFoods = foods.filter((food) => {
    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      food.name.toLowerCase().includes(search) ||
      food.description.toLowerCase().includes(search);

    const matchesCategory =
      selectedCategory === 'All' ||
      food.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

 
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

  function clearFilters() {
    setSearchTerm('');
    setSelectedCategory('All');
  }

  return (
    <section className="admin-food-list">
      <div className="food-list-header">
        <div>
          <span className="food-list-label">
            MENU MANAGEMENT
          </span>
          <h2>Manage Food Items</h2>
          <p>Search, filter, and manage your restaurant menu.</p>
        </div>

        <span className="food-count">
          {filteredFoods.length} items
        </span>
      </div>

      <div className="food-list-controls">
        <div className="food-search">
          <span className="search-icon">⌕</span>

          <input
            type="text"
            placeholder="Search food by name or description..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </div>

        <div className="food-category-filter">
          <label htmlFor="food-list-category">
            Category
          </label>

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
        </div>
      </div>

      <div className="food-category-chips">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={
              selectedCategory === category
                ? 'category-chip active'
                : 'category-chip'
            }
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredFoods.length === 0 ? (
        <div className="food-empty-state">
          <h3>No food items found</h3>
          <p>Try another search or select a different category.</p>

          <button type="button" onClick={clearFilters}>
            Clear filters
          </button>
        </div>
      ) : (
        <div className="admin-food-items">
          {filteredFoods.map((food) => (
            <article
              className="admin-food-item"
              key={food.id}
            >
              <img
                className="admin-food-image"
                src={food.image}
                alt={food.name}
              />

              <div className="admin-food-details">
                <h3>{food.name}</h3>

                <p className="admin-food-description">
                  {food.description}
                </p>

                <div className="admin-food-meta">
                  <span className="admin-food-price">
                    {food.price}
                  </span>

                  <span className="admin-food-category">
                    {food.category}
                  </span>
                </div>
              </div>

              <div className="admin-food-actions">
                <button
                  type="button"
                  className="food-edit-button"
                  onClick={() => handleEdit(food)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="food-delete-button"
                  onClick={() => handleDelete(food)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default FoodList;
