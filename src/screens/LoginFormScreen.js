import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';
import styles from '../styles/Auth.styles';

export default function LoginFormScreen({ navigation, route }) {
  const role = route.params?.role === 'company' ? 'company' : 'engineer';
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const isEngineer = role === 'engineer';

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Missing information', 'Please enter your email and password.');
      return;
    }
    // Mock login — replace with a real auth call later.
    login(role);
    Alert.alert('Logged in', `Logged in as ${isEngineer ? 'an engineer' : 'a company'}.`, [
      {
        text: 'OK',
        onPress: () => {
          navigation.reset({
            index: 0,
            routes: [{ name: isEngineer ? 'Dashboard' : 'CompanyDashboard' }],
          });
        },
      },
    ]);
  };

  const handleSocial = (provider) => {
    Alert.alert(provider, 'This would connect to real authentication later.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.formCard}>
        <View style={styles.formIconWrap}>
          <Ionicons
            name={isEngineer ? 'person-outline' : 'briefcase-outline'}
            size={20}
            color={isEngineer ? colors.success : colors.primary}
          />
        </View>
        <Text style={styles.formTitle}>{isEngineer ? 'Engineer Login' : 'Company Login'}</Text>
        <Text style={styles.formSubtitle}>
          {isEngineer
            ? 'Manage your profile, resume, and unlock notifications.'
            : 'Search engineers, unlock contacts, and manage payments.'}
        </Text>

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword((s) => !s)}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.forgotLink} onPress={() => Alert.alert('Forgot password', 'A reset link would be emailed here.')}>
          <Text style={styles.forgotLinkText}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin}>
          <Text style={styles.primaryBtnText}>Log In as {isEngineer ? 'Engineer' : 'Company'}</Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={[styles.socialBtn, styles.googleBtn]} onPress={() => handleSocial('Google')}>
          <Ionicons name="logo-google" size={16} color={colors.text} />
          <Text style={styles.socialBtnText}>Google</Text>
        </TouchableOpacity>

        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialBtn} onPress={() => handleSocial('Phone')}>
            <Ionicons name="call-outline" size={16} color={colors.text} />
            <Text style={styles.socialBtnText}>Phone</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.socialBtn, { marginRight: 0 }]} onPress={() => handleSocial('Email link')}>
            <Ionicons name="mail-outline" size={16} color={colors.text} />
            <Text style={styles.socialBtnText}>Email link</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Register', { role })}>
          <Text style={styles.switchRoleText}>
            New {isEngineer ? 'engineer' : 'company'}? <Text style={styles.switchRoleLink}>Create an account</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.setParams({ role: isEngineer ? 'company' : 'engineer' })}
        >
          <Text style={styles.switchRoleText}>
            Not {isEngineer ? 'an engineer' : 'a company'}?{' '}
            <Text style={styles.switchRoleLink}>Log in as {isEngineer ? 'a company' : 'an engineer'}</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
