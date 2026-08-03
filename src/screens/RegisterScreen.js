import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';
import styles from '../styles/Auth.styles';

export default function RegisterScreen({ navigation, route }) {
  const initialRole = route.params?.role === 'company' ? 'company' : 'engineer';
  const [role, setRole] = useState(initialRole);
  const { login } = useAuth();

  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');

  const isEngineer = role === 'engineer';

  const handleCreateAccount = () => {
    const nameOk = isEngineer ? fullName : companyName && fullName;
    if (!nameOk || !email || !password) {
      Alert.alert('Missing information', 'Please fill in all required fields.');
      return;
    }
    // Mock sign-up — replace with a real API call later.
    login(role);
    Alert.alert('Account created', `Welcome to MyHourly, ${fullName || 'there'}!`, [
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
        <Text style={styles.formTitle}>Create your account</Text>
        <Text style={styles.formSubtitle}>Join HourlyRecruit as an engineer or a company</Text>

        <View style={styles.segmentRow}>
          <TouchableOpacity
            style={[styles.segmentBtn, styles.segmentBtnLeft, isEngineer && styles.segmentBtnActive]}
            onPress={() => setRole('engineer')}
          >
            <Text style={[styles.segmentText, isEngineer && styles.segmentTextActive]}>I'm an Engineer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segmentBtn, styles.segmentBtnRight, !isEngineer && styles.segmentBtnActive]}
            onPress={() => setRole('company')}
          >
            <Text style={[styles.segmentText, !isEngineer && styles.segmentTextActive]}>I'm a Company</Text>
          </TouchableOpacity>
        </View>

        {isEngineer ? (
          <View style={styles.field}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput style={styles.input} value={fullName} onChangeText={setFullName} placeholder="Your full name" />
          </View>
        ) : (
          <>
            <View style={styles.field}>
              <Text style={styles.label}>Contact Person Name</Text>
              <TextInput style={styles.input} value={fullName} onChangeText={setFullName} placeholder="Your name" />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Company Name</Text>
              <TextInput style={styles.input} value={companyName} onChangeText={setCompanyName} placeholder="Company name" />
            </View>
          </>
        )}

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
          <Text style={styles.helperText}>
            At least 8 characters, with an uppercase letter, a lowercase letter, a number, and a special character.
          </Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="+91 98765 43210"
            keyboardType="phone-pad"
          />
        </View>

        <TouchableOpacity style={styles.primaryBtn} onPress={handleCreateAccount}>
          <Text style={styles.primaryBtnText}>Create Account</Text>
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

        <TouchableOpacity onPress={() => navigation.navigate('LoginForm', { role })}>
          <Text style={styles.switchRoleText}>
            Already have an account? <Text style={styles.switchRoleLink}>Log in</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
