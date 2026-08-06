import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing } from '../theme/theme';

export default function EmptyState({ icon = 'inbox-outline', title, subtitle }) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name={icon} size={56} color={colors.textMuted} />
      <Text variant="titleMedium" style={styles.title}>{title}</Text>
      {!!subtitle && <Text variant="bodyMedium" style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  title: { color: colors.text, marginTop: spacing.md, fontWeight: '600' },
  subtitle: { color: colors.textMuted, marginTop: spacing.xs, textAlign: 'center' },
});
