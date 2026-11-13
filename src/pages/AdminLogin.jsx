
import { useState } from 'react';
import { useNavigate } from 'react-router';
import './AdminLogin.css';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleLogin(event) {
    event.preventDefault();

    setError('');
    setLoading(true);

    try {
      const response = await fetch(
        'http://localhost:8000/api/users/admin-login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Invalid admin email or password.');
        return;
      }

      navigate('/admin');

    } catch (error) {
      console.error('Admin login error:', error);
      setError('Unable to connect to the server. Please try again.');
    } finally {
      setLoading(false);
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

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login as Admin'}
        </button>
      </form>
    </main>
  );
}

export default AdminLogin;
