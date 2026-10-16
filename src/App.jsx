
import { Routes, Route } from 'react-router';

import './App.css';

import AdminLogin from './pages/AdminLogin';
import ProtectedAdmin from './components/admin/ProtectedAdmin';

import AdminPage from './pages/AdminPage';
import HomePage from './pages/HomePage';
import Navbar from './components/navbar/Navbar';
import Cart from './pages/CartPage';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import { useCart } from './context/useCart';
import { Toaster } from 'react-hot-toast';

import Footer from './components/footer/Footer';

function App() {
  const { cart } = useCart();

  return (
    <>
       <Toaster position="bottom-right" />

      <Navbar cartCount={cart.length} />

      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/cart" element={<Cart />} />

        <Route path="/admin-login" element={<AdminLogin />} />

        <Route path="/admin" element={<ProtectedAdmin><AdminPage /></ProtectedAdmin>} />
      </Routes>
            <Footer />
    </>
  );
}

export default App;
