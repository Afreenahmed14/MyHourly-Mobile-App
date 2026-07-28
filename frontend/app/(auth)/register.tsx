import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import Input from '../../src/components/Input';
import Button from '../../src/components/Button';
import { useAuth } from '../../src/context/AuthContext';
import { colors, spacing, fontSize, radius } from '../../src/constants/theme';
import { ApiError } from '../../src/api/client';

type Role = 'candidate' | 'company';

export default function Register() {
  const { registerCandidate, registerCompany } = useAuth();
  const [role, setRole] = useState<Role>('candidate');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    if (!name || !email || !password) {
      setError('Name, email, and password are required.');
      return;
    }
    setLoading(true);
    try {
      if (role === 'candidate') {
        await registerCandidate({ name, email: email.trim(), phone, password, hourlyRate: Number(hourlyRate) || undefined });
      } else {
        await registerCompany({ name, companyName, email: email.trim(), phone, password });
      }
      router.replace('/(tabs)/browse');
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'Registration failed. Try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.title}>Create your account</Text>
      <Text style={styles.subtitle}>Join HourlyRecruit as an engineer or a company</Text>

      <View style={styles.roleToggle}>
        <Pressable
          style={[styles.roleOption, role === 'candidate' && styles.roleOptionActive]}
          onPress={() => setRole('candidate')}
        >
          <Text style={[styles.roleText, role === 'candidate' && styles.roleTextActive]}>
            I'm an Engineer
          </Text>
        </Pressable>
        <Pressable
          style={[styles.roleOption, role === 'company' && styles.roleOptionActive]}
          onPress={() => setRole('company')}
        >
          <Text style={[styles.roleText, role === 'company' && styles.roleTextActive]}>
            I'm a Company
          </Text>
        </Pressable>
      </View>

      <Input
        label={role === 'company' ? 'Contact Person Name' : 'Full Name'}
        value={name}
        onChangeText={setName}
        placeholder="Jane Doe"
      />
      {role === 'company' && (
        <Input
          label="Company Name"
          value={companyName}
          onChangeText={setCompanyName}
          placeholder="Acme Inc."
        />
      )}
      <Input
        label="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
      />
      <Input
        label="Phone"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        placeholder="+91 9xxxxxxxxx"
      />
      {role === 'candidate' && (
        <Input
          label="Hourly Rate (₹)"
          keyboardType="numeric"
          value={hourlyRate}
          onChangeText={setHourlyRate}
          placeholder="500"
        />
      )}
      <Input
        label="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholder="At least 8 characters"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button title="Create Account" onPress={handleSubmit} loading={loading} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flexGrow: 1, backgroundColor: colors.bg, padding: spacing.xl },
  title: { fontSize: fontSize.xl, fontWeight: '700', color: colors.text, marginBottom: spacing.xs },
  subtitle: { fontSize: fontSize.sm, color: colors.textMuted, marginBottom: spacing.xl },
  roleToggle: { flexDirection: 'row', marginBottom: spacing.xl, borderRadius: radius.md, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  roleOption: { flex: 1, paddingVertical: spacing.md, alignItems: 'center', backgroundColor: colors.surface },
  roleOptionActive: { backgroundColor: colors.primaryLight },
  roleText: { color: colors.textMuted, fontSize: fontSize.sm, fontWeight: '600' },
  roleTextActive: { color: colors.primaryDark },
  error: { color: colors.danger, marginBottom: spacing.md, fontSize: fontSize.sm },
});
