import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme';

export default function ComingSoonScreen({ route }) {
  const title = route?.params?.title || 'This section';

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, backgroundColor: colors.background }}>
      <Ionicons name="construct-outline" size={36} color={colors.textMuted} />
      <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text, marginTop: spacing.md, textAlign: 'center' }}>
        {title} is coming soon
      </Text>
      <Text style={{ fontSize: 13, color: colors.textMuted, marginTop: spacing.sm, textAlign: 'center' }}>
        This part of MyHourly hasn't been built yet in this app.
      </Text>
    </View>
  );
}
