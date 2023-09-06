import { initializeApp } from 'firebase/app';
import { getDatabase, set, ref, get } from 'firebase/database';
import sha256 from 'crypto-js/sha256';
import hexEnc from 'crypto-js/enc-hex';

export function initializeFirebaseApp() {
  const firebaseConfig = {
    apiKey: 'AIzaSyBRUrMf5C1d20S3H5Idkzh-vdLWtKBT7Ss',
    authDomain: 'calories-live.firebaseapp.com',
    databaseURL: 'https://calories-live-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'calories-live',
    storageBucket: 'calories-live.appspot.com',
    messagingSenderId: '1022668932499',
    appId: '1:1022668932499:web:b43d4e15e7ecd537335466',
    measurementId: 'G-8DTNZ4BKLY',
  };

  initializeApp(firebaseConfig);
}

export async function createProfile(name: string, password?: string): Promise<boolean> {
  const db = getDatabase();

  const profileRef = ref(db, name);
  const snapshot = await get(profileRef);

  if (snapshot.exists()) {
    return false;
  }

  const hashedPassword = password ? sha256(password).toString(hexEnc) : '';

  await set(profileRef, {
    password: hashedPassword,
  });

  return true;
}

export async function accessProfile(name: string, password?: string): Promise<boolean> {
  const db = getDatabase();

  const profileRef = ref(db, name);
  const snapshot = await get(profileRef);

  if (!snapshot.exists()) {
    return false;
  }

  const hashedPassword = password ? sha256(password).toString(hexEnc) : '';

  const savedPassword = snapshot.child('password').val();

  if (hashedPassword !== savedPassword) {
    return false;
  }

  return true;
}

export async function getSavedPasswordOfProfile(name: string): Promise<string> {
  const db = getDatabase();

  const profileRef = ref(db, name);
  const snapshot = await get(profileRef);

  if (!snapshot.exists()) {
    return '';
  }

  const savedPassword = snapshot.child('password').val();

  return savedPassword;
}

export async function checkProfile(name: string, hashedPassword: string): Promise<boolean> {
  const db = getDatabase();

  const profileRef = ref(db, name);
  const snapshot = await get(profileRef);

  if (!snapshot.exists()) {
    return false;
  }

  const savedPassword = snapshot.child('password').val();

  if (hashedPassword !== savedPassword) {
    return false;
  }

  return true;
}
