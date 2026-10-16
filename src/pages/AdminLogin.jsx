
import { useState } from 'react';
import { useNavigate } from 'react-router';
import './AdminLogin.css';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  function handleLogin(event) {
    event.preventDefault();

    if (
      email === 'admin@foodhub.com' &&
      password === 'Admin123!'
    ) {
      localStorage.setItem(
        'foodhub_admin_logged_in',
        'true'
      );

      navigate('/admin');
    } else {
      setError('Invalid admin email or password.');
    }
  }

  return (
    <main className="admin-login-page">
      <form
        className="admin-login-form"
        onSubmit={handleLogin}
      >
        <h1>FoodHub Admin</h1>

        <p>Sign in to manage your restaurant menu.</p>

        <label htmlFor="admin-email">
          Email Address
        </label>

        <input
          id="admin-email"
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setError('');
          }}
          placeholder="Enter admin email"
          required
        />

        <label htmlFor="admin-password">
          Password
        </label>

        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setError('');
          }}
          placeholder="Enter password"
          required
        />

        {error && (
          <p className="admin-login-error">
            {error}
          </p>
        )}

        <button type="submit">
          Login as Admin
        </button>
      </form>
    </main>
  );
}

export default AdminLogin;
