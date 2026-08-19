import { useEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Badge, Avatar } from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/useAuth';
import { useNotifications } from '../context/useNotifications';
import { resolveImageUrl } from '../constants/config';
import AnimatedPressable from './AnimatedPressable';
import { colors, spacing } from '../theme/theme';

/**
 * Global top navbar shown above every main tab screen.
 * Left: app logo/wordmark. Right: chat, notification bell, and profile
 * avatar. History now lives in the bottom tab bar.
 * Never shows a page/screen title — that's what the bottom tab icons
 * and per-screen back headers (for deeper, pushed screens) are for.
 */
export default function AppHeader() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const [photoFailed, setPhotoFailed] = useState(false);

  const photo = resolveImageUrl(user?.avatarImage || user?.profileImage || user?.logo);
  const initial = (user?.companyName || user?.name || '?').trim().charAt(0).toUpperCase();

  // A quick "kick" animation on the bell whenever the unread count rises,
  // so a new notification actually feels like it just landed.
  const bellScale = useSharedValue(1);
  useEffect(() => {
    if (unreadCount > 0) {
      bellScale.value = withSequence(
        withTiming(1.25, { duration: 150 }),
        withTiming(1, { duration: 200 }),
      );
    }
  }, [unreadCount, bellScale]);
  const bellStyle = useAnimatedStyle(() => ({ transform: [{ scale: bellScale.value }] }));

  // AppHeader renders as a sibling of <Tab.Navigator> (not a screen inside
  // it), so its `navigation` object belongs to the outer root Stack (whose
  // only routes are "App"/"Auth") — it has no direct knowledge of tab
  // names like "ProfileTab". Reaching into the nested tab navigator
  // requires the { screen } nested-navigation form rather than a bare
  // navigate('ProfileTab'), or React Navigation can't resolve the route.
  const goToTab = (screen) => navigation.navigate('App', { screen });

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + spacing.sm }]}>
      {/* Left: logo */}
      <AnimatedPressable
        style={styles.logoRow}
        onPress={() => goToTab('HomeTab')}
        hitSlop={8}
        scaleTo={0.94}
      >
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logoImg}
          resizeMode="contain"
        />
      </AnimatedPressable>

      {/* Right: chat + notifications + profile */}
      <View style={styles.rightRow}>
        <AnimatedPressable
          style={styles.iconBtn}
          onPress={() => goToTab('ChatTab')}
          hitSlop={8}
        >
          <MaterialCommunityIcons name="chat-outline" size={24} color={colors.text} />
        </AnimatedPressable>

        <AnimatedPressable
          style={styles.iconBtn}
          onPress={() => goToTab('NotificationsTab')}
          hitSlop={8}
        >
          <Animated.View style={bellStyle}>
            <MaterialCommunityIcons name="bell-outline" size={24} color={colors.text} />
          </Animated.View>
          {unreadCount > 0 && (
            <Badge size={16} style={styles.badge}>{unreadCount}</Badge>
          )}
        </AnimatedPressable>

        <AnimatedPressable
          onPress={() => goToTab('ProfileTab')}
          hitSlop={8}
          scaleTo={0.9}
        >
          {photo && !photoFailed ? (
            <Image
              source={{ uri: photo }}
              style={styles.avatarImage}
              onError={() => setPhotoFailed(true)}
            />
          ) : (
            <Avatar.Text size={34} label={initial} style={styles.avatarFallback} labelStyle={styles.avatarFallbackLabel} />
          )}
        </AnimatedPressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  logoImg: { width: 140, height: 32 },
  rightRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  iconBtn: { padding: 2 },
  badge: { position: 'absolute', top: -4, right: -6, backgroundColor: colors.error },
  avatarFallback: { backgroundColor: colors.primary },
  avatarFallbackLabel: { color: '#fff', fontWeight: '700' },
  avatarImage: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.border },
});
