import { localStorageStore } from '@skeletonlabs/skeleton';
import type { Writable } from 'svelte/store';
import type { StoredProgress } from '../../types/Progress';

export const progressStore: Writable<StoredProgress[]> = localStorageStore('progress', []);
