
import { useEffect, useState } from 'react';
import { FoodContext } from './FoodContextObject';

const initialFoods = [
  {
    id: 1,
    name: 'Margherita Pizza',
    description: 'Fresh tomato, mozzarella cheese, and basil.',
    price: '$12',
    image: '/food-images/pizza.jpg',
    category: 'Pizza',
  },
  {
    id: 2,
    name: 'Classic Burger',
    description: 'Juicy beef patty with cheese and fresh vegetables.',
    price: '$10',
    image: '/food-images/burger.jpg',
    category: 'Burgers',
  },
  {
    id: 3,
    name: 'Grilled Chicken',
    description: 'Tender grilled chicken with herbs and vegetables.',
    price: '$15',
    image: '/food-images/grilled-chicken.jpg',
    category: 'Chicken',
  },
];

export function FoodProvider({ children }) {
  const [foods, setFoods] = useState(() => {
    const savedFoods = localStorage.getItem('foodhub_foods');

    return savedFoods === null
      ? initialFoods
      : JSON.parse(savedFoods);
  });

  useEffect(() => {
    localStorage.setItem('foodhub_foods', JSON.stringify(foods));
  }, [foods]);

  function addFood(food) {
    const newFood = {
      ...food,
      id: Date.now(),
    };

    setFoods((previousFoods) => [...previousFoods, newFood]);
  }

  function updateFood(updatedFood) {
    setFoods((previousFoods) =>
      previousFoods.map((food) =>
        food.id === updatedFood.id ? updatedFood : food
      )
    );
  }

  function deleteFood(id) {
    setFoods((previousFoods) =>
      previousFoods.filter((food) => food.id !== id)
    );
  }

  return (
    <FoodContext.Provider
      value={{ foods, addFood, updateFood, deleteFood }}
    >
      {children}
    </FoodContext.Provider>
  );
}
