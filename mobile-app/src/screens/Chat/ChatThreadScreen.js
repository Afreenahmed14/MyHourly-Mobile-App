import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, Image,
} from 'react-native';
import { Text, TextInput, IconButton, ActivityIndicator } from 'react-native-paper';
import Animated, { FadeInUp, ZoomIn, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';
import { chatApi } from '../../api/chatApi';
import { useAuth } from '../../context/useAuth';
import { resolveImageUrl } from '../../constants/config';
import { colors, spacing, radius } from '../../theme/theme';

const POLL_INTERVAL_MS = 8 * 1000;

function timeLabel(date) {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * One-on-one message thread. Polls for new messages while focused —
 * simple and reliable without adding a socket server; matches the same
 * polling pattern already used for notifications in this app.
 */
export default function ChatThreadScreen({ route, navigation }) {
  const { conversationId, otherName, otherAvatar } = route.params;
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [text, setText] = useState('');
  const listRef = useRef(null);
  const sendScale = useSharedValue(1);
  const sendAnimStyle = useAnimatedStyle(() => ({ transform: [{ scale: sendScale.value }] }));

  useLayoutEffect(() => {
    navigation.setOptions({ title: otherName || 'Chat' });
  }, [navigation, otherName]);

  const load = useCallback(async () => {
    try {
      const res = await chatApi.getMessages(conversationId);
      setMessages(res.data.data.messages || []);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useFocusEffect(useCallback(() => {
    load();
    const interval = setInterval(load, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [load]));

  useEffect(() => {
    if (messages.length) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
    }
  }, [messages.length]);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    sendScale.value = withSequence(
      withTiming(0.8, { duration: 90 }),
      withTiming(1, { duration: 150 }),
    );
    setSending(true);
    setText('');
    try {
      const res = await chatApi.sendMessage(conversationId, trimmed);
      setMessages((prev) => [...prev, res.data.data.message]);
    } catch {
      setText(trimmed); // restore on failure so the user doesn't lose what they typed
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            {!!otherAvatar && (
              <Animated.View entering={ZoomIn.springify().damping(12)}>
                <Image source={{ uri: resolveImageUrl(otherAvatar) }} style={styles.emptyAvatar} />
              </Animated.View>
            )}
            <Animated.View entering={FadeInUp.delay(100).duration(400)}>
              <Text style={styles.emptyText}>
                Say hello to {otherName || 'them'} 👋
              </Text>
            </Animated.View>
          </View>
        }
        renderItem={({ item }) => {
          const isMine = String(item.senderId) === String(user?._id);
          return (
            <Animated.View
              entering={FadeInUp.duration(280).springify().damping(18)}
              style={[styles.bubbleRow, isMine ? styles.bubbleRowMine : styles.bubbleRowTheirs]}
            >
              <View style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleTheirs]}>
                <Text style={[styles.bubbleText, isMine && styles.bubbleTextMine]}>{item.text}</Text>
              </View>
              <Text style={styles.bubbleTime}>{timeLabel(item.createdAt)}</Text>
            </Animated.View>
          );
        }}
      />

      <View style={styles.composer}>
        <TextInput
          mode="outlined"
          style={styles.input}
          placeholder="Type a message..."
          value={text}
          onChangeText={setText}
          multiline
          maxLength={4000}
          dense
        />
        <Animated.View style={sendAnimStyle}>
          <IconButton
            icon="send"
            mode="contained"
            size={22}
            disabled={!text.trim() || sending}
            onPress={handleSend}
            containerColor={colors.primary}
            iconColor="#fff"
          />
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  listContent: { padding: spacing.md, flexGrow: 1 },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: spacing.xxl },
  emptyAvatar: { width: 64, height: 64, borderRadius: 32, marginBottom: spacing.md, backgroundColor: colors.border },
  emptyText: { color: colors.textMuted, fontWeight: '600' },
  bubbleRow: { marginBottom: spacing.sm, maxWidth: '80%' },
  bubbleRowMine: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  bubbleRowTheirs: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  bubble: { borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  bubbleMine: { backgroundColor: colors.primary, borderBottomRightRadius: 4 },
  bubbleTheirs: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderBottomLeftRadius: 4 },
  bubbleText: { color: colors.text },
  bubbleTextMine: { color: '#fff' },
  bubbleTime: { color: colors.textMuted, fontSize: 10, marginTop: 2, marginHorizontal: 4 },
  composer: {
    flexDirection: 'row', alignItems: 'flex-end', padding: spacing.sm,
    borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface,
  },
  input: { flex: 1, maxHeight: 120, backgroundColor: colors.surface },
});
