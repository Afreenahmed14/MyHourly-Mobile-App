import { useState } from 'react';
import { View, StyleSheet, FlatList, Pressable, Image } from 'react-native';
import { Text, Button, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
  const [chosen, setChosen] = useState(null);
  const [saving, setSaving] = useState(false);

  const { style, seeds } = STYLE_SETS[category];

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
          {chosen ? (
            <Image source={{ uri: chosen }} style={styles.previewImg} />
          ) : (
            <MaterialCommunityIcons name="account-question-outline" size={48} color={colors.textMuted} />
          )}
        </View>
        <Text variant="bodySmall" style={styles.previewHint}>
          {chosen ? 'Looking good — confirm below' : 'Tap a style to preview it here'}
        </Text>
      </View>

      <View style={styles.chipRow}>
        {categories.map((c) => (
          <Chip
            key={c}
            selected={c === category}
            onPress={() => { setCategory(c); setChosen(null); }}
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
          const url = avatarUrl(style, seed);
          const selected = chosen === url;
          return (
            <Pressable style={styles.tileWrap} onPress={() => setChosen(url)}>
              <View style={[styles.tile, selected && styles.tileSelected]}>
                <Image source={{ uri: url }} style={styles.tileImg} />
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
