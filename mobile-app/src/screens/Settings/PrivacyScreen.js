import { ScrollView, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { colors, spacing } from '../../theme/theme';

export default function PrivacyScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.lg }}>
      <Text variant="headlineSmall" style={styles.title}>Privacy Policy</Text>
      <Text variant="bodyMedium" style={styles.body}>We collect only the information needed to operate the marketplace — profile details, job postings, and application data. We never sell your data to third parties. Contact privacy@hourlyrecruit.com with any questions.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { color: colors.text, fontWeight: '700', marginBottom: spacing.lg },
  body: { color: colors.textMuted, lineHeight: 22 },
});
