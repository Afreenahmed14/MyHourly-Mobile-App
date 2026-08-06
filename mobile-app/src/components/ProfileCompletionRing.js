import { View, StyleSheet } from 'react-native';
import { Text, Avatar } from 'react-native-paper';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '../theme/theme';

/**
 * Wraps a candidate's avatar in an SVG progress ring representing how
 * complete their profile is (0-100). A small badge on the ring shows the
 * percentage so it reads at a glance on the Home screen.
 *
 * size       - outer diameter of the ring in px (avatar sits inside it)
 * strokeWidth- thickness of the ring track
 * percent    - 0-100 completion value
 */
export default function ProfileCompletionRing({
  uri,
  size = 96,
  strokeWidth = 6,
  percent = 0,
  fallbackSource,
}) {
  const clamped = Math.max(0, Math.min(100, Math.round(percent)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);
  const avatarSize = size - strokeWidth * 2 - 4;

  const ringColor =
    clamped >= 80 ? colors.success : clamped >= 40 ? colors.secondary : colors.error;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        {/* Track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.border}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          fill="none"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>

      <View style={[styles.avatarWrap, { width: size, height: size }]}>
        <Avatar.Image
          size={avatarSize}
          source={uri ? { uri } : fallbackSource}
        />
      </View>

      <View style={[styles.badge, { backgroundColor: ringColor, bottom: -2, right: -2 }]}>
        <Text style={styles.badgeText}>{clamped}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});
