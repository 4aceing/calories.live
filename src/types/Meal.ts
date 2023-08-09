export type Meal = {
  name: string;
  description: string;
  calculatedAs: MealCalculatedAs;
  grams?: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  imageUrl?: string;
  createdAtTimestamp: number;
  updatedAtTimestamp?: number;
};

export enum MealCalculatedAs {
  PerProduct,
  PerGrams,
}
