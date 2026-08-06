import { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, HelperText, Chip, Avatar, IconButton } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { candidateApi } from '../../api/candidateApi';
import { taxonomyApi } from '../../api/taxonomyApi';
import { colors, spacing } from '../../theme/theme';

/** Editable fields mirror backend candidateController.js updateMyProfile allowedFields. */
export default function EditCandidateProfileScreen({ route, navigation }) {
  const { candidate } = route.params;
  const [skillsList, setSkillsList] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState(candidate.primarySkills || []);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [resumeName, setResumeName] = useState(candidate.resume ? 'Resume on file' : null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [profileImage, setProfileImage] = useState(candidate.profileImage || null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: candidate.name || '',
      headline: candidate.headline || '',
      about: candidate.about || '',
      hourlyRate: candidate.hourlyRate ? String(candidate.hourlyRate) : '',
      experience: candidate.experience ? String(candidate.experience) : '',
      github: candidate.github || '',
      linkedin: candidate.linkedin || '',
    },
  });

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

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.lg }}>
      <Text variant="headlineSmall" style={styles.title}>Edit profile</Text>

      <View style={styles.avatarBlock}>
        <View>
          <Avatar.Image
            size={88}
            source={profileImage ? { uri: profileImage } : require('../../../assets/icon.png')}
          />
          <IconButton
            icon="camera"
            size={18}
            mode="contained"
            containerColor={colors.primary}
            iconColor="#fff"
            style={styles.cameraBtn}
            onPress={pickImage}
            disabled={uploadingImage}
          />
        </View>
      </View>

      <View style={styles.resumeBlock}>
        <Text variant="labelLarge" style={styles.label}>Resume</Text>
        <Text variant="bodySmall" style={styles.resumeStatus}>
          {resumeName || 'No resume uploaded yet'}
        </Text>
        <Button
          mode="outlined"
          onPress={pickResume}
          loading={uploadingResume}
          disabled={uploadingResume}
          style={styles.resumeBtn}
        >
          {resumeName ? 'Update resume' : 'Upload resume'}
        </Button>
      </View>

      {['name', 'headline'].map((field) => (
        <Controller
          key={field}
          control={control}
          name={field}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              mode="outlined"
              label={field === 'name' ? 'Full name' : 'Headline'}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.field}
            />
          )}
        />
      ))}

      <Controller control={control} name="about" render={({ field: { onChange, onBlur, value } }) => (
        <TextInput mode="outlined" label="About" multiline numberOfLines={4} onBlur={onBlur} onChangeText={onChange} value={value} style={styles.field} />
      )} />

      <View style={styles.row}>
        <Controller control={control} name="hourlyRate" render={({ field: { onChange, onBlur, value } }) => (
          <TextInput mode="outlined" label="Hourly rate" keyboardType="numeric" onBlur={onBlur} onChangeText={onChange} value={value} style={styles.half} />
        )} />
        <Controller control={control} name="experience" render={({ field: { onChange, onBlur, value } }) => (
          <TextInput mode="outlined" label="Years experience" keyboardType="numeric" onBlur={onBlur} onChangeText={onChange} value={value} style={styles.half} />
        )} />
      </View>

      <Controller control={control} name="github" render={({ field: { onChange, onBlur, value } }) => (
        <TextInput mode="outlined" label="GitHub URL" autoCapitalize="none" onBlur={onBlur} onChangeText={onChange} value={value} style={styles.field} />
      )} />
      <Controller control={control} name="linkedin" render={({ field: { onChange, onBlur, value } }) => (
        <TextInput mode="outlined" label="LinkedIn URL" autoCapitalize="none" onBlur={onBlur} onChangeText={onChange} value={value} style={styles.field} />
      )} />

      {!!skillsList.length && (
        <>
          <Text variant="labelLarge" style={styles.label}>Primary skills</Text>
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
        </>
      )}

      {!!error && <HelperText type="error" visible>{error}</HelperText>}

      <Button mode="contained" onPress={handleSubmit(onSubmit)} loading={submitting} disabled={submitting} style={{ marginTop: spacing.lg }}>
        Save changes
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { color: colors.text, fontWeight: '700', marginBottom: spacing.lg },
  avatarBlock: { alignItems: 'center', marginBottom: spacing.lg },
  cameraBtn: { position: 'absolute', bottom: -6, right: -6, margin: 0 },
  resumeBlock: { backgroundColor: colors.surface, borderRadius: 12, padding: spacing.md, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.border },
  resumeStatus: { color: colors.textMuted, marginBottom: spacing.sm },
  resumeBtn: { alignSelf: 'flex-start' },
  field: { marginBottom: spacing.md, backgroundColor: colors.surface },
  label: { color: colors.text, marginBottom: spacing.sm },
  row: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  half: { flex: 1, backgroundColor: colors.surface },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: { marginRight: spacing.xs, marginBottom: spacing.xs },
});
