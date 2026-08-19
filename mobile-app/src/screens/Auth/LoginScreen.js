import { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Pressable, Image } from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp, FadeIn, Easing } from 'react-native-reanimated';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../../utils/validationSchemas';
import { useAuth } from '../../context/useAuth';
import { colors, spacing, radius, shadows } from '../../theme/theme';
import GoogleSignInButton from '../../components/GoogleSignInButton';

// Shown before any credentials are collected — the user picks which
// kind of account they're signing in as. Each option gets its own
// gradient badge/icon so the choice reads as a real fork in the
// journey rather than a small toggle buried above the form.
const ROLE_OPTIONS = [
  {
    value: 'candidate',
    title: "I'm looking for work",
    subtitle: 'Sign in as a Candidate',
    icon: 'account-search-outline',
    gradient: ['#6366F1', '#4338CA'],
  },
  {
    value: 'company',
    title: "I'm hiring talent",
    subtitle: 'Sign in as a Company',
    icon: 'domain',
    gradient: ['#FBBF24', '#D97706'],
  },
];

function RoleOption({ option, delay, onPress }) {
  return (
    <Animated.View entering={FadeInUp.delay(delay).duration(380).easing(Easing.out(Easing.cubic))}>
      <Pressable
        style={({ pressed }) => [styles.roleCard, pressed && styles.roleCardPressed]}
        onPress={onPress}
      >
        <LinearGradient colors={option.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.roleImageWrap}>
          <MaterialCommunityIcons name={option.icon} size={30} color="#FFFFFF" />
        </LinearGradient>
        <View style={styles.roleTextWrap}>
          <Text variant="titleMedium" style={styles.roleTitle}>{option.title}</Text>
          <Text variant="bodySmall" style={styles.roleSubtitle}>{option.subtitle}</Text>
        </View>
        <View style={styles.roleChevronWrap}>
          <MaterialCommunityIcons name="chevron-right" size={22} color={colors.textMuted} />
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function LoginScreen({ navigation }) {
  const { login, loginWithFirebase } = useAuth();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState('role'); // 'role' | 'credentials'
  const [role, setRole] = useState(null);
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

  const selectRole = (value) => {
    setServerError('');
    setRole(value);
    setStep('credentials');
  };

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

  const selectedOption = ROLE_OPTIONS.find((o) => o.value === role);

  if (step === 'role') {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, { paddingTop: insets.top + spacing.lg }]}
        >
          <Animated.View
            style={styles.heroLogoBadge}
            entering={FadeInDown.duration(420).easing(Easing.out(Easing.cubic))}
          >
            <Image source={require('../../../assets/logo.png')} style={styles.heroLogo} resizeMode="contain" />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(80).duration(420).easing(Easing.out(Easing.cubic))}>
            <Text variant="headlineMedium" style={styles.heroTitle}>Welcome back</Text>
            <Text variant="bodyMedium" style={styles.heroSubtitle}>
              Let&apos;s get you signed in the right way
            </Text>
          </Animated.View>
        </LinearGradient>

        <ScrollView contentContainerStyle={styles.roleSheet} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeIn.delay(150).duration(350)}>
            <Text variant="labelLarge" style={styles.sheetLabel}>CONTINUE AS</Text>
          </Animated.View>

          <RoleOption option={ROLE_OPTIONS[0]} delay={200} onPress={() => selectRole('candidate')} />
          <RoleOption option={ROLE_OPTIONS[1]} delay={280} onPress={() => selectRole('company')} />

          <Animated.View entering={FadeIn.delay(380).duration(350)} style={styles.footer}>
            <Text variant="bodyMedium">Don&apos;t have an account? </Text>
            <Button mode="text" compact onPress={() => navigation.navigate('Register')}>
              Register
            </Button>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.credHero, { paddingTop: insets.top + spacing.md }]}
      >
        <Pressable style={styles.backRow} onPress={() => setStep('role')} hitSlop={8}>
          <MaterialCommunityIcons name="chevron-left" size={22} color="#FFFFFF" />
          <Text variant="bodyMedium" style={styles.backText}>Change account type</Text>
        </Pressable>

        <View style={styles.credRoleRow}>
          <LinearGradient
            colors={selectedOption.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.credRoleBadge}
          >
            <MaterialCommunityIcons name={selectedOption.icon} size={22} color="#FFFFFF" />
          </LinearGradient>
          <View>
            <Text variant="headlineSmall" style={styles.credTitle}>Welcome back</Text>
            <Text variant="bodySmall" style={styles.credSubtitle}>{selectedOption.subtitle}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Animated.View entering={FadeInUp.duration(320).easing(Easing.out(Easing.cubic))} style={styles.formCard}>
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
        </Animated.View>

        <Animated.View entering={FadeIn.delay(150).duration(320)} style={styles.footer}>
          <Text variant="bodyMedium">Don&apos;t have an account? </Text>
          <Button mode="text" compact onPress={() => navigation.navigate('Register')}>
            Register
          </Button>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // Role-selection step
  hero: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    borderBottomLeftRadius: radius.lg * 1.4,
    borderBottomRightRadius: radius.lg * 1.4,
  },
  heroLogoBadge: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    ...shadows.raised,
  },
  heroLogo: { width: 44, height: 44 },
  heroTitle: { color: '#FFFFFF', fontWeight: '700' },
  heroSubtitle: { color: 'rgba(255,255,255,0.85)', marginTop: spacing.xs },
  roleSheet: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    marginTop: -spacing.xl,
  },
  sheetLabel: {
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.raised,
  },
  roleCardPressed: {
    transform: [{ scale: 0.98 }],
    backgroundColor: colors.background,
  },
  roleImageWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  roleTextWrap: { flex: 1 },
  roleTitle: { color: colors.text, fontWeight: '700' },
  roleSubtitle: { color: colors.textMuted, marginTop: 2 },
  roleChevronWrap: { marginLeft: spacing.xs },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg, marginBottom: spacing.xl, alignItems: 'center' },

  // Credentials step
  credHero: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
  },
  backRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md, alignSelf: 'flex-start' },
  backText: { color: 'rgba(255,255,255,0.9)', marginLeft: 2 },
  credRoleRow: { flexDirection: 'row', alignItems: 'center' },
  credRoleBadge: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  credTitle: { color: '#FFFFFF', fontWeight: '700' },
  credSubtitle: { color: 'rgba(255,255,255,0.85)', marginTop: 2 },

  container: { flexGrow: 1, padding: spacing.lg },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: -spacing.xl,
    ...shadows.card,
  },
  field: { marginBottom: spacing.xs },
  forgot: { alignSelf: 'flex-end', marginBottom: spacing.sm },
  serverError: { color: colors.error, marginBottom: spacing.md, textAlign: 'center' },
});
