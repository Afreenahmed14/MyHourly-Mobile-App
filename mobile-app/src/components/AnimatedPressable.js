import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Pressable } from 'react-native';

/**
 * Drop-in replacement for TouchableOpacity that gives every tappable
 * surface (job cards, candidate cards, list rows, icon buttons) the
 * same subtle "press" feel: a quick scale-down + opacity dip on
 * press-in, springing back on release. One shared implementation so
 * the whole app feels consistent rather than each screen inventing
 * its own feedback.
 */
export default function AnimatedPressable({
  children,
  style,
  onPress,
  onLongPress,
  scaleTo = 0.97,
  disabled,
  hitSlop,
  ...rest
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        disabled={disabled}
        hitSlop={hitSlop}
        onPressIn={() => {
          scale.value = withSpring(scaleTo, { damping: 18, stiffness: 300 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 14, stiffness: 200 });
        }}
        style={style}
        {...rest}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
