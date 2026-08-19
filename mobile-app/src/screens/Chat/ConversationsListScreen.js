import { useCallback, useState } from 'react';
import { View, StyleSheet, FlatList, Image } from 'react-native';
import { Text, Badge } from 'react-native-paper';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';
import { chatApi } from '../../api/chatApi';
import EmptyState from '../../components/EmptyState';
import LoadingView from '../../components/LoadingView';
import AnimatedPressable from '../../components/AnimatedPressable';
import { resolveImageUrl } from '../../constants/config';
import { colors, spacing, radius, shadows } from '../../theme/theme';

function Avatar({ uri, fallback }) {
  const [failed, setFailed] = useState(false);
  const resolved = resolveImageUrl(uri);
  if (resolved && !failed) {
    return <Image source={{ uri: resolved }} style={styles.avatarImage} onError={() => setFailed(true)} />;
  }
  return (
    <View style={styles.avatarFallback}>
      <Text style={styles.avatarFallbackText}>{(fallback || '?').charAt(0).toUpperCase()}</Text>
    </View>
  );
}

function timeAgo(date) {
  if (!date) return '';
  const diffMs = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

/**
 * List of chat threads for the current account (Chat tab). Only shows
 * threads that already exist — new threads are started from a hired
 * candidate's / company's profile via the "Message" action, since chat
 * is gated to accounts with an existing hire relationship.
 */
export default function ConversationsListScreen({ navigation }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await chatApi.getConversations();
      setConversations(res.data.data.conversations || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  if (loading) return <LoadingView />;

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.listContent}
      data={conversations}
      keyExtractor={(item) => item._id}
      ListEmptyComponent={
        <EmptyState
          icon="chat-outline"
          title="No conversations yet"
          subtitle="Once you hire someone (or get hired), a Message button appears on their profile."
        />
      }
      renderItem={({ item, index }) => (
        <Animated.View entering={FadeInUp.delay(Math.min(index, 10) * 55).springify().damping(16)}>
        <AnimatedPressable
          style={styles.row}
          scaleTo={0.98}
          onPress={() => navigation.navigate('ChatThread', {
            conversationId: item._id,
            otherName: item.other?.name,
            otherAvatar: item.other?.avatar,
          })}
        >
          <Avatar uri={item.other?.avatar} fallback={item.other?.name} />
          <View style={styles.rowContent}>
            <View style={styles.rowTop}>
              <Text variant="titleSmall" style={styles.name} numberOfLines={1}>{item.other?.name || 'Unknown'}</Text>
              <Text variant="bodySmall" style={styles.time}>{timeAgo(item.lastMessage?.createdAt)}</Text>
            </View>
            <View style={styles.rowBottom}>
              <Text
                variant="bodySmall"
                style={[styles.preview, item.unreadCount > 0 && styles.previewUnread]}
                numberOfLines={1}
              >
                {item.lastMessage?.text || 'Say hello 👋'}
              </Text>
              {item.unreadCount > 0 && <Badge size={20} style={styles.badge}>{item.unreadCount}</Badge>}
            </View>
          </View>
        </AnimatedPressable>
        </Animated.View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  listContent: { paddingVertical: spacing.sm },
  row: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  rowContent: { flex: 1, marginLeft: spacing.sm },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { color: colors.text, fontWeight: '700', flex: 1, marginRight: spacing.sm },
  time: { color: colors.textMuted, fontSize: 11 },
  rowBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 },
  preview: { color: colors.textMuted, flex: 1, marginRight: spacing.sm },
  previewUnread: { color: colors.text, fontWeight: '600' },
  badge: { backgroundColor: colors.primary },
  avatarImage: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.border },
  avatarFallback: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarFallbackText: { color: '#fff', fontWeight: '700', fontSize: 18 },
});
