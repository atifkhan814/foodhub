
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import toast from 'react-hot-toast';

import CartButton from './CartButton';
import MyOrders from '../MyOrders/MyOrders';
import './Navbar.css';

function Navbar({ cartCount }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Identify admin pages.
  const isAdminPage = location.pathname.startsWith('/admin');

  const [currentUser, setCurrentUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showMyOrders, setShowMyOrders] = useState(false);

  // Check the user's login session.
  useEffect(() => {
    async function updateCurrentUser() {
      try {
        const response = await fetch(
          'http://localhost:8000/api/users/me',
          {
            method: 'GET',
            credentials: 'include',
          }
        );

        if (response.ok) {
          const data = await response.json();
          setCurrentUser(data.user);
        } else {
          setCurrentUser(null);
          setShowMyOrders(false);
        }
      } catch (error) {
        console.error('Session check failed:', error);
        setCurrentUser(null);
      }
    }

    updateCurrentUser();

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
  }, [location.pathname]);

  // Close the mobile navigation menu.
  function closeMenu() {
    setMenuOpen(false);
  }

  // Navigate to cart.
  function handleCartClick() {
    closeMenu();
    navigate('/cart');
  }

  // Open My Orders drawer.
  function handleMyOrdersClick() {
    closeMenu();
    setShowMyOrders(true);
  }

  // Logout customer.
  async function handleLogout() {
    try {
      const response = await fetch(
        'http://localhost:8000/api/users/logout',
        {
          method: 'POST',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        toast.error('Logout failed. Please try again.');
        return;
      }

      setCurrentUser(null);
      setShowMyOrders(false);

      window.dispatchEvent(new Event('foodhub-auth-change'));

      closeMenu();

      toast.success('You have logged out successfully!');
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Something went wrong during logout.');
    }
  }

  // Keep the existing admin Menu navigation.
  function handleMenuClick(event) {
    event.preventDefault();
    closeMenu();

    navigate('/');

    window.setTimeout(() => {
      document.getElementById('menu')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 150);
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">

          {/* FoodHub Brand */}
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

          {/* Mobile Menu Button */}
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

              {/* Admin Navigation */}
              {isAdminPage && (
                <>
                  <li>
                    <Link to="/" onClick={closeMenu}>
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
                </>
              )}

              {/* Customer Authentication */}
              {!isAdminPage && (
                currentUser ? (
                  <>
                    <li>
                      <button
                        type="button"
                        className="navbar-orders-button"
                        onClick={handleMyOrdersClick}
                      >
                        My Orders
                      </button>
                    </li>

                    <li>
                      <button
                        type="button"
                        className="navbar-auth-button"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </>
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

            {/* Customer Cart */}
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

      {/* My Orders Drawer */}
      {!isAdminPage && currentUser && (
        <MyOrders
          isOpen={showMyOrders}
          onClose={() => setShowMyOrders(false)}
        />
      )}
    </>
  );
}

export default Navbar;
