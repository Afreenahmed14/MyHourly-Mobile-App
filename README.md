# MyHourly — Edit Profile & View Profile (React Native / Expo)

A React Native (Expo) app recreating the **Overview**, **Edit Profile**, and public **View Profile**
screens from the MyHourly candidate dashboard (`e-commerce-h52b.vercel.app`).

Data is currently **mocked / local only** (kept in React Context, `src/context/ProfileContext.js`) —
there's no network call yet. Saving on the Edit screen updates the shared context, and the View
Profile screen reflects those changes immediately, simulating a save-and-view flow.

## Screens

- **Overview / Dashboard** — stats cards (charges/hour, rating, visibility, verification), profile
  completeness alert, and quick links to Edit / View Profile / Browse Engineers.
- **Edit Profile** — full form: name, headline, phone, about, charge per hour, experience,
  availability, developer type, primary/secondary skills, languages, portfolio links, GitHub/LinkedIn
  URLs, country, remote toggle, and visibility. Includes basic required-field validation.
- **View Profile** — the public-facing profile card: avatar, name, star rating, hourly rate, about,
  skills, and reviews. Shows your own profile by default, or a browsed engineer's profile when
  opened from Browse Engineers.
- **Browse Engineers** — search by name, filter by developer type, sort (name/rate/rating), paginated
  engineer cards with skills, rate, availability badge, and an "Unlock contact with a subscription"
  banner, matching the web page. Tapping **View Profile** while logged out shows a **Login required**
  modal (matching the web app) instead of the profile.
- **Login / Sign Up flow** — "Login required" modal → choose *I'm an Engineer* / *I'm a Company* →
  role-specific login form (or switch to Sign Up, which has the same Engineer/Company toggle). Auth
  state is mocked in `AuthContext` (`isLoggedIn`, `role`) — logging in unlocks viewing other
  engineers' profiles, and the Dashboard shows current login status with a log out option.

## Getting started

```bash
npm install
npx expo start
```

Then:
- Press `i` for iOS simulator, `a` for Android emulator, or scan the QR code with the
  **Expo Go** app on your phone.

## Project structure

```
MyHourlyApp/
├── App.js                          # navigation + provider setup
├── src/
│   ├── theme.js                     # colors, spacing, radius tokens
│   ├── context/ProfileContext.js    # mock profile state (swap for real API later)
│   ├── context/AuthContext.js       # mock login state (isLoggedIn, role)
│   ├── data/options.js              # dropdown/multi-select option lists
│   ├── data/engineers.js            # mock engineer directory for Browse Engineers
│   ├── components/
│   │   ├── Card.js
│   │   ├── ChipSelector.js          # multi-select "chip" picker (skills/languages)
│   │   └── EngineerCard.js          # engineer listing card (Browse Engineers)
│   ├── screens/
│   │   ├── DashboardScreen.js
│   │   ├── EditProfileScreen.js     # includes real camera/photo-library/resume pickers
│   │   ├── ViewProfileScreen.js
│   │   ├── BrowseEngineersScreen.js
│   │   ├── LoginRoleScreen.js       # "How would you like to log in?"
│   │   ├── LoginFormScreen.js       # Engineer/Company login (role via route param)
│   │   └── RegisterScreen.js        # sign-up with Engineer/Company toggle
│   └── styles/                      # every component/screen's styles live here, one file each
│       ├── Card.styles.js
│       ├── ChipSelector.styles.js
│       ├── EngineerCard.styles.js
│       ├── DashboardScreen.styles.js
│       ├── EditProfileScreen.styles.js
│       ├── ViewProfileScreen.styles.js
│       ├── BrowseEngineersScreen.styles.js
│       └── Auth.styles.js           # shared by Login/Register/Login-required modal
```

Each screen/component imports its styles with `import styles from '../styles/X.styles'` instead of
defining `StyleSheet.create` inline — keeps layout/markup and visual styling in separate files.

## Photo & Resume

The Edit Profile screen now has real, working pickers (not just UI):

- **Change Photo** — opens the device photo library (`expo-image-picker`)
- **Take Photo** — opens the camera (`expo-image-picker`)
- **Upload Resume** — opens a file picker restricted to PDF/DOC/DOCX (`expo-document-picker`)

The chosen image/file is stored in `ProfileContext` (`photoUri`, `resumeName`, `resumeUri`) and
shown live on both Edit Profile and View Profile. A red **Required** label appears next to the
resume button until a file is selected, matching the web version.

On first use, the OS will prompt for camera/photo-library permission — the request text is
configured in `app.json`.

## Wiring up the real backend later

Everything currently reads/writes through `useProfile()` from `ProfileContext.js`. To connect it
to the live MyHourly API:

1. Replace `initialProfile` with a `fetch()` call (e.g. `GET /api/candidate/profile`) inside a
   `useEffect` on app load.
2. In `EditProfileScreen.js`, replace the `updateProfile(form)` call in `handleSave` with a
   `PUT`/`PATCH` request to your profile endpoint, then update context with the response.
3. Add an auth token (e.g. via `expo-secure-store`) and attach it to requests.

No other screen code needs to change — they all just read from `useProfile()`.
