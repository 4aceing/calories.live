import { localStorageStore } from '@skeletonlabs/skeleton';
import { get, type Writable } from 'svelte/store';
import type { StoredTodayMeal, TodayMeal } from '../../types/TodayMeal';
import type { Meal } from '../../types/Meal';
import { errorToast, successToast, warningToast } from '../ToastTrigger';
import { getProgressByDate, progressStore } from './ProgressStore';
import type { StoredProgress, TodayMealWithFallback } from '../../types/Progress';

export const todayMealsStore: Writable<StoredTodayMeal[]> = localStorageStore('todayMeals', []);

export function getTodayMealById(id: string) {
  return get(todayMealsStore).find((m) => m.id === id);
}

export function addTodayMeal(meal: Meal) {
  if (getTodayMealById(meal.id)) {
    errorToast(`Meal '${meal.name}' is already included in today's list`);

    return;
  }

  todayMealsStore.update((todayMeals) => {
    todayMeals.push({
      id: meal.id,
      quantity: meal.grams || 1,
    });
    return todayMeals;
  });

  successToast(`Included '${meal.name}' into today's list of meals`);
}

export function updateTodayMealQuantity(id: string, quantity: number) {
  todayMealsStore.update((todayMeals) => {
    const todayMeal = todayMeals.find((todayMeal) => todayMeal.id === id);

    if (todayMeal) {
      todayMeal.quantity = quantity;
    }

    return todayMeals;
  });
}

export function deleteTodayMeal(meal: Meal) {
  const todayMeal = getTodayMealById(meal.id);

  if (!todayMeal) return;

  todayMealsStore.update((todayMeals) => {
    const index = todayMeals.findIndex((m) => m.id === todayMeal.id);
    todayMeals.splice(index, 1);
    return todayMeals;
  });

  warningToast(`Excluded '${meal.name}' from today's list of meals`);
}

export function finishTodayMeal(date: string, todayMeals: TodayMeal[]) {
  progressStore.update((days) => {
    if (getProgressByDate(date)) {
      const day = days.find((d) => d.date === date) as StoredProgress;
      day.meals = todayMeals.map(
        (todayMeal) =>
          ({
            id: todayMeal.id,
            quantity: todayMeal.quantity,
          } as TodayMealWithFallback),
      );
    } else {
      days.push({
        date,
        meals: todayMeals.map(
          (todayMeal) =>
            ({
              id: todayMeal.id,
              quantity: todayMeal.quantity,
            } as TodayMealWithFallback),
        ),
      });
      days.sort((a, b) => (a.date < b.date ? 1 : -1));
    }
    return days;
  });

  todayMealsStore.set([]);

  successToast(`Day ${date} was saved`);
}
