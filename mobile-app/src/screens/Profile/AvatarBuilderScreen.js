import { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, radius } from '../../theme/theme';

// Bitmoji/Snapchat-style avatar builder: pick a value per facial
// feature and the preview updates live, rendered through DiceBear's
// free, open-source "avataaars" style (https://www.dicebear.com —
// MIT/CC0 licensed art, not tied to any real person or copyrighted
// character). Each category below maps straight to a DiceBear
// avataaars option.
const CATEGORIES = [
  {
    key: 'skinColor',
    label: 'Skin tone',
    icon: 'account-outline',
    options: ['tanned', 'yellow', 'pale', 'light', 'brown', 'darkBrown', 'black'],
  },
  {
    key: 'top',
    label: 'Hair style',
    icon: 'face-man-outline',
    options: [
      'shortFlat', 'shortWaved', 'shortCurly', 'shortRound',
      'curly', 'bigHair', 'bun', 'dreads', 'fro', 'straight01', 'shavedSides', 'hat',
    ],
  },
  {
    key: 'hairColor',
    label: 'Hair color',
    icon: 'palette-outline',
    options: ['auburn', 'black', 'blonde', 'blondeGolden', 'brown', 'brownDark', 'platinum', 'red', 'silverGray'],
  },
  {
    key: 'eyes',
    label: 'Eyes',
    icon: 'eye-outline',
    options: ['default', 'happy', 'wink', 'hearts', 'squint', 'surprised', 'side', 'closed'],
  },
  {
    key: 'eyebrows',
    label: 'Eyebrows',
    icon: 'minus',
    options: ['default', 'raisedExcited', 'sadConcerned', 'angry', 'upDown', 'flatNatural'],
  },
  {
    key: 'mouth',
    label: 'Mouth',
    icon: 'emoticon-outline',
    options: ['smile', 'default', 'serious', 'twinkle', 'tongue', 'disbelief', 'grimace'],
  },
  {
    key: 'accessories',
    label: 'Accessories',
    icon: 'glasses',
    options: ['none', 'round', 'wayfarers', 'sunglasses', 'prescription01', 'kurt'],
  },
  {
    key: 'clothing',
    label: 'Outfit',
    icon: 'tshirt-crew-outline',
    options: ['shirtCrewNeck', 'hoodie', 'blazerAndShirt', 'collarAndSweater', 'overall', 'graphicShirt'],
  },
];

const DEFAULTS = {
  skinColor: 'light',
  top: 'shortFlat',
  hairColor: 'brown',
  eyes: 'default',
  eyebrows: 'default',
  mouth: 'smile',
  accessories: 'none',
  clothing: 'shirtCrewNeck',
};

const swatchPreviewUrl = (category, value, base) => {
  const params = new URLSearchParams({ seed: 'preview', size: '64', ...base, [category]: value });
  return `https://api.dicebear.com/10.x/avataaars/png?${params.toString()}`;
};

const buildAvatarUrl = (choices) => {
  const params = new URLSearchParams({
    seed: 'my-avatar',
    size: '200',
    backgroundType: 'gradientLinear',
    ...choices,
  });
  return `https://api.dicebear.com/10.x/avataaars/png?${params.toString()}`;
};

const randomChoices = () => {
  const picked = {};
  CATEGORIES.forEach(({ key, options }) => {
    picked[key] = options[Math.floor(Math.random() * options.length)];
  });
  return picked;
};

// Small wrapper so a single bad image (network hiccup, etc.) shows a
// visible broken-image icon instead of silently rendering as blank.
function Swatch({ uri, selected, onPress }) {
  const [failed, setFailed] = useState(false);
  return (
    <Pressable style={styles.swatchWrap} onPress={onPress}>
      <View style={[styles.swatch, selected && styles.swatchSelected]}>
        {failed ? (
          <MaterialCommunityIcons name="image-broken-variant" size={20} color={colors.textMuted} />
        ) : (
          <Image
            source={{ uri }}
            style={styles.swatchImg}
            onLoadStart={() => setFailed(false)}
            onError={() => setFailed(true)}
          />
        )}
      </View>
      {selected && (
        <MaterialCommunityIcons name="check-circle" size={18} color={colors.primary} style={styles.checkBadge} />
      )}
    </Pressable>
  );
}

