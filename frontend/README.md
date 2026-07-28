# HourlyRecruit — Mobile (Expo / React Native)

Mirrors the web app (`e-commerce-h52b.vercel.app`) design and connects to the
same backend (`https://e-commerce-zvmh.onrender.com/api/v1`).

## 1. Copy into your existing Expo project

You already have an Expo project scaffolded (from `npx create-expo-app`). Copy
these into it, merging with what's already there:

- `app/` — routes (Expo Router)
- `src/` — api client, auth context, components, theme

If your existing project doesn't use Expo Router yet, run:

```bash
npx expo install expo-router
```

and make sure `app.json` has `"scheme"` set and `package.json`'s `main` is
`"expo-router/entry"`.

## 2. Install dependencies

```bash
npx expo install expo-secure-store @expo/vector-icons
```

(`@expo/vector-icons` is usually already bundled with Expo, but install if missing.)

## 3. Environment

Create a `.env` (Expo reads `EXPO_PUBLIC_*` vars automatically):

```
EXPO_PUBLIC_API_BASE_URL=https://e-commerce-zvmh.onrender.com/api/v1
```

## 4. Run

```bash
npx expo start
```

## What's included

- `src/api/client.ts` — fetch wrapper with Bearer token + silent refresh
- `src/api/authService.ts`, `candidateService.ts` — mirrors the web `services/`
- `src/context/AuthContext.tsx` — mirrors web `AuthContext`
- `src/constants/theme.ts` — colors/spacing pulled from web `variables.css`
- `app/(auth)/*` — login-choice, login-candidate, login-company, register
- `app/(tabs)/*` — browse (search + list), notifications, profile
- `app/candidate/[id].tsx` — candidate profile detail

## What's NOT included yet (needs backend changes first — see chat)

- Refresh token via SecureStore instead of cookie (needs backend to also
  return `refreshToken` in the JSON body — see the NOTE in `src/api/client.ts`)
- Firebase phone/Google sign-in buttons (needs `@react-native-firebase/auth`
  or Expo's Firebase JS SDK wired to your existing Firebase project)
- Razorpay checkout (needs `react-native-razorpay`, native SDK instead of the
  web popup flow)
- Push notifications (needs Expo push token registration endpoint)
- Company dashboard screens (post job, applicants, hires) — same pattern as
  Browse, just point at `jobService`/`applicationService` equivalents
- Candidate dashboard (my applications, edit profile)
- Admin screens (not usually needed on mobile)

Each of these follows the same pattern already set up here (a `*Service.ts`
file + a screen that calls it), so they're straightforward to add once you
confirm priority.
