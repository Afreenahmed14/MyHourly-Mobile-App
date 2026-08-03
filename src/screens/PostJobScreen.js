import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useJobs } from '../context/JobsContext';
import { JOB_TYPES, JOB_DEVELOPER_TYPES, PAY_BASIS, COUNTRIES } from '../data/options';
import { colors } from '../theme';
import styles from '../styles/PostJobScreen.styles';

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

function PickerField({ label, required, selectedValue, onValueChange, options, placeholder, error, hidePlaceholder }) {
  return (
    <Field label={label} required={required} error={error}>
      <View style={styles.pickerBox}>
        <Picker selectedValue={selectedValue} onValueChange={onValueChange}>
          {!hidePlaceholder && (
            <Picker.Item label={placeholder || 'Select...'} value="" color={colors.textMuted} />
          )}
          {options.map((opt) => (
            <Picker.Item key={opt} label={opt} value={opt} />
          ))}
        </Picker>
      </View>
    </Field>
  );
}

const EMPTY_FORM = {
  title: '',
  description: '',
  jobType: JOB_TYPES[0],
  developerType: '',
  skillsText: '',
  minExperience: '',
  maxExperience: '',
  payBasis: PAY_BASIS[0],
  minPay: '',
  maxPay: '',
  country: '',
  remoteFriendly: false,
  openings: '1',
};