/**
 * Full-screen, Bitmoji-style avatar builder. Purely optional — this
 * avatar is used for the candidate's home-page representation, kept
 * separate from the real profile photo used everywhere else.
 */
export default function AvatarBuilderScreen({ route, navigation }) {
  const { initialChoices, returnScreen } = route.params || {};
  const [choices, setChoices] = useState(initialChoices || DEFAULTS);
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].key);
  const [previewFailed, setPreviewFailed] = useState(false);

  const previewUrl = buildAvatarUrl(choices);
  const category = CATEGORIES.find((c) => c.key === activeCategory);

  const pick = (value) => setChoices((prev) => ({ ...prev, [activeCategory]: value }));

  const shuffle = () => setChoices(randomChoices());

  // Navigate back with the result as plain, serializable params instead
  // of passing a callback function through route params (functions
  // there break state persistence/restoration and trigger a React
  // Navigation warning). The screen we return to picks this up and
  // does its own saving.
  const confirm = () => {
    navigation.navigate(returnScreen || 'EditCandidateProfile', {
      avatarResult: { url: previewUrl, choices },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.previewRow}>
        <View style={styles.previewRing}>
          {previewFailed ? (
            <MaterialCommunityIcons name="image-broken-variant" size={32} color={colors.textMuted} />
          ) : (
            <Image
              source={{ uri: previewUrl }}
              style={styles.previewImg}
              onLoadStart={() => setPreviewFailed(false)}
              onError={() => setPreviewFailed(true)}
            />
          )}
        </View>
        <Pressable style={styles.shuffleBtn} onPress={shuffle}>
          <MaterialCommunityIcons name="dice-multiple-outline" size={18} color={colors.primary} />
          <Text style={styles.shuffleText}>Shuffle</Text>
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabRow} contentContainerStyle={styles.tabRowContent}>
        {CATEGORIES.map((c) => (
          <Pressable
            key={c.key}
            onPress={() => setActiveCategory(c.key)}
            style={[styles.tab, c.key === activeCategory && styles.tabActive]}
          >
            <MaterialCommunityIcons
              name={c.icon}
              size={16}
              color={c.key === activeCategory ? '#fff' : colors.textMuted}
            />
            <Text style={[styles.tabText, c.key === activeCategory && styles.tabTextActive]}>{c.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.swatchGrid}>
        {category.options.map((opt) => {
          const selected = choices[activeCategory] === opt;
          return (
            <Swatch
              key={opt}
              uri={swatchPreviewUrl(activeCategory, opt, choices)}
              selected={selected}
              onPress={() => pick(opt)}
            />
          );
        })}
      </ScrollView>

      <Button
        mode="contained"
        onPress={confirm}
        style={styles.saveBtn}
        contentStyle={{ paddingVertical: spacing.xs }}
      >
        Save avatar
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  previewRow: { alignItems: 'center', marginBottom: spacing.md },
  previewRing: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: colors.surface, borderWidth: 3, borderColor: colors.primary,
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: spacing.sm,
  },
  previewImg: { width: '100%', height: '100%' },
  shuffleBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  shuffleText: { color: colors.primary, fontWeight: '600' },
  tabRow: { flexGrow: 0, marginBottom: spacing.sm },
  tabRowContent: { gap: spacing.sm, paddingBottom: spacing.xs },
  tab: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
    borderRadius: radius.pill, backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border,
  },
  tabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { color: colors.textMuted, fontSize: 12, fontWeight: '600' },
  tabTextActive: { color: '#fff' },
  swatchGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, paddingVertical: spacing.sm },
  swatchWrap: { alignItems: 'center' },
  swatch: {
    width: 64, height: 64, borderRadius: radius.md, overflow: 'hidden',
    borderWidth: 2, borderColor: colors.border, backgroundColor: colors.surface,
  },
  swatchSelected: { borderColor: colors.primary, borderWidth: 3 },
  swatchImg: { width: '100%', height: '100%' },
  checkBadge: { position: 'absolute', top: -6, right: -6, backgroundColor: colors.surface, borderRadius: 10 },
  saveBtn: { marginTop: spacing.sm },
});
