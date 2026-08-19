import { useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-paper';
import { resolveImageUrl } from '../constants/config';

/**
 * Drop-in for react-native-paper's <Avatar.Image>. Paper's version only
 * falls back when `source` is empty — if the URL exists but fails to
 * *load* (dead link, 404, network hiccup), it shows the broken-image
 * glyph forever. This swaps to `fallbackSource` (a local asset) or, if
 * that's not given, an initials circle, the moment `onError` fires.
 */
export default function SafeAvatar({ uri, size = 44, fallbackSource, label, style }) {
  const [failed, setFailed] = useState(false);
  const resolved = resolveImageUrl(uri);

  if (resolved && !failed) {
    return (
      <Image
        source={{ uri: resolved }}
        style={[{ width: size, height: size, borderRadius: size / 2 }, styles.base, style]}
        onError={() => setFailed(true)}
      />
    );
  }

  if (fallbackSource) {
    return (
      <Image
        source={fallbackSource}
        style={[{ width: size, height: size, borderRadius: size / 2 }, styles.base, style]}
      />
    );
  }

  return (
    <Avatar.Text
      size={size}
      label={(label || '?').trim().charAt(0).toUpperCase() || '?'}
      style={style}
    />
  );
}

const styles = StyleSheet.create({
  base: { backgroundColor: '#E2E8F0' },
});
