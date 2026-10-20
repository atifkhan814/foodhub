
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import toast from 'react-hot-toast';

import {
  getCurrentUser,
  clearCurrentUser,
} from '../../utils/localStorage';

import CartButton from './CartButton';
import './Navbar.css';

function Navbar({ cartCount }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Identify admin pages.
  const isAdminPage = location.pathname.startsWith('/admin');

  const [currentUser, setCurrentUser] = useState(
    () => getCurrentUser()
  );

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function updateCurrentUser() {
      setCurrentUser(getCurrentUser());
    }

    window.addEventListener(
      'foodhub-auth-change',
      updateCurrentUser
    );

    return () => {
      window.removeEventListener(
        'foodhub-auth-change',
        updateCurrentUser
      );
    };
  }, []);

  // Close the mobile navigation menu.
  function closeMenu() {
    setMenuOpen(false);
  }

  function handleHomeClick() {
  closeMenu();

  if (location.pathname !== '/') {
    navigate('/');
  } else {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}

  function handleCartClick() {
    closeMenu();
    navigate('/cart');
  }

  function handleLogout() {
    clearCurrentUser();
    setCurrentUser(null);
    closeMenu();

    toast.success('You have logged out successfully!');
    navigate('/');
  }

  function handleMenuClick(event) {
    event.preventDefault();
    closeMenu();

    navigate('/');

    // Wait for the homepage to render before scrolling.
    window.setTimeout(() => {
      document.getElementById('menu')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 150);
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link
          to="/"
          className="navbar-logo"
          onClick={closeMenu}
        >
          <span className="logo-icon">🍽️</span>
          <span>
            Food<span className="logo-highlight">Hub</span>
          </span>
        </Link>

        <button
          type="button"
          className="navbar-toggle"
          aria-label={
            menuOpen
              ? 'Close navigation menu'
              : 'Open navigation menu'
          }
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <div
          className={`navbar-menu ${menuOpen ? 'is-open' : ''}`}
        >
          <ul className="navbar-links">
            <li>
              <Link to="/" onClick={handleHomeClick}>
                Home
              </Link>
            </li>

            <li>
              <Link to="/#menu" onClick={handleMenuClick}>
                Menu
              </Link>
            </li>

            <li>
              <Link to="/about" onClick={closeMenu}>
                About
              </Link>
            </li>

            <li>
              <Link to="/contact" onClick={closeMenu}>
                Contact
              </Link>
            </li>

            {!isAdminPage && (
              currentUser ? (
                <li>
                  <button
                    type="button"
                    className="navbar-auth-button"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              ) : (
                <>
                  <li>
                    <Link to="/login" onClick={closeMenu}>
                      Login
                    </Link>
                  </li>

                  <li>
                    <Link to="/register" onClick={closeMenu}>
                      Register
                    </Link>
                  </li>
                </>
              )
            )}
          </ul>

          {!isAdminPage && (
            <div className="navbar-cart">
              <CartButton
                cartCount={cartCount}
                onCartClick={handleCartClick}
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
