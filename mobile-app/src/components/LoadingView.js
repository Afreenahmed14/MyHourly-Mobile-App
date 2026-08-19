import { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../theme/theme';

/**
 * Branded loading state — a gently pulsing logo mark instead of a bare
 * spinner, shown whenever a screen is waiting on its first fetch.
 * Kept lightweight (opacity + scale only) so it's cheap on low-end
 * Android devices.
 *
 * Pass `animated={false}` to show a static, perfectly centered logo
 * with no pulse/shake motion (used on the Jobs and Partners/Freelancers
 * screens).
 */
export default function LoadingView({ animated = true }) {
  const pulse = useSharedValue(0.85);

  useEffect(() => {
    if (!animated) return;
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 650, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.85, { duration: 650, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, [animated, pulse]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: animated ? pulse.value : 1 }],
    opacity: animated ? pulse.value : 1,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={style}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  logo: { width: 140, height: 48 },
});
