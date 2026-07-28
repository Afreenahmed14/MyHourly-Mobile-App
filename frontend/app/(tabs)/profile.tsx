import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Button from '../../src/components/Button';
import { useAuth } from '../../src/context/AuthContext';
import { colors, spacing, fontSize } from '../../src/constants/theme';

export default function Profile() {
  const { user, role, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login-choice');
  };

  return (
    <View style={styles.page}>
      <Text style={styles.title}>{user?.name ?? 'My Profile'}</Text>
      <Text style={styles.subtitle}>{user?.email}</Text>
      <Text style={styles.role}>{role === 'company' ? 'Company Account' : 'Engineer Account'}</Text>

      <Button title="Log Out" variant="outline" onPress={handleLogout} style={{ marginTop: spacing.xxl }} />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg, padding: spacing.xl, paddingTop: spacing.xxl },
  title: { fontSize: fontSize.xl, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: fontSize.sm, color: colors.textMuted, marginTop: spacing.xs },
  role: { fontSize: fontSize.sm, color: colors.primary, marginTop: spacing.sm, fontWeight: '600' },
});
