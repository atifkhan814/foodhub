
import './Hero.css';

function Hero() {
  const handleExploreMenu = () => {
    document.getElementById('menu')?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>Delicious Food, Made for You</h1>

        <p>
          Fresh, flavorful meals prepared with quality ingredients
          and delivered to your table.
        </p>

        <button onClick={handleExploreMenu}>
          Explore Menu
        </button>
      </div>

      <div className="hero-image">
        <img
          src="/food-images/food-img.jpg"
          alt="Delicious restaurant food"
        />
      </div>
    </section>
  );
}

export default Hero;