export default function PostJobScreen({ navigation, route }) {
  const { postJob, updateJob, getJobById } = useJobs();
  const jobId = route?.params?.jobId;
  const existingJob = jobId ? getJobById(jobId) : null;
  const isEdit = !!existingJob;

  const [form, setForm] = useState(
    existingJob
      ? {
          title: existingJob.title || '',
          description: existingJob.description || '',
          jobType: existingJob.jobType || JOB_TYPES[0],
          developerType: existingJob.developerType || '',
          skillsText: (existingJob.skills || []).join(', '),
          minExperience: existingJob.minExperience || '',
          maxExperience: existingJob.maxExperience || '',
          payBasis: existingJob.payBasis || PAY_BASIS[0],
          minPay: existingJob.minPay || '',
          maxPay: existingJob.maxPay || '',
          country: existingJob.country || '',
          remoteFriendly: !!existingJob.remoteFriendly,
          openings: existingJob.openings ? String(existingJob.openings) : '1',
        }
      : EMPTY_FORM
  );
  const [errors, setErrors] = useState({});

  const set = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    const next = {};
    if (!form.title) next.title = 'Job title is required';
    if (!form.description) next.description = 'Description is required';
    if (!form.developerType) next.developerType = 'Select a developer type';
    if (!form.skillsText) next.skillsText = 'Add at least one skill';
    if (!form.country) next.country = 'Select a country';
    if (!form.openings || Number(form.openings) < 1) next.openings = 'Enter a valid number of openings';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      Alert.alert('Missing information', 'Please fill in all required fields.');
      return;
    }

    const jobData = {
      title: form.title,
      description: form.description,
      jobType: form.jobType,
      developerType: form.developerType,
      skills: form.skillsText.split(',').map((s) => s.trim()).filter(Boolean),
      minExperience: form.minExperience,
      maxExperience: form.maxExperience,
      payBasis: form.payBasis,
      minPay: form.minPay,
      maxPay: form.maxPay,
      country: form.country,
      remoteFriendly: form.remoteFriendly,
      openings: Number(form.openings),
    };

    if (isEdit) {
      // Mock update — swap for a real API call (e.g. PUT /api/company/jobs/:id) later.
      updateJob(jobId, jobData);
      Alert.alert('Saved', 'Your job posting has been updated.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else {
      // Mock post — swap for a real API call (e.g. POST /api/company/jobs) later.
      postJob(jobData);
      Alert.alert('Job posted', 'Your job is now live for engineers to apply.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>{isEdit ? 'EDIT JOB POSTING' : 'NEW JOB POSTING'}</Text>
        <Text style={styles.pageTitle}>{isEdit ? 'Edit Job' : 'Post a New Job'}</Text>
        <Text style={styles.pageSubtitle}>
          {isEdit
            ? 'Update the details below to keep this role accurate.'
            : 'Fill in the details below to get this role in front of qualified candidates.'}
        </Text>

        <View style={styles.formCard}>
          <Text style={[styles.sectionLabel, styles.sectionLabelFirst]}>ROLE BASICS</Text>

          <Field label="Job title" required error={errors.title}>
            <TextInput
              style={styles.input}
              value={form.title}
              onChangeText={set('title')}
              placeholder="e.g. Senior Frontend Engineer"
            />
          </Field>

          <Field label="Description" required error={errors.description}>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={form.description}
              onChangeText={set('description')}
              placeholder="Describe the role, responsibilities, and what makes this opportunity a great fit..."
              multiline
              numberOfLines={4}
            />
          </Field>

          <View style={styles.row}>
            <View style={styles.rowItem}>
              <PickerField
                label="Job type"
                selectedValue={form.jobType}
                onValueChange={set('jobType')}
                options={JOB_TYPES}
                hidePlaceholder
              />
            </View>
            <View style={styles.rowItem}>
              <PickerField
                label="Developer type"
                required
                selectedValue={form.developerType}
                onValueChange={set('developerType')}
                options={JOB_DEVELOPER_TYPES}
                placeholder="Select..."
                error={errors.developerType}
              />
            </View>
          </View>

          <Field label="Skills (comma-separated)" required error={errors.skillsText}>
            <TextInput
              style={styles.input}
              value={form.skillsText}
              onChangeText={set('skillsText')}
              placeholder="React, Node.js, MongoDB"
            />
          </Field>

          <View style={styles.row}>
            <View style={styles.rowItem}>
              <Field label="Min experience (years)">
                <TextInput
                  style={styles.input}
                  value={form.minExperience}
                  onChangeText={set('minExperience')}
                  keyboardType="numeric"
                />
              </Field>
            </View>
            <View style={styles.rowItem}>
              <Field label="Max experience (years)">
                <TextInput
                  style={styles.input}
                  value={form.maxExperience}
                  onChangeText={set('maxExperience')}
                  keyboardType="numeric"
                />
              </Field>
            </View>
          </View>

          <View style={styles.sectionDivider} />
          <Text style={[styles.sectionLabel, styles.sectionLabelFirst]}>COMPENSATION</Text>

          <PickerField
            label="Pay basis"
            selectedValue={form.payBasis}
            onValueChange={set('payBasis')}
            options={PAY_BASIS}
            hidePlaceholder
          />

          <View style={styles.row}>
            <View style={styles.rowItem}>
              <Field label={`Min pay (${form.payBasis})`}>
                <TextInput
                  style={styles.input}
                  value={form.minPay}
                  onChangeText={set('minPay')}
                  keyboardType="numeric"
                />
              </Field>
            </View>
            <View style={styles.rowItem}>
              <Field label={`Max pay (${form.payBasis})`}>
                <TextInput
                  style={styles.input}
                  value={form.maxPay}
                  onChangeText={set('maxPay')}
                  keyboardType="numeric"
                />
              </Field>
            </View>
          </View>

          <View style={styles.sectionDivider} />
          <Text style={[styles.sectionLabel, styles.sectionLabelFirst]}>LOCATION</Text>

          <PickerField
            label="Country"
            required
            selectedValue={form.country}
            onValueChange={set('country')}
            options={COUNTRIES}
            placeholder="Select a country..."
            error={errors.country}
          />

          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => set('remoteFriendly')(!form.remoteFriendly)}
          >
            <View style={[styles.checkbox, form.remoteFriendly && styles.checkboxChecked]}>
              {form.remoteFriendly ? <Ionicons name="checkmark" size={14} color={colors.white} /> : null}
            </View>
            <Text style={styles.checkboxLabel}>Remote friendly</Text>
          </TouchableOpacity>

          <View style={styles.sectionDivider} />
          <Text style={[styles.sectionLabel, styles.sectionLabelFirst]}>OPENINGS</Text>

          <Field label="Number of openings" required error={errors.openings}>
            <TextInput
              style={styles.input}
              value={form.openings}
              onChangeText={set('openings')}
              keyboardType="numeric"
            />
          </Field>

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitBtnText}>{isEdit ? 'Save Changes' : 'Post Job'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
