import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing } from '../../theme/theme';

/**
 * Placeholder landing screen for the Chat tab, reachable from the top
 * navbar's chat icon (see AppHeader.js). The real messaging feature
 * (conversations list, threads, sending) is a separate build — this
 * keeps the nav entry point in place so it can be wired up next without
 * any navigation/route changes.
 */
export default function ChatListScreen() {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="chat-outline" size={56} color={colors.textMuted} />
      <Text variant="titleMedium" style={styles.title}>Chat is coming soon</Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        You'll be able to message companies and candidates directly here.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, backgroundColor: colors.background },
  title: { color: colors.text, marginTop: spacing.md, fontWeight: '700' },
  subtitle: { color: colors.textMuted, marginTop: spacing.xs, textAlign: 'center' },
});
