import { MD3LightTheme } from 'react-native-paper';

// HourlyRecruit brand palette — indigo primary, warm amber accent.
// Centralized so every screen pulls from the same tokens instead of
// hardcoding colors, matching the "modern, premium" brief.
export const colors = {
  primary: '#4F46E5',
  primaryDark: '#3730A3',
  secondary: '#F59E0B',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#0F172A',
  textMuted: '#64748B',
  border: '#E2E8F0',
  success: '#16A34A',
  error: '#DC2626',
};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };

export const radius = { sm: 8, md: 14, lg: 20, pill: 999 };

// Soft, low-key elevation — used on cards/sheets so surfaces read as
// "lifted" rather than flat-bordered, without looking heavy.
export const shadows = {
  card: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  raised: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
};

export const paperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.background,
    surface: colors.surface,
    error: colors.error,
  },
  roundness: radius.md,
};
