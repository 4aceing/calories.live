export interface Meal {
  id: string;
  name: string;
  description: string;
  calculatedAs: MealCalculatedAs;
  grams?: number;
  calories: number;
  calculatedCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  imageUrl?: string;
  createdAtTimestamp: number;
  updatedAtTimestamp?: number;
};

export interface TodayMeal extends Meal {
  quantity: number;
  computedCalories: number;
  computedProtein: number;
  computedCarbs: number;
  computedFat: number;
}

export enum MealCalculatedAs {
  PerProduct,
  PerGrams,
}
