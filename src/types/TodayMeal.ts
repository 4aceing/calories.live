import type { Meal } from './Meal';

export interface TodayMeal extends Meal {
  quantity: number;
  computedCalories: number;
  computedProtein: number;
  computedCarbs: number;
  computedFat: number;
}

export interface StoredTodayMeal {
  id: string;
  quantity: number;
}
