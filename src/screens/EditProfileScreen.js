import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import Card from '../components/Card';
import ChipSelector from '../components/ChipSelector';
import { useProfile } from '../context/ProfileContext';
import { DEVELOPER_TYPES, SKILLS, LANGUAGES, COUNTRIES, AVAILABILITY, VISIBILITY } from '../data/options';
import { colors } from '../theme';
import styles from '../styles/EditProfileScreen.styles';

function Field({ label, required, children, error }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        {label} {required ? <Text style={styles.required}>*</Text> : null}
      </Text>
      {children}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

function PickerField({ label, required, selectedValue, onValueChange, options, placeholder }) {
  return (
    <Field label={label} required={required}>
      <View style={styles.pickerBox}>
        <Picker selectedValue={selectedValue} onValueChange={onValueChange}>
          <Picker.Item label={placeholder || 'Select...'} value="" color={colors.textMuted} />
          {options.map((opt) => (
            <Picker.Item key={opt} label={opt} value={opt} />
          ))}
        </Picker>
      </View>
    </Field>
  );
}

export default function EditProfileScreen({ navigation }) {
  const { profile, updateProfile } = useProfile();
  const [form, setForm] = useState(profile);
  const [errors, setErrors] = useState({});

  const set = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }));

  // ---- Photo & Resume handlers ----
  const handleChangePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Allow photo library access to choose a profile photo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      set('photoUri')(result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Allow camera access to take a profile photo.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      set('photoUri')(result.assets[0].uri);
    }
  };

  const handlePickResume = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ],
      copyToCacheDirectory: true,
    });
    if (!result.canceled && result.assets?.[0]) {
      setForm((prev) => ({
        ...prev,
        resumeName: result.assets[0].name,
        resumeUri: result.assets[0].uri,
      }));
    }
  };

  const validate = () => {
    const next = {};
    if (!form.headline) next.headline = 'Headline is required';
    if (!form.about) next.about = 'About is required';
    if (!form.chargePerHour) next.chargePerHour = 'Charge per hour is required';
    if (!form.developerType) next.developerType = 'Select a developer type';
    if (form.primarySkills.length === 0) next.primarySkills = 'Pick at least one primary skill';
    if (form.secondarySkills.length === 0) next.secondarySkills = 'Pick at least one secondary skill';
    if (form.languages.length === 0) next.languages = 'Pick at least one language';
    if (!form.portfolioLinks) next.portfolioLinks = 'Portfolio links required';
    if (!form.githubUrl) next.githubUrl = 'GitHub URL required';
    if (!form.linkedinUrl) next.linkedinUrl = 'LinkedIn URL required';
    if (!form.country) next.country = 'Select a country';
    if (!form.resumeName) next.resume = 'Resume is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      Alert.alert('Missing information', 'Please fill in all required fields.');
      return;
    }
    // Mock save — swap this for a real API call (e.g. PUT /candidate/profile) later.
    updateProfile(form);
    Alert.alert('Saved', 'Your profile has been updated.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.pageTitle}>Edit Profile</Text>
        <Text style={styles.pageSubtitle}>
          Every field on this page is required — a complete profile is shown higher in search and gets more hires.
        </Text>

        <Card>
          <Text style={styles.sectionTitle}>Photo & Resume</Text>

          <View style={styles.photoRow}>
            <TouchableOpacity style={styles.avatarTouchable} onPress={handleChangePhoto}>
              {form.photoUri ? (
                <Image source={{ uri: form.photoUri }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{form.name?.charAt(0) || 'S'}</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.photoButtonsWrap}>
              <TouchableOpacity style={styles.pillBtn} onPress={handleChangePhoto}>
                <Ionicons name="image-outline" size={14} color={colors.text} />
                <Text style={styles.pillBtnText}>Change Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.pillBtn} onPress={handleTakePhoto}>
                <Ionicons name="camera-outline" size={14} color={colors.text} />
                <Text style={styles.pillBtnText}>Take Photo</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.resumeRow}>
            <Text style={styles.resumeStatusText} numberOfLines={1}>
              {form.resumeName ? form.resumeName : 'No resume uploaded'}
            </Text>
            <TouchableOpacity style={styles.pillBtn} onPress={handlePickResume}>
              <Ionicons name="cloud-upload-outline" size={14} color={colors.text} />
              <Text style={styles.pillBtnText}>Upload Resume</Text>
            </TouchableOpacity>
            {!form.resumeName && <Text style={styles.requiredText}>Required</Text>}
          </View>
        </Card>

        <Card>
          <Field label="Name" required>
            <TextInput style={styles.input} value={form.name} onChangeText={set('name')} placeholder="Your full name" />
          </Field>

          <Field label="Headline" required error={errors.headline}>
            <TextInput
              style={styles.input}
              value={form.headline}
              onChangeText={set('headline')}
              placeholder="e.g. Full Stack MERN Developer"
            />
          </Field>

          <Field label="Phone Number">
            <TextInput
              style={styles.input}
              value={form.phone}
              onChangeText={set('phone')}
              placeholder="+91 00000 00000"
              keyboardType="phone-pad"
            />
          </Field>

          <Field label="About" required error={errors.about}>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={form.about}
              onChangeText={set('about')}
              placeholder="Tell companies about yourself"
              multiline
              numberOfLines={4}
            />
          </Field>

          <View style={styles.row}>
            <View style={styles.rowItem}>
              <Field label="Charge / Hour (₹)" required error={errors.chargePerHour}>
                <TextInput
                  style={styles.input}
                  value={form.chargePerHour}
                  onChangeText={set('chargePerHour')}
                  placeholder="0"
                  keyboardType="numeric"
                />
              </Field>
            </View>
            <View style={styles.rowItem}>
              <Field label="Exp. (Years)" required>
                <TextInput
                  style={styles.input}
                  value={form.experienceYears}
                  onChangeText={set('experienceYears')}
                  keyboardType="numeric"
                />
              </Field>
            </View>
            <View style={styles.rowItem}>
              <Field label="Exp. (Months)">
                <TextInput
                  style={styles.input}
                  value={form.experienceMonths}
                  onChangeText={set('experienceMonths')}
                  keyboardType="numeric"
                />
              </Field>
            </View>
          </View>

          <PickerField
            label="Availability"
            required
            selectedValue={form.availability}
            onValueChange={set('availability')}
            options={AVAILABILITY}
          />
          <PickerField
            label="Developer Type"
            required
            selectedValue={form.developerType}
            onValueChange={set('developerType')}
            options={DEVELOPER_TYPES}
            placeholder="Select a developer type..."
          />

          <ChipSelector
            label="Primary Skills"
            required
            options={SKILLS}
            selected={form.primarySkills}
            onChange={set('primarySkills')}
            error={errors.primarySkills}
          />
          <ChipSelector
            label="Secondary Skills"
            required
            options={SKILLS}
            selected={form.secondarySkills}
            onChange={set('secondarySkills')}
            error={errors.secondarySkills}
          />
          <ChipSelector
            label="Speaking Languages"
            required
            options={LANGUAGES}
            selected={form.languages}
            onChange={set('languages')}
            error={errors.languages}
          />

          <Field label="Portfolio Links (comma-separated)" required error={errors.portfolioLinks}>
            <TextInput
              style={styles.input}
              value={form.portfolioLinks}
              onChangeText={set('portfolioLinks')}
              placeholder="https://..., https://..."
              autoCapitalize="none"
            />
          </Field>

          <Field label="GitHub URL" required error={errors.githubUrl}>
            <TextInput
              style={styles.input}
              value={form.githubUrl}
              onChangeText={set('githubUrl')}
              placeholder="https://github.com/username"
              autoCapitalize="none"
            />
          </Field>

          <Field label="LinkedIn URL" required error={errors.linkedinUrl}>
            <TextInput
              style={styles.input}
              value={form.linkedinUrl}
              onChangeText={set('linkedinUrl')}
              placeholder="https://linkedin.com/in/username"
              autoCapitalize="none"
            />
          </Field>

          <PickerField
            label="Country"
            required
            selectedValue={form.country}
            onValueChange={set('country')}
            options={COUNTRIES}
            placeholder="Select a country..."
          />

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Available for remote work</Text>
            <Switch value={form.remoteAvailable} onValueChange={set('remoteAvailable')} trackColor={{ true: colors.primary }} />
          </View>

          <PickerField
            label="Profile Visibility"
            required
            selectedValue={form.visibility}
            onValueChange={set('visibility')}
            options={VISIBILITY}
          />
        </Card>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
