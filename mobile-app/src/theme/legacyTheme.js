// Exact color/spacing/radius tokens from the MyHourly reference app's
// src/theme.js — kept separate from theme.js (the app-wide HourlyRecruit
// theme) so Browse Engineers / Browse Jobs / Bookmarks / Hired Candidates
// can render with the reference app's original look without touching the
// palette used by the rest of the app.
export const legacyColors = {
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  accent: '#F59E0B',
  background: '#F3F6FB',
  white: '#FFFFFF',
  text: '#111827',
  textMuted: '#6B7280',
  border: '#E5E7EB',
  success: '#16A34A',
  danger: '#DC2626',
  star: '#F59E0B',
};

export const legacySpacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const legacyRadius = { sm: 8, md: 12, lg: 16, full: 999 };
