import { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, HelperText, SegmentedButtons, Switch } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { jobApi } from '../../api/jobApi';
import { colors, spacing } from '../../theme/theme';

// Mirrors backend/src/routes/jobRoutes.js jobValidator exactly.
const schema = yup.object({
  title: yup.string().min(2).max(150).required('Title is required'),
  description: yup.string().min(10).max(5000).required('Description is required'),
  jobType: yup.string().oneOf(['full-time', 'part-time', 'contract', 'internship']).required(),
  payType: yup.string().oneOf(['yearly', 'monthly', 'weekly', 'hourly']).required(),
  salaryMin: yup.number().min(0).optional(),
  salaryMax: yup.number().min(0).optional(),
  openings: yup.number().min(1).optional(),
});

export default function PostJobScreen({ navigation }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [remote, setRemote] = useState(false);

  const {
    control, handleSubmit, formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '', description: '', jobType: 'full-time', payType: 'yearly',
      salaryMin: '', salaryMax: '', openings: '1',
    },
  });

  const onSubmit = async (values) => {
    setError('');
    setSubmitting(true);
    try {
      await jobApi.create({
        ...values,
        salaryMin: values.salaryMin ? Number(values.salaryMin) : undefined,
        salaryMax: values.salaryMax ? Number(values.salaryMax) : undefined,
        openings: values.openings ? Number(values.openings) : 1,
        location: { remote },
      });
      navigation.navigate('MyJobs');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not post this job.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.lg }}>
      <Text variant="headlineSmall" style={styles.title}>Post a job</Text>

      <Controller control={control} name="title" render={({ field: { onChange, onBlur, value } }) => (
        <View style={styles.field}>
          <TextInput mode="outlined" label="Job title" onBlur={onBlur} onChangeText={onChange} value={value} error={!!errors.title} />
          <HelperText type="error" visible={!!errors.title}>{errors.title?.message}</HelperText>
        </View>
      )} />

      <Controller control={control} name="description" render={({ field: { onChange, onBlur, value } }) => (
        <View style={styles.field}>
          <TextInput mode="outlined" label="Description" multiline numberOfLines={5} onBlur={onBlur} onChangeText={onChange} value={value} error={!!errors.description} />
          <HelperText type="error" visible={!!errors.description}>{errors.description?.message}</HelperText>
        </View>
      )} />

      <Text variant="labelLarge" style={styles.label}>Job type</Text>
      <Controller control={control} name="jobType" render={({ field: { onChange, value } }) => (
        <SegmentedButtons
          value={value}
          onValueChange={onChange}
          style={styles.field}
          buttons={[
            { value: 'full-time', label: 'Full-time' },
            { value: 'part-time', label: 'Part-time' },
            { value: 'contract', label: 'Contract' },
            { value: 'internship', label: 'Intern' },
          ]}
        />
      )} />

      <Text variant="labelLarge" style={styles.label}>Pay type</Text>
      <Controller control={control} name="payType" render={({ field: { onChange, value } }) => (
        <SegmentedButtons
          value={value}
          onValueChange={onChange}
          style={styles.field}
          buttons={[
            { value: 'yearly', label: 'Yearly' },
            { value: 'monthly', label: 'Monthly' },
            { value: 'weekly', label: 'Weekly' },
            { value: 'hourly', label: 'Hourly' },
          ]}
        />
      )} />

      <View style={styles.row}>
        <Controller control={control} name="salaryMin" render={({ field: { onChange, onBlur, value } }) => (
          <TextInput mode="outlined" label="Salary min" keyboardType="numeric" onBlur={onBlur} onChangeText={onChange} value={value} style={styles.half} />
        )} />
        <Controller control={control} name="salaryMax" render={({ field: { onChange, onBlur, value } }) => (
          <TextInput mode="outlined" label="Salary max" keyboardType="numeric" onBlur={onBlur} onChangeText={onChange} value={value} style={styles.half} />
        )} />
      </View>

      <Controller control={control} name="openings" render={({ field: { onChange, onBlur, value } }) => (
        <View style={styles.field}>
          <TextInput mode="outlined" label="Number of openings" keyboardType="numeric" onBlur={onBlur} onChangeText={onChange} value={value} />
        </View>
      )} />

      <View style={styles.switchRow}>
        <Text variant="bodyMedium">Remote-friendly</Text>
        <Switch value={remote} onValueChange={setRemote} />
      </View>

      {!!error && <Text style={styles.error}>{error}</Text>}

      <Button mode="contained" onPress={handleSubmit(onSubmit)} loading={submitting} disabled={submitting}>
        Post job
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { color: colors.text, fontWeight: '700', marginBottom: spacing.lg },
  field: { marginBottom: spacing.md },
  label: { color: colors.text, marginBottom: spacing.xs },
  row: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  half: { flex: 1 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  error: { color: colors.error, marginBottom: spacing.md },
});
