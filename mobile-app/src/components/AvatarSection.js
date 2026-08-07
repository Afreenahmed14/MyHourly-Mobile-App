import { View, StyleSheet, Image } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, radius } from '../theme/theme';

/**
 * Optional Bitmoji-style avatar section — separate from the required
 * profile photo. This image is what shows up on the candidate home
 * page, not on the profile itself.
 */
export default function AvatarSection({ avatarUri, onBuild, onRemove }) {
  return (
    <View style={styles.row}>
      <View style={styles.bubble}>
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.bubbleImg} />
        ) : (
          <MaterialCommunityIcons name="emoticon-outline" size={28} color={colors.textMuted} />
        )}
      </View>
      <View style={styles.textCol}>
        <Text variant="labelLarge" style={styles.title}>Home page avatar</Text>
        <Text variant="bodySmall" style={styles.subtitle}>Optional — shown on your candidate home page</Text>
      </View>
      <View style={styles.actions}>
        <Button mode="outlined" compact onPress={onBuild} style={styles.buildBtn}>
          {avatarUri ? 'Edit' : 'Build'}
        </Button>
        {avatarUri && (
          <Button mode="text" compact onPress={onRemove} textColor={colors.textMuted}>
            Remove
          </Button>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.border,
    padding: spacing.md, marginBottom: spacing.lg, gap: spacing.md,
  },
  bubble: {
    width: 52, height: 52, borderRadius: 26, overflow: 'hidden',
    backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.border,
  },
  bubbleImg: { width: '100%', height: '100%' },
  textCol: { flex: 1 },
  title: { color: colors.text, fontWeight: '700' },
  subtitle: { color: colors.textMuted },
  actions: { alignItems: 'flex-end' },
  buildBtn: {},
});
