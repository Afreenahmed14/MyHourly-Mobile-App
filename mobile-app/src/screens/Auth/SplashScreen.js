import { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors, spacing } from '../../theme/theme';

/**
 * App boot screen. The logo fades and scales gently into place, the
 * wordmark follows a beat later, and three loading dots pulse in a
 * wave underneath — a simple, clean branded moment since this is the
 * very first thing every user sees.
 */
export default function SplashScreen() {
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.9);
  const textOpacity = useSharedValue(0);
  const textY = useSharedValue(10);
  const dot1 = useSharedValue(0.3);
  const dot2 = useSharedValue(0.3);
  const dot3 = useSharedValue(0.3);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 420, easing: Easing.out(Easing.ease) });
    logoScale.value = withTiming(1, { duration: 420, easing: Easing.out(Easing.back(1.2)) });

    textOpacity.value = withDelay(280, withTiming(1, { duration: 400 }));
    textY.value = withDelay(280, withTiming(0, { duration: 400, easing: Easing.out(Easing.ease) }));

    const wave = (sv, delay) => {
      sv.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 350, easing: Easing.inOut(Easing.ease) }),
            withTiming(0.3, { duration: 350, easing: Easing.inOut(Easing.ease) }),
          ),
          -1,
          false,
        ),
      );
    };
    wave(dot1, 500);
    wave(dot2, 650);
    wave(dot3, 800);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));
  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textY.value }],
  }));
  const dot1Style = useAnimatedStyle(() => ({ opacity: dot1.value }));
  const dot2Style = useAnimatedStyle(() => ({ opacity: dot2.value }));
  const dot3Style = useAnimatedStyle(() => ({ opacity: dot3.value }));

  return (
    <View style={styles.container}>
      {/* Logo sits in its own absolutely-centered layer, independent
          of the tagline/dots stacked below it. */}
      <View style={styles.logoLayer}>
        <Animated.View style={logoStyle}>
          <Image source={require('../../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        </Animated.View>
      </View>

      <View style={styles.belowCenter}>
        <Animated.View style={textStyle}>
          <Text variant="bodyMedium" style={styles.tagline}>Find your next hourly gig</Text>
        </Animated.View>
        <View style={styles.dotsRow}>
          <Animated.View style={[styles.dot, dot1Style]} />
          <Animated.View style={[styles.dot, dot2Style]} />
          <Animated.View style={[styles.dot, dot3Style]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  logoLayer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: { width: 200, height: 60 },
  belowCenter: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    marginTop: spacing.xl + 30, // clears the centered logo mark
  },
  tagline: { color: colors.textMuted, marginTop: spacing.sm },
  dotsRow: { flexDirection: 'row', gap: 8, marginTop: spacing.xl },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
});
