import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  withRepeat,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

/**
 * Wraps any content (a card, a logo badge, ...) and "flies it in" as if
 * a helicopter dropped down from above carrying it, hovered briefly,
 * then set it down. The helicopter glyph rides along above the content
 * during the descent and fades out once it lands — the whole wrapped
 * element is what's being delivered, not just an icon inside it.
 */
export default function HelicopterLaunch({
  children,
  delay = 0,
  duration = 700,
  dropFrom = -160,
  heliSize = 22,
  heliColor = 'rgba(15, 23, 42, 0.4)',
  onLanded,
  style,
}) {
  const [showHeli, setShowHeli] = useState(true);
  const contentY = useSharedValue(dropFrom);
  const contentOpacity = useSharedValue(0);
  const contentScale = useSharedValue(0.9);
  const heliY = useSharedValue(dropFrom - 34);
  const heliOpacity = useSharedValue(0);
  const rotorSpin = useSharedValue(0);
  const bob = useSharedValue(0);

  useEffect(() => {
    const descend = Math.round(duration * 0.72);
    const settle = duration - descend;

    contentOpacity.value = withDelay(delay, withTiming(1, { duration: 140 }));
    heliOpacity.value = withDelay(
      delay,
      withSequence(withTiming(1, { duration: 140 }), withTiming(1, { duration: descend - 140 }), withTiming(0, { duration: settle })),
    );

    contentScale.value = withDelay(delay, withTiming(1, { duration: descend + settle, easing: Easing.out(Easing.cubic) }));

    contentY.value = withDelay(
      delay,
      withSequence(
        withTiming(dropFrom * 0.12, { duration: descend, easing: Easing.out(Easing.cubic) }),
        withTiming(0, { duration: settle, easing: Easing.out(Easing.back(1.4)) }, (finished) => {
          if (finished) {
            if (onLanded) runOnJS(onLanded)();
            runOnJS(setShowHeli)(false);
          }
        }),
      ),
    );

    heliY.value = withDelay(delay, withTiming(-30, { duration: descend + settle, easing: Easing.out(Easing.cubic) }));

    // Rotor-driven hover jitter while it's carrying the payload down.
    bob.value = withDelay(
      delay,
      withRepeat(withSequence(withTiming(3, { duration: 110 }), withTiming(-3, { duration: 110 })), Math.round(descend / 220), true),
    );
    rotorSpin.value = withDelay(
      delay,
      withRepeat(withSequence(withTiming(-4, { duration: 80 }), withTiming(4, { duration: 80 })), Math.round((descend + settle) / 160), true),
    );
  }, []);

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentY.value }, { scale: contentScale.value }],
  }));

  const heliStyle = useAnimatedStyle(() => ({
    opacity: heliOpacity.value,
    transform: [{ translateY: heliY.value + bob.value }, { rotate: `${rotorSpin.value}deg` }],
  }));

  return (
    <Animated.View style={style}>
      {showHeli && (
        <Animated.View style={[styles.heli, heliStyle]} pointerEvents="none">
          <MaterialCommunityIcons name="helicopter" size={heliSize} color={heliColor} />
        </Animated.View>
      )}
      <Animated.View style={contentStyle}>{children}</Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  heli: {
    position: 'absolute',
    top: -28,
    alignSelf: 'center',
    zIndex: 2,
  },
});
