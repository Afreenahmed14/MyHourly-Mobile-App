import { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SvgXml } from 'react-native-svg';
import { colors, spacing, radius } from '../../theme/theme';
import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';

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

// DiceBear's avataaars schema only accepts raw hex strings for
// skinColor/hairColor (see the `pattern: "^(transparent|[a-fA-F0-9]{6})$"`
// in the schema) — it does NOT accept the friendly option names shown in
// the picker UI. Passing 'brown' straight through made DiceBear treat it
// as a CSS color name, which SvgXml/react-native-svg then rejected as
// `"#brown" is not a valid color or brush` (and silently fell back to
// nothing for every swatch). These map each friendly name to the exact
// hex DiceBear itself ships as that named swatch's default.
const SKIN_COLOR_HEX = {
  tanned: 'fd9841',
  yellow: 'f8d25c',
  pale: 'ffdbb4',
  light: 'edb98a',
  brown: 'd08b5b',
  darkBrown: 'ae5d29',
  black: '614335',
};
const HAIR_COLOR_HEX = {
  auburn: 'a55728',
  black: '2c1b18',
  blonde: 'b58143',
  blondeGolden: 'd6b370',
  brown: '724133',
  brownDark: '4a312c',
  platinum: 'ecdcbf',
  red: 'c93305',
  silverGray: 'e8e1e1',
};

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

// Generated locally with @dicebear/core — no network call, so the
// flakiness we were hitting against api.dicebear.com's shared CDN
// (edge-cached error responses for a given query string) can't happen
// here at all. Each option is wrapped in an array because DiceBear's
// schema options are all "pick one of N" lists; a single-element array
// pins it to exactly that value. accessoriesProbability/hatProbability
// etc. default to 100 whenever a non-"none" value is supplied, so we
// don't need to set those explicitly.
const generateAvatarSvg = (choices, seed) => {
  try {
    const avatar = createAvatar(avataaars, {
      seed,
      backgroundType: ['gradientLinear'],
      skinColor: [SKIN_COLOR_HEX[choices.skinColor]],
      top: [choices.top],
      hairColor: [HAIR_COLOR_HEX[choices.hairColor]],
      eyes: [choices.eyes],
      eyebrows: [choices.eyebrows],
      mouth: [choices.mouth],
      accessories: [choices.accessories],
      accessoriesProbability: choices.accessories === 'none' ? 0 : 100,
      clothing: [choices.clothing],
    });
    return avatar.toString();
  } catch (err) {
    console.warn('[AvatarBuilder] local SVG generation failed:', choices, err);
    return null;
  }
};

// The URL that actually gets *saved* as `avatarImage` still needs to be
// renderable by a plain React Native <Image> everywhere else it shows
// up (AvatarSection preview bubble, the candidate home page, etc.), and
// RN's <Image> cannot decode SVG. @dicebear/core can't rasterize to PNG
// outside a browser/canvas environment, so for the saved avatar we still
// point at DiceBear's hosted PNG endpoint (same artwork, same params) —
// only the in-builder preview/swatches are generated fully offline.
const buildAvatarPngUrl = (choices) => {
  const params = new URLSearchParams({
    seed: 'my-avatar',
    backgroundType: 'gradientLinear',
    size: '256',
    ...choices,
    skinColor: SKIN_COLOR_HEX[choices.skinColor],
    hairColor: HAIR_COLOR_HEX[choices.hairColor],
  });
  return `https://api.dicebear.com/9.x/avataaars/png?${params.toString()}`;
};

const randomChoices = () => {
  const picked = {};
  CATEGORIES.forEach(({ key, options }) => {
    picked[key] = options[Math.floor(Math.random() * options.length)];
  });
  return picked;
};

// Small wrapper so a single bad generation shows a visible broken-image
// icon instead of silently rendering as blank.
function Swatch({ svg, selected, onPress }) {
  return (
    <Pressable style={styles.swatchWrap} onPress={onPress}>
      <View style={[styles.swatch, selected && styles.swatchSelected]}>
        {svg ? (
          <SvgXml xml={svg} width="100%" height="100%" />
        ) : (
          <MaterialCommunityIcons name="image-broken-variant" size={20} color={colors.textMuted} />
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

  const category = CATEGORIES.find((c) => c.key === activeCategory);

  const previewSvg = useMemo(() => generateAvatarSvg(choices, 'my-avatar'), [choices]);

  // Swatch thumbnails for the active category — only these depend on
  // activeCategory, so we don't regenerate the other seven categories'
  // swatches every time the user flips tabs.
  const swatchSvgs = useMemo(() => {
    const map = {};
    category.options.forEach((opt) => {
      map[opt] = generateAvatarSvg({ ...choices, [activeCategory]: opt }, 'preview');
    });
    return map;
  }, [activeCategory, choices, category]);

  const pick = (value) => {
    setChoices((prev) => ({ ...prev, [activeCategory]: value }));
  };

  const shuffle = () => {
    setChoices(randomChoices());
  };

  // Navigate back with the result as plain, serializable params instead
  // of passing a callback function through route params (functions
  // there break state persistence/restoration and trigger a React
  // Navigation warning). The screen we return to picks this up and
  // does its own saving.
  const confirm = () => {
    navigation.navigate(returnScreen || 'EditCandidateProfile', {
      // Save the PNG variant (see buildAvatarPngUrl) — this is what ends
      // up in a plain <Image> on the edit-profile bubble and the home page.
      avatarResult: { url: buildAvatarPngUrl(choices), choices },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.previewRow}>
        <View style={styles.previewRing}>
          {previewSvg ? (
            <SvgXml xml={previewSvg} width="100%" height="100%" />
          ) : (
            <MaterialCommunityIcons name="image-broken-variant" size={32} color={colors.textMuted} />
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
              svg={swatchSvgs[opt]}
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
    alignItems: 'center', justifyContent: 'center',
  },
  swatchSelected: { borderColor: colors.primary, borderWidth: 3 },
  swatchImg: { width: '100%', height: '100%' },
  checkBadge: { position: 'absolute', top: -6, right: -6, backgroundColor: colors.surface, borderRadius: 10 },
  saveBtn: { marginTop: spacing.sm },
});
