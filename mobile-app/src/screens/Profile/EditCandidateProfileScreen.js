import { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Image, TouchableOpacity, Platform, KeyboardAvoidingView, TextInput as RNTextInput } from 'react-native';
import { Text, Chip, ActivityIndicator } from 'react-native-paper';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { candidateApi } from '../../api/candidateApi';
import { taxonomyApi } from '../../api/taxonomyApi';
import { useAuth } from '../../context/useAuth';
import Card from '../../components/Card';
import SafeAvatar from '../../components/SafeAvatar';
import LoadingView from '../../components/LoadingView';
import { colors, spacing, radius } from '../../theme/theme';

/**
 * Layout modeled on the reference edit-profile screen (labeled fields
 * grouped into bordered "Card" sections, pill-style secondary buttons,
 * a full-width save button) — rebuilt here against this app's real
 * candidateController.js-backed fields, image/resume upload flow, and
 * the illustrated home-page avatar builder, none of which exist in the
 * reference.
 */
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

/** Editable fields mirror backend candidateController.js updateMyProfile allowedFields. */
export default function EditCandidateProfileScreen({ route, navigation }) {
  const { refreshUser } = useAuth();
  // `candidate` is normally handed in via route.params by whoever opened
  // this screen (HomeScreen, CandidateProfileScreen, ...). But it can
  // legitimately be missing — a deep link straight into this screen, a
  // stale nav state surviving a Fast Refresh, navigation.navigate() being
  // called without the params object, etc. Previously that made every
  // `candidate.foo` below throw "Cannot read property 'foo' of
  // undefined" on mount. Fall back to fetching our own profile instead
  // of crashing.
  const paramCandidate = route.params?.candidate;
  const [candidate, setCandidate] = useState(paramCandidate || null);
  const [loadingCandidate, setLoadingCandidate] = useState(!paramCandidate);
  const [loadError, setLoadError] = useState('');

  const [skillsList, setSkillsList] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState(paramCandidate?.primarySkills || []);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [resumeName, setResumeName] = useState(paramCandidate?.resume ? 'Resume on file' : null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [profileImage, setProfileImage] = useState(paramCandidate?.profileImage || null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [avatarImage, setAvatarImage] = useState(paramCandidate?.avatarImage || null);
  const [avatarChoices, setAvatarChoices] = useState(paramCandidate?.avatarChoices || null);
  const [avatarFailed, setAvatarFailed] = useState(false);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: paramCandidate?.name || '',
      headline: paramCandidate?.headline || '',
      about: paramCandidate?.about || '',
      hourlyRate: paramCandidate?.hourlyRate ? String(paramCandidate.hourlyRate) : '',
      experience: paramCandidate?.experience ? String(paramCandidate.experience) : '',
      github: paramCandidate?.github || '',
      linkedin: paramCandidate?.linkedin || '',
    },
  });

  // Only runs when we weren't handed a candidate up front (see above).
  useEffect(() => {
    if (paramCandidate) return;
    (async () => {
      try {
        const res = await candidateApi.getMyProfile();
        const fetched = res.data.data.candidate;
        setCandidate(fetched);
        setSelectedSkills(fetched.primarySkills || []);
        setResumeName(fetched.resume ? 'Resume on file' : null);
        setProfileImage(fetched.profileImage || null);
        setAvatarImage(fetched.avatarImage || null);
        setAvatarChoices(fetched.avatarChoices || null);
        reset({
          name: fetched.name || '',
          headline: fetched.headline || '',
          about: fetched.about || '',
          hourlyRate: fetched.hourlyRate ? String(fetched.hourlyRate) : '',
          experience: fetched.experience ? String(fetched.experience) : '',
          github: fetched.github || '',
          linkedin: fetched.linkedin || '',
        });
      } catch (err) {
        setLoadError(err?.response?.data?.message || 'Could not load your profile.');
      } finally {
        setLoadingCandidate(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await taxonomyApi.getSkills();
        setSkillsList(res.data.data.skills);
      } catch {
        // Non-critical — form still usable without the suggested list.
      }
    })();
  }, []);

  const toggleSkill = (name) => {
    setSelectedSkills((prev) => (prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]));
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Allow photo library access to choose a profile photo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (result.canceled) return;

    const asset = result.assets[0];
    const formData = new FormData();
    formData.append('image', {
      uri: asset.uri,
      name: 'profile.jpg',
      type: 'image/jpeg',
    });

    setUploadingImage(true);
    try {
      await candidateApi.uploadProfileImage(formData);
      setProfileImage(asset.uri);
    } finally {
      setUploadingImage(false);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Allow camera access to take a profile photo.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (result.canceled) return;

    const asset = result.assets[0];
    const formData = new FormData();
    formData.append('image', { uri: asset.uri, name: 'profile.jpg', type: 'image/jpeg' });

    setUploadingImage(true);
    try {
      await candidateApi.uploadProfileImage(formData);
      setProfileImage(asset.uri);
    } finally {
      setUploadingImage(false);
    }
  };

  // Illustrated Bitmoji-style avatar built in the AvatarBuilder screen.
  // The builder can't hand us a callback (functions aren't valid nav
  // params — see the "non-serializable values" warning), so instead it
  // navigates back here with a plain `avatarResult` param, and this
  // effect picks it up, saves it, then clears the param so it doesn't
  // re-fire on the next re-render or back-navigation.
  useEffect(() => {
    const result = route.params?.avatarResult;
    if (!result) return;
    (async () => {
      try {
        await candidateApi.updateMyProfile({ avatarImage: result.url, avatarChoices: result.choices });
        setAvatarImage(result.url);
        setAvatarChoices(result.choices);
        setAvatarFailed(false);
        refreshUser?.();
        navigation.setParams({ avatarResult: undefined });
        navigation.navigate('CandidateProfile');
        return;
      } catch (err) {
        Alert.alert('Could not save avatar', err?.response?.data?.message || err?.message || 'Please try again.');
      }
      navigation.setParams({ avatarResult: undefined });
    })();
  }, [route.params?.avatarResult]);

  const removeAvatar = async () => {
    try {
      await candidateApi.updateMyProfile({ avatarImage: null, avatarChoices: null });
      setAvatarImage(null);
      setAvatarChoices(null);
    } catch (err) {
      Alert.alert('Could not remove avatar', err?.response?.data?.message || err?.message || 'Please try again.');
    }
  };

  const removeImage = async () => {
    setUploadingImage(true);
    try {
      await candidateApi.updateMyProfile({ profileImage: null });
      setProfileImage(null);
    } finally {
      setUploadingImage(false);
    }
  };

  const pickResume = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    });
    if (result.canceled) return;

    const asset = result.assets[0];
    const formData = new FormData();
    formData.append('resume', {
      uri: asset.uri,
      name: asset.name,
      type: asset.mimeType || 'application/pdf',
    });

    setUploadingResume(true);
    try {
      await candidateApi.uploadResume(formData);
      setResumeName(asset.name);
    } finally {
      setUploadingResume(false);
    }
  };

  const onSubmit = async (values) => {
    setError('');
    setSubmitting(true);
    try {
      await candidateApi.updateMyProfile({
        ...values,
        hourlyRate: values.hourlyRate ? Number(values.hourlyRate) : undefined,
        experience: values.experience ? Number(values.experience) : undefined,
        primarySkills: selectedSkills,
      });
      navigation.goBack();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingCandidate) return <LoadingView />;
  if (!candidate) {
    return (
      <View style={styles.errorState}>
        <Text style={styles.errorStateText}>{loadError || 'Could not load your profile.'}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.pageTitle}>Edit Profile</Text>
        <Text style={styles.pageSubtitle}>
          A complete profile — photo, resume, and skills — shows up higher in company search results.
        </Text>

        <Card>
          <Text style={styles.sectionTitle}>Photo & Resume</Text>

          <View style={styles.photoRow}>
            <TouchableOpacity style={styles.avatarTouchable} onPress={pickImage} disabled={uploadingImage}>
              <SafeAvatar
                uri={profileImage}
                size={64}
                label={candidate.name}
                style={styles.avatarImage}
              />
              {uploadingImage && (
                <View style={styles.avatarOverlay}>
                  <ActivityIndicator color="#fff" size="small" />
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.photoButtonsWrap}>
              <TouchableOpacity style={styles.pillBtn} onPress={pickImage} disabled={uploadingImage}>
                <Ionicons name="image-outline" size={14} color={colors.text} />
                <Text style={styles.pillBtnText}>Change Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.pillBtn} onPress={takePhoto} disabled={uploadingImage}>
                <Ionicons name="camera-outline" size={14} color={colors.text} />
                <Text style={styles.pillBtnText}>Take Photo</Text>
              </TouchableOpacity>

              {profileImage && (
                <TouchableOpacity style={styles.pillBtn} onPress={removeImage} disabled={uploadingImage}>
                  <Ionicons name="trash-outline" size={14} color={colors.error} />
                  <Text style={[styles.pillBtnText, { color: colors.error }]}>Remove</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.resumeRow}>
            <Text style={styles.resumeStatusText} numberOfLines={1}>
              {resumeName || 'No resume uploaded'}
            </Text>
            <TouchableOpacity style={styles.pillBtn} onPress={pickResume} disabled={uploadingResume}>
              {uploadingResume ? (
                <ActivityIndicator size="small" color={colors.text} />
              ) : (
                <Ionicons name="cloud-upload-outline" size={14} color={colors.text} />
              )}
              <Text style={styles.pillBtnText}>{resumeName ? 'Update Resume' : 'Upload Resume'}</Text>
            </TouchableOpacity>
            {!resumeName && <Text style={styles.requiredText}>Recommended</Text>}
          </View>
        </Card>

        <Card>
          <View style={styles.avatarSectionRow}>
            <View style={styles.avatarBubble}>
              {avatarImage && !avatarFailed ? (
                <Image source={{ uri: avatarImage }} style={styles.avatarBubbleImg} onError={() => setAvatarFailed(true)} />
              ) : (
                <MaterialCommunityIcons name="emoticon-outline" size={26} color={colors.textMuted} />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Home page avatar</Text>
              <Text style={styles.avatarSubtitle}>Optional illustrated avatar shown on your home page</Text>
            </View>
            <View style={{ alignItems: 'flex-end', gap: spacing.xs }}>
              <TouchableOpacity
                style={styles.pillBtn}
                onPress={() => navigation.navigate('AvatarBuilder', { initialChoices: avatarChoices, returnScreen: 'EditCandidateProfile' })}
              >
                <Text style={styles.pillBtnText}>{avatarImage ? 'Edit' : 'Build'}</Text>
              </TouchableOpacity>
              {avatarImage && (
                <TouchableOpacity onPress={removeAvatar}>
                  <Text style={styles.removeAvatarText}>Remove</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Personal info</Text>

          <Controller control={control} name="name" render={({ field: { onChange, onBlur, value } }) => (
            <Field label="Full name" required>
              <LabeledInput value={value} onChangeText={onChange} onBlur={onBlur} placeholder="Your full name" />
            </Field>
          )} />

          <Controller control={control} name="headline" render={({ field: { onChange, onBlur, value } }) => (
            <Field label="Headline" required>
              <LabeledInput value={value} onChangeText={onChange} onBlur={onBlur} placeholder="e.g. Full Stack MERN Developer" />
            </Field>
          )} />

          <Controller control={control} name="about" render={({ field: { onChange, onBlur, value } }) => (
            <Field label="About">
              <LabeledInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Tell companies about yourself"
                multiline
                numberOfLines={4}
              />
            </Field>
          )} />

          <View style={styles.row}>
            <View style={styles.rowItem}>
              <Controller control={control} name="hourlyRate" render={({ field: { onChange, onBlur, value } }) => (
                <Field label="Hourly rate">
                  <LabeledInput value={value} onChangeText={onChange} onBlur={onBlur} placeholder="0" keyboardType="numeric" />
                </Field>
              )} />
            </View>
            <View style={[styles.rowItem, { marginRight: 0 }]}>
              <Controller control={control} name="experience" render={({ field: { onChange, onBlur, value } }) => (
                <Field label="Years experience">
                  <LabeledInput value={value} onChangeText={onChange} onBlur={onBlur} placeholder="0" keyboardType="numeric" />
                </Field>
              )} />
            </View>
          </View>

          <Controller control={control} name="github" render={({ field: { onChange, onBlur, value } }) => (
            <Field label="GitHub URL">
              <LabeledInput value={value} onChangeText={onChange} onBlur={onBlur} placeholder="https://github.com/username" autoCapitalize="none" />
            </Field>
          )} />

          <Controller control={control} name="linkedin" render={({ field: { onChange, onBlur, value } }) => (
            <Field label="LinkedIn URL">
              <LabeledInput value={value} onChangeText={onChange} onBlur={onBlur} placeholder="https://linkedin.com/in/username" autoCapitalize="none" />
            </Field>
          )} />

          {!!skillsList.length && (
            <Field label="Primary skills">
              <View style={styles.chipRow}>
                {skillsList.map((s) => (
                  <Chip
                    key={s._id}
                    selected={selectedSkills.includes(s.name)}
                    mode={selectedSkills.includes(s.name) ? 'flat' : 'outlined'}
                    onPress={() => toggleSkill(s.name)}
                    style={styles.chip}
                  >
                    {s.name}
                  </Chip>
                ))}
              </View>
            </Field>
          )}
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
  errorState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  errorStateText: { color: colors.textMuted, textAlign: 'center' },
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  pageTitle: { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: 4 },
  pageSubtitle: { fontSize: 12, color: colors.textMuted, marginBottom: spacing.lg },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },

  photoRow: { flexDirection: 'row', alignItems: 'center' },
  avatarTouchable: { marginRight: spacing.md },
  avatarImage: { width: 64, height: 64, borderRadius: 32 },
  avatarPlaceholder: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarPlaceholderText: { color: '#fff', fontWeight: '700', fontSize: 22 },
  avatarOverlay: {
    ...StyleSheet.absoluteFillObject, borderRadius: 32,
    backgroundColor: 'rgba(15,23,42,0.45)', alignItems: 'center', justifyContent: 'center',
  },
  photoButtonsWrap: { flexDirection: 'row', flexWrap: 'wrap', flexShrink: 1, flex: 1 },

  resumeRow: {
    flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap',
    marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border,
  },
  resumeStatusText: { fontSize: 13, color: colors.textMuted, marginRight: spacing.sm, flexShrink: 1 },
  requiredText: { fontSize: 12, color: colors.secondary, fontWeight: '600', marginLeft: spacing.sm },

  pillBtn: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs + 2,
    marginRight: spacing.xs, marginBottom: spacing.xs,
  },
  pillBtnText: { fontSize: 12, fontWeight: '600', color: colors.text, marginLeft: 6 },

  avatarSectionRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatarBubble: {
    width: 52, height: 52, borderRadius: 26, overflow: 'hidden', backgroundColor: colors.background,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border,
  },
  avatarBubbleImg: { width: '100%', height: '100%' },
  avatarSubtitle: { fontSize: 11, color: colors.textMuted },
  removeAvatarText: { color: colors.textMuted, fontSize: 11, fontWeight: '600' },

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

  row: { flexDirection: 'row' },
  rowItem: { flex: 1, marginRight: spacing.sm },

  chipRow: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: { marginRight: spacing.xs, marginBottom: spacing.xs },

  saveBtn: {
    backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: 14,
    alignItems: 'center', marginTop: spacing.sm,
  },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
