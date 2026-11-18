
import { Link } from 'react-router';
import {
  ArrowRight,
  Leaf,
  ChefHat,
  Users,
  Sparkles,
} from 'lucide-react';

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
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="hero-container">

          {/* LEFT: HERO CONTENT */}
          <div className="hero-content">

            <div className="hero-eyebrow">
              <span className="hero-eyebrow-line"></span>
              <Sparkles size={15} />
              <span>GOOD FOOD. GOOD MOOD.</span>
            </div>

            <h1 id="hero-title">
              Fresh flavors.
              <br />
              <span>Made to make</span>
              <br />
              your day.
            </h1>

            <p className="hero-description">
              From your favorite comfort food to something new,
              discover delicious meals prepared with care and
              served fresh for every craving.
            </p>

            <div className="hero-actions">
              <button
                type="button"
                className="hero-primary-button"
                onClick={handleExploreMenu}
              >
                Explore Our Menu
                <ArrowRight size={18} />
              </button>

              <Link
                to="/about"
                className="hero-secondary-button"
              >
                Discover Our Story
                <span>
                  <ArrowRight size={17} />
                </span>
              </Link>
            </div>

            <div className="hero-content-note">
              <span className="hero-note-icon">
                <Leaf size={16} />
              </span>
              Fresh ingredients. Delicious moments. Every day.
            </div>

          </div>

          {/* RIGHT: HERO IMAGE */}
          <div className="hero-visual">

            <div className="hero-image-frame">

              <img
                src="/food-images/food-img.jpg"
                alt="Freshly prepared delicious FoodHub meal"
                className="hero-image"
                fetchPriority="high"
              />

              <div className="hero-image-overlay"></div>

              {/* Image information */}
              <div className="hero-image-badge">
                <div className="hero-badge-icon">
                  <Leaf size={19} />
                </div>

                <div className="hero-badge-content">
                  <span>OUR PROMISE</span>
                  <strong>Made fresh daily</strong>
                </div>

                <span className="hero-badge-check">✓</span>
              </div>

              <div className="hero-image-caption">
                GOOD FOOD, MADE WITH CARE
              </div>

            </div>

            <div className="hero-visual-accent"></div>

          </div>

        </div>
      </section>

      {/* FEATURE STRIP */}
      <section className="hero-features">
        <div className="hero-features-container">

          <div className="hero-feature-item">
            <div className="hero-feature-icon">
              <Leaf size={23} />
            </div>

            <div className="hero-feature-text">
              <h3>Fresh Ingredients</h3>
              <p>Quality in every bite</p>
            </div>
          </div>

          <div className="hero-feature-item">
            <div className="hero-feature-icon">
              <ChefHat size={24} />
            </div>

            <div className="hero-feature-text">
              <h3>Made with Care</h3>
              <p>Prepared fresh for you</p>
            </div>
          </div>

          <div className="hero-feature-item">
            <div className="hero-feature-icon">
              <Users size={24} />
            </div>

            <div className="hero-feature-text">
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
