import { View, StyleSheet, Pressable, Image } from 'react-native';
import { Text, Badge, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/useAuth';
import { useNotifications } from '../context/useNotifications';
import { colors, spacing } from '../theme/theme';

/**
 * Global top navbar shown above every main tab screen.
 * Left: app logo/wordmark. Right: notification bell + profile avatar.
 * Never shows a page/screen title — that's what the bottom tab icons
 * and per-screen back headers (for deeper, pushed screens) are for.
 */
export default function AppHeader() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { unreadCount } = useNotifications();

  const photo = user?.profileImage || user?.logo;
  const initial = (user?.companyName || user?.name || '?').trim().charAt(0).toUpperCase();

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
      <Pressable
        style={styles.logoRow}
        onPress={() => goToTab('HomeTab')}
        hitSlop={8}
      >
        <Image source={require('../../assets/icon.png')} style={styles.logoImg} />
        <Text style={styles.logoText}>HourlyRecruit</Text>
      </Pressable>

      {/* Right: notifications + profile */}
      <View style={styles.rightRow}>
        <Pressable
          style={styles.iconBtn}
          onPress={() => goToTab('NotificationsTab')}
          hitSlop={8}
        >
          <MaterialCommunityIcons name="bell-outline" size={24} color={colors.text} />
          {unreadCount > 0 && (
            <Badge size={16} style={styles.badge}>{unreadCount}</Badge>
          )}
        </Pressable>

        <Pressable
          onPress={() => goToTab('ProfileTab')}
          hitSlop={8}
        >
          {photo ? (
            <Avatar.Image size={34} source={{ uri: photo }} />
          ) : (
            <Avatar.Text size={34} label={initial} style={styles.avatarFallback} labelStyle={styles.avatarFallbackLabel} />
          )}
        </Pressable>
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
  logoImg: { width: 28, height: 28, borderRadius: 6 },
  logoText: { fontSize: 16, fontWeight: '800', color: colors.text },
  rightRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  iconBtn: { padding: 2 },
  badge: { position: 'absolute', top: -4, right: -6, backgroundColor: colors.error },
  avatarFallback: { backgroundColor: colors.primary },
  avatarFallbackLabel: { color: '#fff', fontWeight: '700' },
});
