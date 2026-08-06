import { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../../utils/validationSchemas';
import { useAuth } from '../../context/useAuth';
import { colors, spacing } from '../../theme/theme';
import RoleToggle from '../../components/RoleToggle';
import GoogleSignInButton from '../../components/GoogleSignInButton';

export default function LoginScreen({ navigation }) {
  const { login, loginWithFirebase } = useAuth();
  const [role, setRole] = useState('candidate');
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values) => {
    setServerError('');
    setSubmitting(true);
    try {
      await login(role, values);
      // Navigation to the main app happens automatically — RootNavigator
      // watches isAuthenticated and swaps stacks.
    } catch (err) {
      setServerError(
        err.response?.data?.message || 'Login failed. Check your credentials and try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const onGoogleSignIn = async (idToken) => {
    setServerError('');
    setSubmitting(true);
    try {
      // createIfMissing=false on Login: "Continue with Google" here should
      // never silently create a new account (matches web behavior).
      await loginWithFirebase(role, idToken, {}, false);
    } catch (err) {
      setServerError(
        err.response?.data?.message ||
          'No account found for that Google sign-in. Try registering instead.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text variant="headlineMedium" style={styles.title}>
          Welcome back
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Log in to continue
        </Text>

        <RoleToggle role={role} onChange={setRole} />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.field}>
              <TextInput
                mode="outlined"
                label="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={!!errors.email}
              />
              <HelperText type="error" visible={!!errors.email}>
                {errors.email?.message}
              </HelperText>
            </View>
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.field}>
              <TextInput
                mode="outlined"
                label="Password"
                secureTextEntry={!showPassword}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={!!errors.password}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword((s) => !s)}
                  />
                }
              />
              <HelperText type="error" visible={!!errors.password}>
                {errors.password?.message}
              </HelperText>
            </View>
          )}
        />

        <Button mode="text" onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgot}>
          Forgot password?
        </Button>

        {!!serverError && (
          <Text style={styles.serverError} variant="bodySmall">
            {serverError}
          </Text>
        )}

        <Button mode="contained" onPress={handleSubmit(onSubmit)} loading={submitting} disabled={submitting}>
          Log in
        </Button>

        <GoogleSignInButton onToken={onGoogleSignIn} disabled={submitting} style={{ marginTop: spacing.md }} />

        <View style={styles.footer}>
          <Text variant="bodyMedium">Don&apos;t have an account? </Text>
          <Button mode="text" compact onPress={() => navigation.navigate('Register')}>
            Register
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: spacing.lg, justifyContent: 'center' },
  title: { color: colors.text, fontWeight: '700', marginBottom: spacing.xs },
  subtitle: { color: colors.textMuted, marginBottom: spacing.xl },
  field: { marginBottom: spacing.xs },
  forgot: { alignSelf: 'flex-end', marginBottom: spacing.sm },
  serverError: { color: colors.error, marginBottom: spacing.md, textAlign: 'center' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg, alignItems: 'center' },
});
