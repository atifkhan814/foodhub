import { useNavigate } from 'react-router';
import './Register.css';

function Register() {
  const navigate = useNavigate();

  async function handleRegister(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const name = formData.get('fullName').trim();
    const email = formData.get('email').trim().toLowerCase();
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/users/register', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Registration failed. Please try again.');
        return;
      }

      alert('Registration successful! Please log in.');
      navigate('/login');

    } catch (error) {
      console.error('Registration error:', error);
      alert('Unable to connect to the server. Please try again.');
    }
  }

  return (
    <div className="register-page">
      <div className="register-card">
        <h1>Create Your FoodHub Account</h1>
        <p>Join FoodHub and enjoy your favorite meals.</p>

        <form onSubmit={handleRegister}>
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Enter your full name"
            required
          />

          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Create a password"
            required
          />

          <label htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Enter your password again"
            required
          />

          <button type="submit">Create Account</button>
        </form>

        <p className="register-login">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;