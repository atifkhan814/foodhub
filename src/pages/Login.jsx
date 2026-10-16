
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';

import {
  getUsers,
  saveCurrentUser,
} from '../utils/localStorage';

import './Login.css';

function Login() {
  const navigate = useNavigate();

  function handleLogin(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const email = formData.get('email').trim().toLowerCase();
    const password = formData.get('password');

    const users = getUsers();

    const matchedUser = users.find(
      (user) =>
        user.email === email &&
        user.password === password
    );

    if (!matchedUser) {
      toast.error('Invalid email or password. Please try again.');
      return;
    }

    saveCurrentUser({
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
    });

    toast.success('Login successful! Welcome to FoodHub.');

    navigate('/');
  }

  return (
    <div className="login-page">
      <div className="login-layout">

        {/* Left side: FoodHub branding */}
        <div className="login-welcome">
          <div className="foodhub-brand">
            <span className="brand-icon">♨</span>

            <div>
              <h2>
                Food<span>Hub</span>
              </h2>
              <p>Good Food · Happy Mood</p>
            </div>
          </div>

          <div className="welcome-content">
            <h1>
              Delicious Food
              <span>Awaits You!</span>
            </h1>

            <p className="welcome-description">
              Log in to your FoodHub account and
              get ready to enjoy your favorite meals,
              exclusive offers and a better dining
              experience.
            </p>

            <div className="food-benefits">
              <p>🍽️ <span>Fresh & Tasty Food</span></p>
              <p>🚚 <span>Fast & Reliable Delivery</span></p>
              <p>⭐ <span>Exclusive Offers</span></p>
            </div>
          </div>

          <img
            className="welcome-pizza"
            src="/food-images/login-pizza.jpg"
            alt="Freshly baked pizza"
          />

          <p className="welcome-tagline">
            Good Food · Happy Mood
          </p>
        </div>

        {/* Right side: Login form */}
        <div className="login-form-panel">
          <div className="chef-icon">♨</div>

          <h1 className="login-heading">
            Welcome <span>Back!</span>
          </h1>

          <p className="login-subheading">
            Login to your FoodHub account
          </p>

          <form onSubmit={handleLogin}>
            <div className="login-input-group">
              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="login-input-group">
              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="forgot-password">
              <a
                href="#forgot-password"
                onClick={(event) => event.preventDefault()}
              >
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="login-button"
            >
              ↪ &nbsp; Login
            </button>
          </form>

          <div className="login-divider">
            <span></span>
            OR
            <span></span>
          </div>

          <button
            type="button"
            className="google-button"
            disabled
          >
            🌐 &nbsp; Continue with Google
          </button>

          <p className="login-switch">
            Don't have an account?

            <button
              type="button"
              onClick={() => navigate('/register')}
            >
              Register
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;
