import { useEffect, useState } from 'react';
import { View, StyleSheet, Image, useWindowDimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { colors, spacing, radius, shadows } from '../../theme/theme';

// Timeline constants (ms) — kept named so the sequence below reads as
// a script rather than a pile of magic numbers.
const FLY_IN_DURATION = 850; // helicopter flies in alone, left edge to center
const DROP_DURATION = 300; // logo is lowered on the two ropes and set down
const ROPE_FADE_DURATION = 160; // ropes release once the logo has landed
const FLY_OUT_DELAY = 150; // brief beat after drop-off before the helicopter peels away
const FLY_OUT_DURATION = 750; // helicopter continues on to the right and exits
const HOLD_DURATION = 500; // pause on the landed logo + "You're in!" text
const ZOOM_DURATION = 650; // logo scales up to fill the screen
const ZOOM_FADE_DURATION = 220; // logo/screen fades out during the final part of the zoom

/**
 * Shown for a beat right after a successful login/registration, before
 * RootNavigator swaps in the main app.
 *
 * Sequence:
 *  1. A big helicopter flies in ALONE from the left edge to center.
 *  2. Once it's in position, it lowers the logo down on two ropes and
 *     sets it down.
 *  3. The ropes release and the helicopter flies on off the right edge.
 *  4. The logo holds for a moment ("You're in!"), then zooms up to
 *     fill the whole screen.
 *  5. Once the zoom fades out, onFinish() fires and RootNavigator
 *     reveals the home screen underneath.
 */
export default function WelcomeTransitionScreen({ onFinish }) {
  const { width } = useWindowDimensions();
  const [showHeli, setShowHeli] = useState(true);
  const [showRopes, setShowRopes] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [landed, setLanded] = useState(false);

  const heliStartX = -(width / 2 + 110);
  const heliEndX = width / 2 + 150;

  const heliX = useSharedValue(heliStartX);
  const heliLift = useSharedValue(0);
  const bob = useSharedValue(0);
  const rotorSpin = useSharedValue(0);

  // The logo stays horizontally centered the whole time — it only
  // exists once the helicopter has already arrived, so it never
  // travels (or races) alongside the helicopter.
  //
  // Vertical coordinate system: all Y values are offsets from the
  // stage's vertical center. heliBaseY is the top of the helicopter
  // icon; the rope attaches a bit below that (roughly at the belly,
  // not the rotor) and hangs down to the logo's TOP edge — keeping
  // helicopter, rope, and logo stacked in that order instead of
  // overlapping each other.
  const heliBaseY = -140;
  const ropeAttachY = heliBaseY + 50; // where the ropes leave the helicopter's belly
  const logoHalfHeight = 50; // half of logoStage's 100px height
  const logoCarryY = ropeAttachY + 10 + logoHalfHeight; // short tether while flying
  const logoRestY = 0; // landed, centered on screen
  const logoY = useSharedValue(logoCarryY);
  const ropesOpacity = useSharedValue(0);
  const padOpacity = useSharedValue(0);

  const logoScale = useSharedValue(1);
  const logoOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(1);

  const textOpacity = useSharedValue(0);
  const textY = useSharedValue(8);
  const dot1 = useSharedValue(0.3);
  const dot2 = useSharedValue(0.3);
  const dot3 = useSharedValue(0.3);

  useEffect(() => {
    // Phase 1 — the helicopter flies in alone.
    heliX.value = withTiming(0, { duration: FLY_IN_DURATION, easing: Easing.out(Easing.cubic) }, (finished) => {
      if (finished) runOnJS(startLaunch)();
    });

    bob.value = withRepeat(
      withSequence(withTiming(1.5, { duration: 220 }), withTiming(-1.5, { duration: 220 })),
      Math.round((FLY_IN_DURATION + FLY_OUT_DELAY + FLY_OUT_DURATION) / 440),
      true,
    );
    rotorSpin.value = withRepeat(
      withSequence(withTiming(-2, { duration: 130 }), withTiming(2, { duration: 130 })),
      Math.round((FLY_IN_DURATION + FLY_OUT_DELAY + FLY_OUT_DURATION) / 260),
      true,
    );
  }, []);

  // Phase 2 — helicopter has arrived: bring the logo in on two ropes
  // and lower it down to the center of the screen.
  const startLaunch = () => {
    setShowRopes(true);
    setShowLogo(true);
    logoOpacity.value = withTiming(1, { duration: 120 });
    ropesOpacity.value = withTiming(1, { duration: 120 });

    logoY.value = withDelay(
      120,
      withTiming(logoRestY, { duration: DROP_DURATION, easing: Easing.out(Easing.back(1.5)) }, (finished) => {
        if (finished) runOnJS(handleLanded)();
      }),
    );

    // Phase 3 — ropes release, helicopter flies on to the right.
    heliX.value = withDelay(
      120 + DROP_DURATION + FLY_OUT_DELAY,
      withTiming(heliEndX, { duration: FLY_OUT_DURATION, easing: Easing.in(Easing.cubic) }, (finished) => {
        if (finished) runOnJS(setShowHeli)(false);
      }),
    );
    heliLift.value = withDelay(
      120 + DROP_DURATION + FLY_OUT_DELAY,
      withTiming(-30, { duration: FLY_OUT_DURATION, easing: Easing.in(Easing.cubic) }),
    );
  };

  const handleLanded = () => {
    setLanded(true);
    padOpacity.value = withTiming(1, { duration: 180 });
    ropesOpacity.value = withDelay(ROPE_FADE_DURATION, withTiming(0, { duration: 180 }, (finished) => {
      if (finished) runOnJS(setShowRopes)(false);
    }));

    textOpacity.value = withDelay(140, withTiming(1, { duration: 320 }));
    textY.value = withDelay(140, withTiming(0, { duration: 320, easing: Easing.out(Easing.ease) }));

    const wave = (sv, delay) => {
      sv.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 300, easing: Easing.inOut(Easing.ease) }),
            withTiming(0.3, { duration: 300, easing: Easing.inOut(Easing.ease) }),
          ),
          -1,
          false,
        ),
      );
    };
    wave(dot1, 260);
    wave(dot2, 380);
    wave(dot3, 500);

    // Hold on the landed logo, then zoom it up to fill the screen and
    // hand off to the home screen.
    const zoomAt = HOLD_DURATION;
    contentOpacity.value = withDelay(Math.max(zoomAt - 160, 0), withTiming(0, { duration: 160 }));
    logoScale.value = withDelay(
      zoomAt,
      withTiming(18, { duration: ZOOM_DURATION, easing: Easing.in(Easing.cubic) }),
    );
    logoOpacity.value = withDelay(
      zoomAt + (ZOOM_DURATION - ZOOM_FADE_DURATION),
      withTiming(0, { duration: ZOOM_FADE_DURATION }, (finished) => {
        if (finished) runOnJS(onFinish)();
      }),
    );
  };

  const heliStyle = useAnimatedStyle(() => ({
    opacity: showHeli ? 1 : 0,
    transform: [
      { translateX: heliX.value },
      { translateY: heliBaseY + heliLift.value + bob.value },
      { rotate: `${rotorSpin.value}deg` },
    ],
  }));

  // Two ropes, offset left/right of center. They start below the
  // helicopter's belly (not its rotor) and always stretch down to
  // meet the logo's top edge, so the stacking always reads as
  // helicopter → ropes → logo, never overlapping out of order.
  const ropeLeftStyle = useAnimatedStyle(() => ({
    opacity: ropesOpacity.value,
    transform: [{ translateX: -16 }, { translateY: ropeAttachY + bob.value * 0.2 }],
    height: Math.max(logoY.value - logoHalfHeight - ropeAttachY, 4),
  }));
  const ropeRightStyle = useAnimatedStyle(() => ({
    opacity: ropesOpacity.value,
    transform: [{ translateX: 16 }, { translateY: ropeAttachY + bob.value * 0.2 }],
    height: Math.max(logoY.value - logoHalfHeight - ropeAttachY, 4),
  }));

  const padStyle = useAnimatedStyle(() => ({
    opacity: padOpacity.value * contentOpacity.value,
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ translateY: logoY.value }, { scale: logoScale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value * contentOpacity.value,
    transform: [{ translateY: textY.value }],
  }));
  const dot1Style = useAnimatedStyle(() => ({ opacity: dot1.value * contentOpacity.value }));
  const dot2Style = useAnimatedStyle(() => ({ opacity: dot2.value * contentOpacity.value }));
  const dot3Style = useAnimatedStyle(() => ({ opacity: dot3.value * contentOpacity.value }));

  return (
    <LinearGradient
      colors={[colors.primary, colors.primaryDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Animated.View entering={FadeIn.duration(200)} style={styles.stage}>
        {showHeli && (
          <Animated.View style={[styles.heli, heliStyle]} pointerEvents="none">
            <MaterialCommunityIcons name="helicopter" size={78} color="rgba(255,255,255,0.95)" />
          </Animated.View>
        )}

        {showRopes && (
          <>
            <Animated.View style={[styles.rope, ropeLeftStyle]} pointerEvents="none" />
            <Animated.View style={[styles.rope, ropeRightStyle]} pointerEvents="none" />
          </>
        )}

        <Animated.View style={[styles.landingPad, padStyle]} pointerEvents="none" />

        {showLogo && (
          <Animated.View style={[styles.logoStage, logoStyle]}>
            <View style={styles.logoBadge}>
              <Image source={require('../../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
            </View>
          </Animated.View>
        )}

        <Animated.View style={[styles.textWrap, textStyle]}>
          <Text variant="titleMedium" style={styles.title}>You&apos;re in!</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>Getting everything ready</Text>
        </Animated.View>

        {landed && (
          <View style={styles.dotsRow}>
            <Animated.View style={[styles.dot, dot1Style]} />
            <Animated.View style={[styles.dot, dot2Style]} />
            <Animated.View style={[styles.dot, dot3Style]} />
          </View>
        )}
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  stage: { flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' },
  // Stacking order (front to back): helicopter, then ropes underneath
  // it, then the logo underneath the ropes.
  heli: {
    position: 'absolute',
    top: '50%',
    alignSelf: 'center',
    zIndex: 3,
  },
  rope: {
    position: 'absolute',
    top: '50%',
    alignSelf: 'center',
    width: 2,
    backgroundColor: 'rgba(255,255,255,0.55)',
    zIndex: 2,
  },
  landingPad: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: '46%',
    height: 10,
    width: 96,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.18)',
    zIndex: 0,
  },
  logoStage: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  logoBadge: {
    width: 84,
    height: 84,
    borderRadius: radius.lg,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.raised,
  },
  logo: { width: 58, height: 58 },
  textWrap: { marginTop: spacing.xl, alignItems: 'center' },
  title: { color: '#FFFFFF', fontWeight: '700', textAlign: 'center' },
  subtitle: { color: 'rgba(255,255,255,0.85)', marginTop: spacing.xs, textAlign: 'center' },
  dotsRow: { flexDirection: 'row', gap: 8, marginTop: spacing.xl },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFFFFF' },
});
