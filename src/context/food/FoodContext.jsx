
import { useEffect, useState } from 'react';
import { FoodContext } from './FoodContextObject';

const API_URL = 'http://localhost:8000/api/foods';

// Convert backend food data into the format used by React components.
function formatFood(food) {
  return {
    ...food,
    id: food._id || food.id,
    price: `$${food.price}`,
  };
}

// Convert food details into FormData for Multer.
function createFoodFormData(food) {
  const formData = new FormData();

  formData.append('name', food.name);
  formData.append('description', food.description);
  formData.append(
    'price',
    Number(String(food.price).replace('$', ''))
  );
  formData.append('category', food.category);

  // Send the actual image file only when a new image is selected.
  if (food.imageFile) {
    formData.append('image', food.imageFile);
  }

  return formData;
}

export function FoodProvider({ children }) {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load food items from MongoDB when the app starts.
  useEffect(() => {
    async function fetchFoods() {
      try {
        const response = await fetch(API_URL);
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Failed to load foods');
        }

        setFoods(result.data.map(formatFood));
      } catch (error) {
        console.error('Error loading foods:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFoods();
  }, []);

  // Add a new food item to MongoDB.
  async function addFood(food) {
    try {
      const formData = createFoodFormData(food);

      const response = await fetch(API_URL, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to add food');
      }

      setFoods((previousFoods) => [
        ...previousFoods,
        formatFood(result.data),
      ]);

      return result.data;
    } catch (error) {
      console.error('Error adding food:', error);
      throw error;
    }
  }

  // Update an existing food item in MongoDB.
  async function updateFood(food) {
    try {
      const formData = createFoodFormData(food);

      const response = await fetch(`${API_URL}/${food.id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to update food');
      }

      const updatedFood = formatFood(result.data);

      setFoods((previousFoods) =>
        previousFoods.map((item) =>
          item.id === updatedFood.id ? updatedFood : item
        )
      );

      return result.data;
    } catch (error) {
      console.error('Error updating food:', error);
      throw error;
    }
  }

  // Delete a food item from MongoDB.
  async function deleteFood(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to delete food');
      }

      setFoods((previousFoods) =>
        previousFoods.filter((food) => food.id !== id)
      );

      return result.data;
    } catch (error) {
      console.error('Error deleting food:', error);
      throw error;
    }
  }

  return (
    <FoodContext.Provider
      value={{ foods, loading, addFood, updateFood, deleteFood }}
    >
      {children}
    </FoodContext.Provider>
  );
}
