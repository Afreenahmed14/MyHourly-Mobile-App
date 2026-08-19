// Same backend the existing React (Vite) frontend talks to — no new APIs,
// no changes to endpoints. Override via app.config.js -> extra, or an env
// var injected at build time, if you need a different backend per build
// profile (dev/staging/prod).
import Constants from 'expo-constants';

export const API_BASE_URL =
  Constants.expoConfig?.extra?.apiBaseUrl ||
  'https://e-commerce-zvmh.onrender.com/api/v1';

// Backend origin without the /api/v1 suffix — used to resolve image fields
// (profileImage, logo, etc.) that come back from the API as a relative
// path like "/uploads/profileImages/xyz.jpg" instead of a full URL.
export const API_ORIGIN = API_BASE_URL.replace(/\/api(\/v\d+)?\/?$/, '');

// Turns a possibly-relative image path from the backend into an absolute
// URL that <Image> can load. Returns null for empty/falsy input so
// callers can fall back to a placeholder avatar.
export const resolveImageUrl = (path) => {
  if (!path) return null;
  // Already absolute (remote URL) or a local device URI (freshly picked
  // photo, not yet uploaded) — pass through unchanged.
  if (/^(https?|file|content|ph|assets-library|data):/i.test(path)) return path;
  return `${API_ORIGIN}/${String(path).replace(/^\/+/, '')}`;
};

export const ROLES = {
  ADMIN: 'admin',
  CANDIDATE: 'candidate',
  COMPANY: 'company',
};
