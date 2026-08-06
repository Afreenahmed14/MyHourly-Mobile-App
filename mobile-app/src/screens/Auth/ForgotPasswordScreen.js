import { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { forgotPasswordSchema } from '../../utils/validationSchemas';
import { authApi } from '../../api/authApi';
import { colors, spacing } from '../../theme/theme';

export default function ForgotPasswordScreen({ navigation }) {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(forgotPasswordSchema), defaultValues: { email: '' } });

  const onSubmit = async ({ email }) => {
    setServerError('');
    setSubmitting(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Reset your password
      </Text>

      {sent ? (
        <>
          <Text variant="bodyMedium" style={styles.confirm}>
            If an account with that email exists, a reset link has been sent. Check your inbox.
          </Text>
          <Button mode="contained" onPress={() => navigation.navigate('Login')}>
            Back to login
          </Button>
        </>
      ) : (
        <>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Enter the email on your account and we'll send you a reset link.
          </Text>
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
          {!!serverError && (
            <Text style={styles.serverError} variant="bodySmall">
              {serverError}
            </Text>
          )}
          <Button mode="contained" onPress={handleSubmit(onSubmit)} loading={submitting} disabled={submitting}>
            Send reset link
          </Button>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: spacing.lg, justifyContent: 'center', backgroundColor: colors.background },
  title: { color: colors.text, fontWeight: '700', marginBottom: spacing.sm },
  subtitle: { color: colors.textMuted, marginBottom: spacing.lg },
  confirm: { color: colors.text, marginBottom: spacing.lg },
  field: { marginBottom: spacing.xs },
  serverError: { color: colors.error, marginBottom: spacing.md, textAlign: 'center' },
});
