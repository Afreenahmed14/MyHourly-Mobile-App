import { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Platform, KeyboardAvoidingView, TextInput as RNTextInput } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import { companyApi } from '../../api/companyApi';
import Card from '../../components/Card';
import SafeAvatar from '../../components/SafeAvatar';
import { colors, spacing, radius } from '../../theme/theme';

// Same sectioned-card visual language as EditCandidateProfileScreen, so
// both roles' edit-profile screens read as one consistent design system.
function Field({ label, required, children }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        {label} {required ? <Text style={styles.required}>*</Text> : null}
      </Text>
      {children}
    </View>
  );
}

function LabeledInput({ value, onChangeText, onBlur, placeholder, multiline, numberOfLines, keyboardType, autoCapitalize }) {
  return (
    <RNTextInput
      value={value}
      onChangeText={onChangeText}
      onBlur={onBlur}
      placeholder={placeholder}
      multiline={multiline}
      numberOfLines={numberOfLines}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      placeholderTextColor={colors.textMuted}
      style={[styles.input, multiline && styles.textArea]}
    />
  );
}

/** Editable fields mirror backend companyController.js updateMyProfile allowedFields. */
export default function EditCompanyProfileScreen({ route, navigation }) {
  const { company } = route.params;
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [logo, setLogo] = useState(company.logo || null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      companyName: company.companyName || '',
      website: company.website || '',
      industry: company.industry || '',
      description: company.description || '',
      contactPerson: company.contactPerson || '',
    },
  });

  const pickLogo = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (result.canceled) return;

    const asset = result.assets[0];
    const formData = new FormData();
    formData.append('logo', { uri: asset.uri, name: 'logo.jpg', type: 'image/jpeg' });

    setUploadingLogo(true);
    try {
      await companyApi.uploadLogo(formData);
      setLogo(asset.uri);
    } finally {
      setUploadingLogo(false);
    }
  };

  // Companies use a real logo only — no separate avatar (that's a
  // candidate-only concept for their home page), so no picker here.

  const removeLogo = async () => {
    setUploadingLogo(true);
    try {
      await companyApi.updateMyProfile({ logo: null });
      setLogo(null);
    } finally {
      setUploadingLogo(false);
    }
  };

  const onSubmit = async (values) => {
    setError('');
    setSubmitting(true);
    try {
      await companyApi.updateMyProfile(values);
      navigation.goBack();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.pageTitle}>Edit Company Profile</Text>
        <Text style={styles.pageSubtitle}>
          A complete company profile builds trust with candidates browsing your job posts.
        </Text>

        <Card>
          <Text style={styles.sectionTitle}>Logo</Text>
          <View style={styles.photoRow}>
            <TouchableOpacity style={styles.avatarTouchable} onPress={pickLogo} disabled={uploadingLogo}>
              <SafeAvatar
                uri={logo}
                size={64}
                label={company.companyName}
                style={styles.avatarImage}
              />
              {uploadingLogo && (
                <View style={styles.avatarOverlay}>
                  <ActivityIndicator color="#fff" size="small" />
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.photoButtonsWrap}>
              <TouchableOpacity style={styles.pillBtn} onPress={pickLogo} disabled={uploadingLogo}>
                <Ionicons name="image-outline" size={14} color={colors.text} />
                <Text style={styles.pillBtnText}>Change Logo</Text>
              </TouchableOpacity>
              {logo && (
                <TouchableOpacity style={styles.pillBtn} onPress={removeLogo} disabled={uploadingLogo}>
                  <Ionicons name="trash-outline" size={14} color={colors.error} />
                  <Text style={[styles.pillBtnText, { color: colors.error }]}>Remove</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Company info</Text>

          <Controller control={control} name="companyName" render={({ field: { onChange, onBlur, value } }) => (
            <Field label="Company name" required>
              <LabeledInput value={value} onChangeText={onChange} onBlur={onBlur} placeholder="Your company name" />
            </Field>
          )} />

          <Controller control={control} name="website" render={({ field: { onChange, onBlur, value } }) => (
            <Field label="Website">
              <LabeledInput value={value} onChangeText={onChange} onBlur={onBlur} placeholder="https://yourcompany.com" autoCapitalize="none" />
            </Field>
          )} />

          <Controller control={control} name="industry" render={({ field: { onChange, onBlur, value } }) => (
            <Field label="Industry">
              <LabeledInput value={value} onChangeText={onChange} onBlur={onBlur} placeholder="e.g. Fintech, Healthcare" />
            </Field>
          )} />

          <Controller control={control} name="contactPerson" render={({ field: { onChange, onBlur, value } }) => (
            <Field label="Contact person">
              <LabeledInput value={value} onChangeText={onChange} onBlur={onBlur} placeholder="Who should candidates reach out to?" />
            </Field>
          )} />

          <Controller control={control} name="description" render={({ field: { onChange, onBlur, value } }) => (
            <Field label="Description">
              <LabeledInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Tell candidates about your company"
                multiline
                numberOfLines={4}
              />
            </Field>
          )} />
        </Card>

        {!!error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit(onSubmit)} disabled={submitting}>
          {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Save Changes</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  pageTitle: { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: 4 },
  pageSubtitle: { fontSize: 12, color: colors.textMuted, marginBottom: spacing.lg },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },

  photoRow: { flexDirection: 'row', alignItems: 'center' },
  avatarTouchable: { marginRight: spacing.md },
  avatarImage: { width: 64, height: 64, borderRadius: 16 },
  avatarPlaceholder: {
    width: 64, height: 64, borderRadius: 16, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarPlaceholderText: { color: '#fff', fontWeight: '700', fontSize: 22 },
  avatarOverlay: {
    ...StyleSheet.absoluteFillObject, borderRadius: 16,
    backgroundColor: 'rgba(15,23,42,0.45)', alignItems: 'center', justifyContent: 'center',
  },
  photoButtonsWrap: { flexDirection: 'row', flexWrap: 'wrap', flexShrink: 1, flex: 1 },

  pillBtn: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs + 2,
    marginRight: spacing.xs, marginBottom: spacing.xs,
  },
  pillBtnText: { fontSize: 12, fontWeight: '600', color: colors.text, marginLeft: 6 },

  field: { marginBottom: spacing.lg },
  label: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: spacing.xs },
  required: { color: colors.error },
  input: {
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
    paddingHorizontal: spacing.md, paddingVertical: 10, fontSize: 14,
    color: colors.text, backgroundColor: colors.surface,
  },
  textArea: { minHeight: 90, textAlignVertical: 'top' },
  errorText: { color: colors.error, fontSize: 12, marginTop: 4, marginBottom: spacing.sm },

  saveBtn: {
    backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: 14,
    alignItems: 'center', marginTop: spacing.sm,
  },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
