import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { colors, radius, spacing, fontSize, shadow } from '../../src/constants/theme';

export default function LoginChoice() {
  return (
    <View style={styles.page}>
      <Text style={styles.title}>How would you like to log in?</Text>
      <Text style={styles.subtitle}>Choose the account type that's yours.</Text>

      <Link href="/(auth)/login-candidate" asChild>
        <Pressable style={({ pressed }) => [styles.card, pressed && { opacity: 0.9 }]}>
          <Feather name="user" size={32} color={colors.primary} />
          <Text style={styles.cardTitle}>I'm an Engineer</Text>
          <Text style={styles.cardSubtitle}>Log in to manage your profile and track unlocks.</Text>
        </Pressable>
      </Link>

      <Link href="/(auth)/login-company" asChild>
        <Pressable style={({ pressed }) => [styles.card, pressed && { opacity: 0.9 }]}>
          <Feather name="briefcase" size={32} color={colors.primary} />
          <Text style={styles.cardTitle}>I'm a Company</Text>
          <Text style={styles.cardSubtitle}>Log in to search engineers and manage payments.</Text>
        </Pressable>
      </Link>

      <View style={styles.switchRow}>
        <Text style={styles.switchText}>New to HourlyRecruit? </Text>
        <Link href="/(auth)/register">
          <Text style={styles.switchLink}>Create an account</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg, padding: spacing.xl, justifyContent: 'center' },
  title: { fontSize: fontSize.xl, fontWeight: '700', color: colors.text, textAlign: 'center' },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadow.sm,
  },
  cardTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.text, marginTop: spacing.md },
  cardSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg },
  switchText: { color: colors.textMuted, fontSize: fontSize.sm },
  switchLink: { color: colors.primary, fontSize: fontSize.sm, fontWeight: '600' },
});
