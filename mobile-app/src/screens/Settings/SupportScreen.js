import { ScrollView, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { colors, spacing } from '../../theme/theme';

export default function SupportScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.lg }}>
      <Text variant="headlineSmall" style={styles.title}>Support</Text>
      <Text variant="bodyMedium" style={styles.body}>Need help? Reach out to us at support@hourlyrecruit.com and our team will get back to you within one business day.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { color: colors.text, fontWeight: '700', marginBottom: spacing.lg },
  body: { color: colors.textMuted, lineHeight: 22 },
});
