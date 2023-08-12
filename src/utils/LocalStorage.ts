import { localStorageStore } from '@skeletonlabs/skeleton';
import type { Writable } from 'svelte/store';
import type { Meal, TodayMeal } from '../types/Meal';

export const storeMeals: Writable<Meal[]> = localStorageStore('meals', []);

export const storeTodayMeals: Writable<{ mealId: string; quantity: number }[]> = localStorageStore('todayMeals', []);

export const storeProgress: Writable<{ day: string; meals: { id: string; quantity: number; fallback?: Meal }[] }[]> =
  localStorageStore('progress', []);
