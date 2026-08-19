import Animated, { FadeInUp } from 'react-native-reanimated';
import { StyleSheet } from 'react-native';
import { colors, spacing, radius, shadows } from '../theme/theme';

/**
 * Simple bordered section card — matches the "Photo & Resume" /
 * "Personal info" grouping style used across the edit-profile screen.
 * Fades/slides in on mount so stacked cards on a screen feel like a
 * considered sequence rather than popping in all at once.
 */
export default function Card({ children, style, animated = true, delay = 0 }) {
  if (!animated) {
    return <Animated.View style={[styles.card, style]}>{children}</Animated.View>;
  }
  return (
    <Animated.View entering={FadeInUp.delay(delay).duration(400).springify().damping(18)} style={[styles.card, style]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.card,
  },
});
