
import { useState } from 'react';
import { useCart } from '../context/useCart';
import Hero from '../components/hero/Hero';
import Categories from '../components/categories/Categories';
import MenuSection from '../components/menusection/MenuSection';

function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { addToCart } = useCart();

  return (
    <>
      <Hero />

      <Categories
        setSelectedCategory={setSelectedCategory}
      />

      <MenuSection
        selectedCategory={selectedCategory}
        onAddToCart={addToCart}
      />
    </>
  );
}

export default HomePage;
