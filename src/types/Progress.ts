import type { Meal } from './Meal';
import type { TodayMeal } from './TodayMeal';

export interface TodayMealWithFallback extends TodayMeal {
  fallback?: Meal;
}

export interface StoredProgress {
  date: string;
  meals: TodayMealWithFallback[];
}
