
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import './Categories.css';

function Categories({ selectedCategory, setSelectedCategory }) {
  const categories = [
    { name: 'All', icon: '🍽️' },
    { name: 'Pizza', icon: '🍕' },
    { name: 'Burgers', icon: '🍔' },
    { name: 'Chicken', icon: '🍗' },
    { name: 'Salads', icon: '🥗' },
  ];

  const activeCategory =
    categories.find((category) => category.name === selectedCategory) ||
    categories[0];

  return (
    <section className="categories-section">
      <div className="categories-toolbar">

        <div className="categories-intro">
          <div className="categories-mark">
            <SlidersHorizontal size={17} />
          </div>

          <div className="categories-intro-text">
            <span className="categories-eyebrow">MENU FILTER</span>
            <h3>Browse by category</h3>
            <p>Choose a category to find your favorite food.</p>
          </div>
        </div>

        <div className="category-select-area">
          <label
            className="category-select-label"
            htmlFor="food-category"
          >
            CATEGORY
          </label>

          <div className="category-select-control">
            <span className="category-selected-icon">
              {activeCategory.icon}
            </span>

            <select
              id="food-category"
              className="categories-dropdown"
              value={selectedCategory}
              onChange={(event) =>
                setSelectedCategory(event.target.value)
              }
              aria-label="Filter food by category"
            >
              {categories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>

            <ChevronDown
              className="category-chevron"
              size={16}
              aria-hidden="true"
            />
          </div>
        </div>

      </div>
    </section>
  );
}

export default Categories;
