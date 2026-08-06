import { ScrollView, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { colors, spacing } from '../../theme/theme';

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.lg }}>
      <Text variant="headlineSmall" style={styles.title}>About HourlyRecruit</Text>
      <Text variant="bodyMedium" style={styles.body}>HourlyRecruit connects skilled engineers with companies hiring for full-time, contract, and project-based work. Our mission is to make hiring transparent, fast, and fair for both sides of the table.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { color: colors.text, fontWeight: '700', marginBottom: spacing.lg },
  body: { color: colors.textMuted, lineHeight: 22 },
});
