import { localStorageStore } from '@skeletonlabs/skeleton';
import { get, type Writable } from 'svelte/store';
import type { Meal } from '../../types/Meal';
import { successToast, warningToast } from '../ToastTrigger';
import { deleteStoredTodayMeal } from './TodayMealsStore';
import type { Macros } from '../../types/Macros';
import { anyProgressDayWithThisMeal } from './ProgressStore';

export const mealsStore: Writable<Meal[]> = localStorageStore('meals', []);

export function getStoredMealById(id: string) {
  return get(mealsStore).find((m) => m.id === id);
}

export function getStoredMealByName(name: string) {
  return get(mealsStore).find((m) => m.name === name);
}

export function addStoredMeal(meal: Meal) {
  mealsStore.update((meals) => {
    meal.protein = +parseFloat(`${meal.protein}`).toFixed(2);
    meal.carbs = +parseFloat(`${meal.carbs}`).toFixed(2);
    meal.fat = +parseFloat(`${meal.fat}`).toFixed(2);
    meal.calculatedCalories = meal.protein * 4 + meal.carbs * 4 + meal.fat * 9;

    meals.push(meal);
    return meals;
  });

  successToast(`Meal '${meal.name}' was added to your list`);
}

export function updateStoredMeal(meal: Meal) {
  mealsStore.update((meals) => {
    meal.updatedAtTimestamp = Date.now();
    meal.protein = +parseFloat(`${meal.protein}`).toFixed(2);
    meal.carbs = +parseFloat(`${meal.carbs}`).toFixed(2);
    meal.fat = +parseFloat(`${meal.fat}`).toFixed(2);
    meal.calculatedCalories = meal.protein * 4 + meal.carbs * 4 + meal.fat * 9;

    const index = meals.findIndex((m) => m.id === meal.id);
    meals.splice(index, 1, meal);
    return meals;
  });

  successToast(`Meal '${meal.name}' was edited`);
}

export function deleteStoredMeal(id: string, simple = false) {
  const meal = getStoredMealById(id);

  if (!meal) return;

  mealsStore.update((meals) => {
    if (anyProgressDayWithThisMeal(meal.id)) {
      (meals.find(m => m.id === meal.id) as Meal).archived = true;
    } else {
      const index = meals.indexOf(meal);
      meals.splice(index, 1);
    }
    return meals;
  });

  if (simple) return;
  
  warningToast(`Meal '${meal.name}' was deleted from your list`);

  deleteStoredTodayMeal(meal);
}
