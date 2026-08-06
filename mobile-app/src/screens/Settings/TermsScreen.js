import { ScrollView, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { colors, spacing } from '../../theme/theme';

export default function TermsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.lg }}>
      <Text variant="headlineSmall" style={styles.title}>Terms of Service</Text>
      <Text variant="bodyMedium" style={styles.body}>By using HourlyRecruit you agree to use the platform honestly, keep your account information accurate, and follow applicable hiring and labor laws in your jurisdiction.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { color: colors.text, fontWeight: '700', marginBottom: spacing.lg },
  body: { color: colors.textMuted, lineHeight: 22 },
});
