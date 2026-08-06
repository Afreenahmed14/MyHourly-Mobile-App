import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

/**
 * Native port of frontend/src/config/firebase.js. Same Firebase *project*
 * (these values are public identifiers, not secrets) — only the SDK
 * bootstrapping differs: React Native needs explicit AsyncStorage-backed
 * persistence since there's no browser localStorage.
 *
 * Provide these via app.config.js -> extra (e.g. from an .env loaded with
 * dotenv in app.config.js), mirroring the web app's VITE_FIREBASE_* vars.
 */
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey,
  authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain,
  projectId: Constants.expoConfig?.extra?.firebaseProjectId,
  storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket,
  messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId,
  appId: Constants.expoConfig?.extra?.firebaseAppId,
};

const alreadyInitialized = getApps().length > 0;
export const firebaseApp = alreadyInitialized ? getApp() : initializeApp(firebaseConfig);

let authInstance;
try {
  authInstance = initializeAuth(firebaseApp, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  // initializeAuth throws if already called for this app (e.g. Fast Refresh
  // during development) — fall back to the existing instance.
  authInstance = getAuth(firebaseApp);
}
export const auth = authInstance;
