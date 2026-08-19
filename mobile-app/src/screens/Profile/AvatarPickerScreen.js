import { useState } from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { Text, Button, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SvgUri } from 'react-native-svg';
import { colors, spacing, radius } from '../../theme/theme';

// Illustrated, cartoon-style avatar presets rendered via DiceBear's free
// open-source avatar API (https://www.dicebear.com — MIT/CC0 licensed
// art, not tied to any real person or copyrighted character).
const STYLE_SETS = {
  Playful: {
    style: 'adventurer',
    seeds: ['Buddy', 'Milo', 'Luna', 'Nova', 'Zoe', 'Kai', 'Sasha', 'Leo'],
  },
  Minimal: {
    style: 'notionists',
    seeds: ['Maya', 'Finn', 'Ruby', 'Oscar', 'Ivy', 'Theo', 'Nina', 'Max'],
  },
  Bold: {
    style: 'bottts',
    seeds: ['Atlas', 'Comet', 'Pixel', 'Rocket', 'Sable', 'Vega', 'Wren', 'Zephyr'],
  },
};

// Grid tiles render as SVG (react-native-svg's <SvgUri>, not a plain RN
// <Image> which can't decode SVG at all). This also sidesteps DiceBear's
// free-API rate limit, which is much stricter for raster formats
// (10 req/s for PNG/JPG/WebP/AVIF) than for SVG (50 req/s) — with 8
// tiles loading per category plus the preview, PNG requests were
// getting throttled and showing up as broken images. The value we hand
// back to the caller (and persist as `avatarImage`) is still the PNG
// URL, since that's what plain <Image>/SafeAvatar elsewhere in the app
// need to render it later.
const svgUrl = (style, seed) =>
  `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(seed)}&backgroundType=gradientLinear`;

const avatarUrl = (style, seed) =>
  `https://api.dicebear.com/9.x/${style}/png?seed=${encodeURIComponent(seed)}&size=160&backgroundType=gradientLinear`;

/**
 * Full-screen avatar picker — separate stack screen (not a modal),
 * grouped into style categories with a big preview + confirm step,
 * instead of the old single scrollable grid-in-a-sheet.
 */
export default function AvatarPickerScreen({ route, navigation }) {
  const { onSelect } = route.params;
  const categories = Object.keys(STYLE_SETS);
  const [category, setCategory] = useState(categories[0]);
  const [chosenSeed, setChosenSeed] = useState(null);
  const [saving, setSaving] = useState(false);

  const { style, seeds } = STYLE_SETS[category];
  const chosen = chosenSeed ? avatarUrl(style, chosenSeed) : null;

  const confirm = async () => {
    if (!chosen) return;
    setSaving(true);
    try {
      await onSelect(chosen);
      navigation.goBack();
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.preview}>
        <View style={styles.previewRing}>
          {chosenSeed ? (
            <SvgUri uri={svgUrl(style, chosenSeed)} width="100%" height="100%" />
          ) : (
            <MaterialCommunityIcons name="account-question-outline" size={48} color={colors.textMuted} />
          )}
        </View>
        <Text variant="bodySmall" style={styles.previewHint}>
          {chosenSeed ? 'Looking good — confirm below' : 'Tap a style to preview it here'}
        </Text>
      </View>

      <View style={styles.chipRow}>
        {categories.map((c) => (
          <Chip
            key={c}
            selected={c === category}
            onPress={() => { setCategory(c); setChosenSeed(null); }}
            style={styles.chip}
            selectedColor={colors.primary}
          >
            {c}
          </Chip>
        ))}
      </View>

      <FlatList
        data={seeds}
        numColumns={3}
        keyExtractor={(seed) => seed}
        contentContainerStyle={styles.grid}
        renderItem={({ item: seed }) => {
          const selected = chosenSeed === seed;
          return (
            <Pressable style={styles.tileWrap} onPress={() => setChosenSeed(seed)}>
              <View style={[styles.tile, selected && styles.tileSelected]}>
                <SvgUri uri={svgUrl(style, seed)} width="100%" height="100%" />
              </View>
              {selected && (
                <MaterialCommunityIcons name="check-circle" size={20} color={colors.primary} style={styles.checkBadge} />
              )}
            </Pressable>
          );
        }}
      />

      <Button
        mode="contained"
        onPress={confirm}
        loading={saving}
        disabled={!chosen || saving}
        style={styles.confirmBtn}
        contentStyle={{ paddingVertical: spacing.xs }}
      >
        Use this avatar
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  preview: { alignItems: 'center', marginBottom: spacing.md },
  previewRing: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.primary,
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  },
  previewImg: { width: '100%', height: '100%' },
  previewHint: { color: colors.textMuted, marginTop: spacing.xs },
  chipRow: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'center', marginBottom: spacing.md },
  chip: {},
  grid: { paddingBottom: spacing.lg },
  tileWrap: { flex: 1 / 3, alignItems: 'center', marginBottom: spacing.md },
  tile: {
    width: 84, height: 84, borderRadius: radius.md, overflow: 'hidden',
    borderWidth: 2, borderColor: colors.border, backgroundColor: colors.surface,
  },
  tileSelected: { borderColor: colors.primary, borderWidth: 3 },
  tileImg: { width: '100%', height: '100%' },
  checkBadge: { position: 'absolute', top: -4, right: 18, backgroundColor: colors.surface, borderRadius: 10 },
  confirmBtn: { marginTop: spacing.xs },
});
