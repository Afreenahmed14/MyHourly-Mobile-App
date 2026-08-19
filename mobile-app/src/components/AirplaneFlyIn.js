import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

/**
 * A small airplane glyph that flies in diagonally from an off-screen
 * offset and "lands" with a soft bounce at (0,0) relative to wherever
 * this is mounted. Used across the auth flow so the brand moment reads
 * as "the plane delivers the thing" rather than a plain fade-in.
 *
 * Positioning: absolutely fills nothing — parent should give this a
 * wrapping View with the desired anchor point (e.g. centered above a
 * logo badge) and this component animates from (startX, startY) to
 * (0, 0) within that anchor.
 */
export default function AirplaneFlyIn({
  size = 30,
  color = '#FFFFFF',
  startX = -180,
  startY = -90,
  delay = 0,
  duration = 850,
  showTrail = true,
  onLanded,
  style,
}) {
  const x = useSharedValue(startX);
  const y = useSharedValue(startY);
  const rotate = useSharedValue(-10);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.6);
  const trailOpacity = useSharedValue(0);

  useEffect(() => {
    const cruise = Math.round(duration * 0.75);
    const land = duration - cruise;

    opacity.value = withDelay(delay, withTiming(1, { duration: 120 }));
    trailOpacity.value = withDelay(
      delay,
      withSequence(
        withTiming(showTrail ? 0.55 : 0, { duration: cruise * 0.6 }),
        withTiming(0, { duration: cruise * 0.4 + land }),
      ),
    );
    scale.value = withDelay(delay, withTiming(1, { duration: cruise, easing: Easing.out(Easing.cubic) }));
    x.value = withDelay(delay, withTiming(0, { duration: cruise + land, easing: Easing.out(Easing.cubic) }));
    y.value = withDelay(
      delay,
      withSequence(
        withTiming(-10, { duration: cruise, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: land, easing: Easing.out(Easing.back(1.8)) }, (finished) => {
          if (finished && onLanded) runOnJS(onLanded)();
        }),
      ),
    );
    rotate.value = withDelay(
      delay,
      withSequence(
        withTiming(-6, { duration: cruise }),
        withTiming(0, { duration: land }),
      ),
    );
  }, []);

  const planeStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
  }));

  const trailStyle = useAnimatedStyle(() => ({
    opacity: trailOpacity.value,
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { rotate: `${rotate.value - 135}deg` },
    ],
  }));

  return (
    <Animated.View style={[styles.wrap, style]} pointerEvents="none">
      {showTrail && (
        <Animated.View style={[styles.trail, trailStyle, { borderColor: color }]} />
      )}
      <Animated.View style={planeStyle}>
        <MaterialCommunityIcons name="airplane" size={size} color={color} style={styles.icon} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  icon: { transform: [{ rotate: '90deg' }] },
  trail: {
    position: 'absolute',
    width: 70,
    height: 0,
    borderTopWidth: 1.5,
    borderStyle: 'dashed',
    opacity: 0,
  },
});
