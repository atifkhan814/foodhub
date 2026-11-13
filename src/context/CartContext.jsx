
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { CartContext } from './CartContextObject';

const CART_KEY = 'foodhub_cart';

// Convert a food object into a consistent cart item
function prepareFood(food) {
  const rawPrice =
    food.price ??
    food.foodPrice ??
    food.product?.price;

  const price =
    typeof rawPrice === "string"
      ? Number(rawPrice.replace(/[$,\s]/g, ""))
      : Number(rawPrice?.$numberDecimal ?? rawPrice);

  return {
    ...food,
    id: food._id || food.id,
    price,
  };
}

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
      console.error('Unable to save cart:', error);
    }
  }, [cart]);

  // Add food to cart
  async function addToCart(food) {
    try {
      const response = await fetch(
        'http://localhost:8000/api/users/me',
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        toast.error('Please log in before adding food to your cart.');
        navigate('/login');
        return;
      }

      const cartFood = prepareFood(food);

      if (!Number.isFinite(cartFood.price) || cartFood.price < 0) {
        toast.error('This food has an invalid price. Please refresh the menu.');
        console.error('Invalid food price:', food);
        return;
      }

      setCart((previousCart) => [...previousCart, cartFood]);

      toast.success(`${cartFood.name} added to cart!`);

    } catch (error) {
      console.error('Authentication check failed:', error);
      toast.error('Unable to verify your login. Please try again.');
    }
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
    localStorage.removeItem(CART_KEY);
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
