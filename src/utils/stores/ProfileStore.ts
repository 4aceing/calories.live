import { localStorageStore } from '@skeletonlabs/skeleton';
import { get, type Writable } from 'svelte/store';
import type { Profile } from '../../types/Profile';
import { checkProfile } from '../FirebaseDatabase';
import { warningToast } from '../ToastTrigger';

export const profileStore: Writable<Profile> = localStorageStore('profile', { name: '', password: '' });

export function setProfile(name: string, password: string) {
  profileStore.set({ name, password });
}

export function dissconnectProfile() {
  warningToast(`Dissconnected from profile '${get(profileStore).name}'`);

  profileStore.set({ name: '', password: '' });
}

export function activeProfile() {
  return get(profileStore).name;
}

export async function verifyActiveProfile() {
  const profile = get(profileStore);

  const profileIsValid = await checkProfile(profile.name, profile.password);

  if (profileIsValid) {
    return;
  }

  dissconnectProfile();
}
