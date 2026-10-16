import { useNavigate } from 'react-router';
import { getUsers, saveUsers } from '../utils/localStorage';
import './Register.css';

function Register() {
  const navigate = useNavigate();

  
function handleRegister(event) {
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

  const users = getUsers();

  const userExists = users.some(
    (user) => user.email === email
  );

  if (userExists) {
    alert('This email is already registered. Please log in.');
    return;
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    // Demo only: do not store real passwords in localStorage.
    password,
  };

  saveUsers([...users, newUser]);

  alert('Registration successful! Please log in.');
  navigate('/login');
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
