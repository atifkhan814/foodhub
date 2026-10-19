
import { Link } from 'react-router';
import { ArrowRight, Leaf, ChefHat, Users } from 'lucide-react';

import './Hero.css';

function Hero() {
  const handleExploreMenu = () => {
    document.getElementById('menu')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <>
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <p className="hero-eyebrow">
              FRESHLY PREPARED, JUST FOR YOU
            </p>

            <span className="hero-accent-line"></span>

            <h1>
              Delicious Food,
              <br />
              Made for You
            </h1>

            <p className="hero-description">
              Fresh ingredients, bold flavors, and meals made
              with care. Find your new favorite and enjoy every
              bite.
            </p>

            <div className="hero-actions">
              <button
                type="button"
                className="hero-primary-button"
                onClick={handleExploreMenu}
              >
                Explore Our Menu
                <ArrowRight size={19} />
              </button>

              <Link
                to="/about"
                className="hero-secondary-button"
              >
                Discover Our Story
                <ArrowRight size={19} />
              </Link>
            </div>

            <div className="hero-highlights">
              <div className="hero-highlight">
                <Leaf size={32} />
                <div>
                  <h3>100%</h3>
                  <p>Fresh Ingredients</p>
                </div>
              </div>

              <div className="hero-highlight">
                <ChefHat size={34} />
                <div>
                  <h3>Made with</h3>
                  <p>Care</p>
                </div>
              </div>

              <div className="hero-highlight">
                <Users size={34} />
                <div>
                  <h3>Flavors for</h3>
                  <p>Everyone</p>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-image-wrapper">
            <img
              src="/food-images/food-img.jpg"
              alt="Delicious restaurant food"
              className="hero-image"
            />

            <div className="hero-image-badge">
              <span className="hero-badge-icon">
                <Leaf size={19} />
              </span>
              <span>Made fresh daily</span>
            </div>
          </div>
        </div>
      </section>

      <section className="hero-features">
        <div className="hero-features-container">
          <div className="hero-feature-item">
            <Leaf size={42} />
            <div>
              <h3>Fresh Ingredients</h3>
              <p>Quality in every bite</p>
            </div>
          </div>

          <div className="hero-feature-item">
            <ChefHat size={44} />
            <div>
              <h3>Made with Care</h3>
              <p>Prepared fresh for you</p>
            </div>
          </div>

          <div className="hero-feature-item">
            <Users size={44} />
            <div>
              <h3>Something for Everyone</h3>
              <p>Find your favorite dish</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Hero;
