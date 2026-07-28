import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { api } from '../../src/api/client';
import { colors, spacing, fontSize, radius } from '../../src/constants/theme';

export default function Notifications() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    api
      .get('/notifications')
      .then((res) => setItems(res.data?.notifications ?? res.data ?? []))
      .catch(() => setItems([]));
  }, []);

  return (
    <View style={styles.page}>
      <Text style={styles.title}>Notifications</Text>
      <FlatList
        data={items}
        keyExtractor={(item, i) => item._id ?? String(i)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.message}>{item.message}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No notifications yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg, padding: spacing.lg, paddingTop: spacing.xxl },
  title: { fontSize: fontSize.xl, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  message: { color: colors.text, fontSize: fontSize.sm },
  empty: { color: colors.textMuted, textAlign: 'center', marginTop: spacing.xxl },
});
