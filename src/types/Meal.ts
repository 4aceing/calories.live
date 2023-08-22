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
  archived?: boolean;
}

export enum MealCalculatedAs {
  PerProduct,
  PerGrams,
} 
