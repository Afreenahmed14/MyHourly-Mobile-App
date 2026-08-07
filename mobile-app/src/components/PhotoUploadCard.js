import { View, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { Text, Button, IconButton } from 'react-native-paper';
import { colors, spacing, radius } from '../theme/theme';

/**
 * Full-width photo upload card — the "real photo" flow. Deliberately
 * different from the avatar picker (which is a separate full screen
 * with a preset grid): this is an inline card with a large square
 * preview and upload/remove actions, no navigation involved.
 */
export default function PhotoUploadCard({ imageUri, uploading, onPick, onRemove }) {
  return (
    <View style={styles.card}>
      <View style={styles.previewBox}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.previewImg} />
        ) : (
          <View style={styles.placeholder}>
            <IconButton icon="account-outline" size={40} iconColor={colors.textMuted} style={styles.placeholderIcon} />
            <Text variant="bodySmall" style={styles.placeholderText}>No photo yet</Text>
          </View>
        )}
        {uploading && (
          <View style={styles.overlay}>
            <ActivityIndicator color="#fff" />
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <Button
          mode="contained"
          icon="image-plus"
          onPress={onPick}
          disabled={uploading}
          style={styles.uploadBtn}
        >
          {imageUri ? 'Replace photo' : 'Upload photo'}
        </Button>
        {imageUri && (
          <Button mode="outlined" icon="trash-can-outline" onPress={onRemove} disabled={uploading} style={styles.removeBtn}>
            Remove
          </Button>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  previewBox: {
    width: '100%',
    aspectRatio: 1.6,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.background,
    marginBottom: spacing.md,
  },
  previewImg: { width: '100%', height: '100%' },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  placeholderIcon: { margin: 0 },
  placeholderText: { color: colors.textMuted, marginTop: -spacing.xs },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15,23,42,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: { flexDirection: 'row', gap: spacing.sm },
  uploadBtn: { flex: 1 },
  removeBtn: {},
});
