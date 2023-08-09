import { localStorageStore } from '@skeletonlabs/skeleton';
import type { Writable } from 'svelte/store';
import type { Meal } from '../types/Meal';

export const storeMeals: Writable<Meal[]> = localStorageStore('meals', []);