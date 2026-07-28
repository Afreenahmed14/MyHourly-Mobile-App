import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import Input from '../../src/components/Input';
import Button from '../../src/components/Button';
import { useAuth } from '../../src/context/AuthContext';
import { colors, spacing, fontSize } from '../../src/constants/theme';
import { ApiError } from '../../src/api/client';

export default function LoginCompany() {
  const { loginCompany } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    if (!email || !password) {
      setError('Enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      await loginCompany(email.trim(), password);
      router.replace('/(tabs)/browse');
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'Login failed. Try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>Company Login</Text>
      <Text style={styles.subtitle}>Log in to search engineers and manage payments.</Text>

      <Input
        label="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        placeholder="you@company.com"
      />
      <Input
        label="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button title="Log In" onPress={handleSubmit} loading={loading} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg, padding: spacing.xl, justifyContent: 'center' },
  title: { fontSize: fontSize.xl, fontWeight: '700', color: colors.text, marginBottom: spacing.xs },
  subtitle: { fontSize: fontSize.sm, color: colors.textMuted, marginBottom: spacing.xl },
  error: { color: colors.danger, marginBottom: spacing.md, fontSize: fontSize.sm },
});
