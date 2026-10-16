import './Categories.css';

function Categories({ selectedCategory, setSelectedCategory }) {
  const categories = [
    { name: 'All', icon: '🍽️' },
    { name: 'Pizza', icon: '🍕' },
    { name: 'Burgers', icon: '🍔' },
    { name: 'Chicken', icon: '🍗' },
    { name: 'Salads', icon: '🥗' },
  ];

  return (
    <section className="categories-section">
      <div className="categories-heading">
        <span className="categories-eyebrow">FIND YOUR FAVORITE</span>
        <h2>Explore Our Menu</h2>
        <p>Fresh flavors and delicious choices for every craving.</p>
      </div>

      <div className="categories-list">
        {categories.map((category) => (
          <button
            key={category.name}
            type="button"
            className={
              selectedCategory === category.name
                ? 'category-item active'
                : 'category-item'
            }
            onClick={() => setSelectedCategory(category.name)}
            aria-pressed={selectedCategory === category.name}
          >
            <span className="category-icon">{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default Categories;