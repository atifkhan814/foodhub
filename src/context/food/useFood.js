
import { useContext } from 'react';
import { FoodContext } from './FoodContextObject';

export function useFood() {
  return useContext(FoodContext);
}
