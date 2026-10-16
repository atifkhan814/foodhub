
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { CartContext } from './CartContextObject';

const CART_KEY = 'foodhub_cart';

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem(CART_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  const navigate = useNavigate();

  // Save cart whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error(
        'Unable to save cart to localStorage:',
        error
      );
    }
  }, [cart]);

  // Add food to cart
  function addToCart(food) {
    const currentUser = localStorage.getItem(
      'foodhub_current_user'
    );

    if (!currentUser) {
      toast.error('Please log in before adding food to your cart.');
      navigate('/login');
      return;
    }

    setCart((previousCart) => [...previousCart, food]);

    toast.success(`${food.name} added to cart!`);
  }

  // Remove one food item from cart
  function removeFromCart(food) {
    setCart((previousCart) => {
      const index = previousCart.indexOf(food);

      if (index === -1) {
        return previousCart;
      }

      return previousCart.filter(
        (item, itemIndex) => itemIndex !== index
      );
    });

    toast.success(`${food.name} removed from cart.`);
  }

  // Clear the entire cart after successful checkout
  function clearCart() {
    setCart([]);
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
