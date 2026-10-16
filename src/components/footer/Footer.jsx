
import './Footer.css';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h2>
            Food<span>Hub</span>
          </h2>

          <p>
            Good Food. Happy Mood.
          </p>

          <p className="footer-description">
            Discover delicious meals, explore our menu,
            and enjoy your favorite food with FoodHub.
          </p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <a href="/">Home</a>
          <a href="/#menu">Our Menu</a>
          <a href="/about">About Us</a>
          <a href="/contact">Contact Us</a>
        </div>

        <div className="footer-contact">
          <h3>Contact Us</h3>
          <p>Email: info@foodhub.com</p>
          <p>Phone: +92 300 1234567</p>
          <p>Fresh food, served with care.</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} FoodHub.
          All rights reserved.
        </p>
        <p>Made with care for food lovers.</p>
      </div>
    </footer>
  );
}

export default Footer;
