import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { colors, spacing } from '../../theme/theme';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.logo}>
        HourlyRecruit
      </Text>
      <ActivityIndicator animating size="large" color={colors.primary} style={{ marginTop: spacing.lg }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  logo: { color: colors.primary, fontWeight: '700' },
});
