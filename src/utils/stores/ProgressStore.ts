import { localStorageStore } from '@skeletonlabs/skeleton';
import { get, type Writable } from 'svelte/store';
import type { StoredProgress } from '../../types/Progress';
import { warningToast } from '../ToastTrigger';
import { deleteMeal, getMealById } from './MealsStore';
import type { Meal } from '../../types/Meal';

export const progressStore: Writable<StoredProgress[]> = localStorageStore('progress', []);

export function getProgressByDate(date: string) {
  return get(progressStore).find((p) => p.date === date);
}

export function anyProgressDayWithThisMeal(mealId: string) {
  return !!get(progressStore).find((p) => p.meals.find((m) => m.id === mealId));
}

export function deleteProgressDay(date: string) {
  const day = getProgressByDate(date);

  if (!day) return;

  progressStore.update((days) => {
    const index = days.findIndex((d) => d.date === day.date);
    days.splice(index, 1);
    return days;
  });

  warningToast(`Day '${date}' was deleted from your progress`);

  day.meals.forEach((m) => {
    const meal = getMealById(m.id) as Meal;

    if (!meal.archived) return;

    if (!anyProgressDayWithThisMeal(meal.id)) {
      deleteMeal(meal.id, true);
    }
  });
}
