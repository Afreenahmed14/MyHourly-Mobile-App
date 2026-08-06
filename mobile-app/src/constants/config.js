// Same backend the existing React (Vite) frontend talks to — no new APIs,
// no changes to endpoints. Override via app.config.js -> extra, or an env
// var injected at build time, if you need a different backend per build
// profile (dev/staging/prod).
import Constants from 'expo-constants';

export const API_BASE_URL =
  Constants.expoConfig?.extra?.apiBaseUrl ||
  'https://e-commerce-zvmh.onrender.com/api/v1';

export const ROLES = {
  ADMIN: 'admin',
  CANDIDATE: 'candidate',
  COMPANY: 'company',
};
