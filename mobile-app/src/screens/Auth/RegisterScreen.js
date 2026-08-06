import { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerCandidateSchema, registerCompanySchema } from '../../utils/validationSchemas';
import { useAuth } from '../../context/useAuth';
import { colors, spacing } from '../../theme/theme';
import RoleToggle from '../../components/RoleToggle';
import GoogleSignInButton from '../../components/GoogleSignInButton';

export default function RegisterScreen({ navigation }) {
  const { register, loginWithFirebase } = useAuth();
  const [role, setRole] = useState('candidate');
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const schema = role === 'candidate' ? registerCandidateSchema : registerCompanySchema;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: '', companyName: '', email: '', password: '', phone: '', hourlyRate: '' },
  });

  const switchRole = (nextRole) => {
    setRole(nextRole);
    reset({ name: '', companyName: '', email: '', password: '', phone: '', hourlyRate: '' });
  };

  const onSubmit = async (values) => {
    setServerError('');
    setSubmitting(true);
    try {
      const payload =
        role === 'candidate'
          ? {
              name: values.name,
              email: values.email,
              password: values.password,
              phone: values.phone || undefined,
              hourlyRate: values.hourlyRate ? Number(values.hourlyRate) : undefined,
            }
          : {
              name: values.name,
              companyName: values.companyName,
              email: values.email,
              password: values.password,
              phone: values.phone || undefined,
            };
      await register(role, payload);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const onGoogleSignUp = async (idToken) => {
    setServerError('');
    setSubmitting(true);
    try {
      // Google sign-up on this screen may create a new account
      // (createIfMissing defaults true), matching web's Register page.
      const extra = role === 'company' ? { companyName: 'New Company' } : {};
      await loginWithFirebase(role, idToken, extra, true);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Google sign-up failed.');
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
          Create your account
        </Text>

        <RoleToggle role={role} onChange={switchRole} />

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.field}>
              <TextInput
                mode="outlined"
                label={role === 'candidate' ? 'Full name' : 'Contact name'}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={!!errors.name}
              />
              <HelperText type="error" visible={!!errors.name}>
                {errors.name?.message}
              </HelperText>
            </View>
          )}
        />

        {role === 'company' && (
          <Controller
            control={control}
            name="companyName"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.field}>
                <TextInput
                  mode="outlined"
                  label="Company name"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={!!errors.companyName}
                />
                <HelperText type="error" visible={!!errors.companyName}>
                  {errors.companyName?.message}
                </HelperText>
              </View>
            )}
          />
        )}

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
          name="phone"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.field}>
              <TextInput
                mode="outlined"
                label="Phone (optional)"
                keyboardType="phone-pad"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={!!errors.phone}
              />
              <HelperText type="error" visible={!!errors.phone}>
                {errors.phone?.message}
              </HelperText>
            </View>
          )}
        />

        {role === 'candidate' && (
          <Controller
            control={control}
            name="hourlyRate"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.field}>
                <TextInput
                  mode="outlined"
                  label="Hourly rate (optional)"
                  keyboardType="numeric"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={!!errors.hourlyRate}
                />
                <HelperText type="error" visible={!!errors.hourlyRate}>
                  {errors.hourlyRate?.message}
                </HelperText>
              </View>
            )}
          />
        )}

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

        {!!serverError && (
          <Text style={styles.serverError} variant="bodySmall">
            {serverError}
          </Text>
        )}

        <Button mode="contained" onPress={handleSubmit(onSubmit)} loading={submitting} disabled={submitting}>
          Create account
        </Button>

        <GoogleSignInButton onToken={onGoogleSignUp} disabled={submitting} style={{ marginTop: spacing.md }} />

        <View style={styles.footer}>
          <Text variant="bodyMedium">Already have an account? </Text>
          <Button mode="text" compact onPress={() => navigation.navigate('Login')}>
            Log in
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: spacing.lg, justifyContent: 'center' },
  title: { color: colors.text, fontWeight: '700', marginBottom: spacing.lg },
  field: { marginBottom: spacing.xs },
  serverError: { color: colors.error, marginBottom: spacing.md, textAlign: 'center' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg, alignItems: 'center' },
});
