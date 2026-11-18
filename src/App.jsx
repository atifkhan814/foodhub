
import { Routes, Route } from 'react-router';

import './App.css';

import AdminLogin from './pages/AdminLogin';
import ProtectedAdmin from './components/admin/ProtectedAdmin';
import AdminPage from './pages/AdminPage';

import HomePage from './pages/HomePage';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/CartPage';

import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import CustomerChat from './components/chat/CustomerChat';

import { useCart } from './context/useCart';
import { Toaster } from 'react-hot-toast';

function App() {
  const { cart } = useCart();

  return (
    <>
      <Toaster position="bottom-right" />

      <Navbar cartCount={cart.length} />

      <Routes>
        {/* Customer Pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Other Public Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />

        {/* Admin Pages */}
        <Route path="/admin-login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <ProtectedAdmin>
              <AdminPage />
            </ProtectedAdmin>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedAdmin>
              <AdminPage />
            </ProtectedAdmin>
          }
        />
      </Routes>

      <CustomerChat />

      <Footer />
    </>
  );
}

export default App;
