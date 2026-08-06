import { View, StyleSheet, FlatList } from 'react-native';
import { Text, IconButton, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNotifications } from '../../context/useNotifications';
import EmptyState from '../../components/EmptyState';
import { colors, spacing, radius } from '../../theme/theme';

const TYPE_ICON = { info: 'information-outline', warning: 'alert-outline', review: 'star-outline' };

function timeAgo(date) {
  const diffMs = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationsScreen() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotifications();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleMedium" style={styles.headerTitle}>
          Notifications {unreadCount > 0 ? `(${unreadCount} new)` : ''}
        </Text>
        {unreadCount > 0 && <Button mode="text" compact onPress={markAllAsRead}>Mark all read</Button>}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: spacing.lg, paddingTop: 0 }}
        ListEmptyComponent={<EmptyState icon="bell-outline" title="No notifications yet" />}
        renderItem={({ item }) => (
          <View style={[styles.card, !item.isRead && styles.unreadCard]} onTouchEnd={() => !item.isRead && markAsRead(item._id)}>
            <MaterialCommunityIcons name={TYPE_ICON[item.type] || 'bell-outline'} size={22} color={colors.primary} />
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <Text variant="titleSmall" style={styles.title}>{item.title}</Text>
              <Text variant="bodySmall" style={styles.message}>{item.message}</Text>
              <Text variant="bodySmall" style={styles.time}>{timeAgo(item.createdAt)}</Text>
            </View>
            <IconButton icon="close" size={16} onPress={() => removeNotification(item._id)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.lg },
  headerTitle: { color: colors.text, fontWeight: '700' },
  card: {
    flexDirection: 'row', alignItems: 'flex-start', backgroundColor: colors.surface, borderRadius: radius.md,
    padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border,
  },
  unreadCard: { borderColor: colors.primary, backgroundColor: '#EEF2FF' },
  title: { color: colors.text, fontWeight: '600' },
  message: { color: colors.textMuted, marginTop: 2 },
  time: { color: colors.textMuted, marginTop: spacing.xs, fontSize: 11 },
});
