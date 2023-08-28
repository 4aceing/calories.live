import { errorToast } from './ToastTrigger';

let db: IDBDatabase | null = null;

export function openDatabase() {
  return new Promise<void>((resolve) => {
    if (!('indexedDB' in window)) {
      return;
    }

    const request = window.indexedDB.open('images-for-meals');

    request.onerror = () => resolve();

    request.onsuccess = (event) => {
      db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains('images')) {
        db.createObjectStore('images');
      }

      resolve();
    };
  });
}

export async function getMealImage(mealId: string) {
  if (await databaseUnavailable()) {
    return '';
  }

  return new Promise<string>((resolve) => {
    const request = (db as IDBDatabase).transaction(['images'], 'readwrite').objectStore('images').get(mealId);

    request.onsuccess = () => resolve(request.result);

    request.onerror = () => resolve('');
  });
}

export async function addMealImage(mealId: string, mealName: string, base64Image: string) {
  if (await databaseUnavailable()) {
    errorToast(`Image for ${mealName} could not be saved, try again`);
    return;
  }

  return new Promise<void>((resolve) => {
    const request = (db as IDBDatabase)
      .transaction(['images'], 'readwrite')
      .objectStore('images')
      .add(base64Image, mealId);

    request.onerror = () => {
      errorToast(`Image for ${mealName} could not be saved, try again`);
      resolve();
    };

    request.onsuccess = () => resolve();
  });
}

export async function deleteMealImage(mealId: string) {
  if (await databaseUnavailable()) {
    return;
  }

  (db as IDBDatabase).transaction(['images'], 'readwrite').objectStore('images').delete(mealId);
}

async function databaseUnavailable() {
  if (!db) {
    await openDatabase();

    if (!db) {
      return true;
    }
  }

  return false;
}
