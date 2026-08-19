import { View, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { SvgUri } from 'react-native-svg';
import { colors, spacing, radius } from '../theme/theme';

// Illustrated, cartoon-style avatar presets rendered via DiceBear's free
// open-source avatar API (https://www.dicebear.com — MIT/CC0 licensed
// art, not tied to any real person or copyrighted character). Each seed
// just deterministically picks a distinct-looking illustrated character.
//
// SVG, not PNG: DiceBear's free API rate-limits raster formats (PNG/JPG/
// WebP/AVIF) to 10 req/s but allows 50 req/s for SVG. This grid fires off
// 16 requests at once, which used to blow through the raster limit and
// show broken-image icons for whichever avatars got 429'd. SVG also
// renders sharper at any bubble size since it isn't capped at 256x256.
const AVATAR_SEEDS = [
  'Buddy', 'Milo', 'Luna', 'Nova', 'Zoe', 'Kai',
  'Sasha', 'Leo', 'Maya', 'Finn', 'Ruby', 'Oscar',
  'Ivy', 'Theo', 'Nina', 'Max',
];

const avatarUrl = (seed) =>
  `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(seed)}&backgroundType=gradientLinear`;

/**
 * Grid of illustrated avatar presets the user can pick instead of
 * uploading a real photo. Purely presentational — the caller decides
 * what to do with the chosen image URL (usually save it as
 * profileImage/logo via the profile update API).
 */
export default function AvatarPickerModal({ visible, onClose, onSelect }) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text variant="titleMedium" style={styles.title}>Choose an avatar</Text>
            <IconButton icon="close" onPress={onClose} />
          </View>
          <Text variant="bodySmall" style={styles.subtitle}>
            Pick an illustrated avatar instead of uploading a photo.
          </Text>
          <ScrollView contentContainerStyle={styles.grid}>
            {AVATAR_SEEDS.map((seed) => (
              <Pressable
                key={seed}
                style={styles.avatarWrap}
                onPress={() => {
                  onSelect(avatarUrl(seed));
                  onClose();
                }}
              >
                <Image source={{ uri: avatarUrl(seed) }} style={styles.avatarImg} />
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(15,23,42,0.5)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    maxHeight: '75%',
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { color: colors.text, fontWeight: '700' },
  subtitle: { color: colors.textMuted, marginBottom: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, justifyContent: 'center', paddingBottom: spacing.md },
  avatarWrap: {
    width: 72, height: 72, borderRadius: 36, overflow: 'hidden',
    borderWidth: 2, borderColor: colors.border, backgroundColor: colors.background,
  },
  avatarImg: { width: '100%', height: '100%' },
});
