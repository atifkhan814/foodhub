
import './About.css';

function About() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="about-hero-content">
          <span className="about-label">WELCOME TO FOODHUB</span>

          <h1>
            Good Food.
            <br />
            <span>Happy Mood.</span>
          </h1>

          <p>
            We believe great food brings people together.
            At FoodHub, every meal is an opportunity to enjoy
            delicious flavors, discover new favorites, and make
            everyday moments special.
          </p>

          <a href="#our-story" className="about-hero-button">
            Discover Our Story
          </a>
        </div>

        <div className="about-hero-decoration" aria-hidden="true">
          <div className="about-food-circle">
            <span>🍕</span>
          </div>
          <div className="about-floating-food about-food-one">🍔</div>
          <div className="about-floating-food about-food-two">🥗</div>
          <div className="about-floating-food about-food-three">🍗</div>
        </div>
      </section>

      <section className="about-story" id="our-story">
        <div className="about-story-mark" aria-hidden="true">
          <span>🍽️</span>
          <small>Made with care</small>
        </div>

        <div className="about-story-content">
          <span className="about-label">OUR STORY</span>
          <h2>More Than Just a Meal</h2>

          <p>
            FoodHub was created around one simple idea: ordering
            great food should be easy, enjoyable, and convenient.
            We bring a variety of delicious choices together in
            one place, so you can find something for every craving.
          </p>

          <p>
            Whether you are sharing dinner with family, enjoying
            a meal with friends, or taking a break from a busy day,
            FoodHub is here to make your food experience special.
          </p>
        </div>
      </section>

      <section className="about-values">
        <div className="about-section-heading">
          <span className="about-label">THE FOODHUB DIFFERENCE</span>
          <h2>What Makes Us Special?</h2>
          <p>
            Good food, thoughtful service, and an experience
            designed around you.
          </p>
        </div>

        <div className="about-value-grid">
          <article className="about-value-card">
            <div className="about-value-icon">🥬</div>
            <h3>Quality Ingredients</h3>
            <p>
              We value carefully selected ingredients and the
              flavors that make every dish enjoyable.
            </p>
          </article>

          <article className="about-value-card">
            <div className="about-value-icon">👨‍🍳</div>
            <h3>Made with Passion</h3>
            <p>
              Every dish deserves attention, care, and a love
              for good food.
            </p>
          </article>

          <article className="about-value-card">
            <div className="about-value-icon">🍽️</div>
            <h3>Something for Everyone</h3>
            <p>
              Explore favorites like pizza, burgers, chicken,
              salads, and more from our menu.
            </p>
          </article>

          <article className="about-value-card">
            <div className="about-value-icon">💚</div>
            <h3>Customer First</h3>
            <p>
              We aim to make browsing the menu, ordering food,
              and enjoying your meal simple and convenient.
            </p>
          </article>
        </div>
      </section>

      <section className="about-food-section">
        <div className="about-food-content">
          <span className="about-label">EXPLORE OUR MENU</span>
          <h2>Find Your Next Favorite</h2>
          <p>
            In the mood for a cheesy pizza, a juicy burger,
            flavorful chicken, or a fresh salad? Discover
            different dishes and choose the food that fits
            your appetite.
          </p>

          <a href="/#menu" className="about-menu-button">
            Explore Our Menu →
          </a>
        </div>

        <div className="about-food-list">
          <div className="about-food-item">
            <span>🍕</span>
            <div>
              <h3>Pizza</h3>
              <p>Cheesy, comforting favorites</p>
            </div>
          </div>

          <div className="about-food-item">
            <span>🍔</span>
            <div>
              <h3>Burgers</h3>
              <p>Big flavor in every bite</p>
            </div>
          </div>

          <div className="about-food-item">
            <span>🍗</span>
            <div>
              <h3>Chicken</h3>
              <p>Satisfying meal choices</p>
            </div>
          </div>

          <div className="about-food-item">
            <span>🥗</span>
            <div>
              <h3>Fresh Choices</h3>
              <p>A lighter option for your day</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-closing">
        <span className="about-closing-icon">💚</span>
        <h2>Your Cravings, Our Passion</h2>
        <p>
          Thank you for making FoodHub part of your day.
          We look forward to being part of your next meal.
        </p>
        <a href="/#menu" className="about-hero-button">
          Find Something Delicious
        </a>
      </section>
    </main>
  );
}

export default About;
