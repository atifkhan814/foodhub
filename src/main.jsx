import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CartProvider } from './context/CartContext';
import { FoodProvider } from './context/food/FoodContext';
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <FoodProvider>
          <App />
        </FoodProvider>
      </CartProvider>
    </BrowserRouter>
  </StrictMode>,
)
