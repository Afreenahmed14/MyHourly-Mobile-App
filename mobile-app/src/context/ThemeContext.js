import { createContext, useContext, useMemo, useState } from 'react';
import { colors as lightColors } from '../theme/theme';

export const ThemeContext = createContext(null);

// Dark palette kept close to the light one (same hues, inverted surfaces)
// so screens built against `colors.*` keys don't need per-screen dark-mode
// branching — only the token values change.
const darkColors = {
  ...lightColors,
  background: '#0F172A',
  surface: '#1E293B',
  text: '#F1F5F9',
  textMuted: '#94A3B8',
  border: '#334155',
};

export function AppThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const value = useMemo(
    () => ({ isDark, toggleTheme: () => setIsDark((d) => !d), colors: isDark ? darkColors : lightColors }),
    [isDark]
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useAppTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useAppTheme must be used within AppThemeProvider');
  return ctx;
};
