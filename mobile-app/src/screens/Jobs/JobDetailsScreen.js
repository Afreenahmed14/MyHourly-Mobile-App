import { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Chip, TextInput, Divider } from 'react-native-paper';
import { jobApi } from '../../api/jobApi';
import { applicationApi } from '../../api/applicationApi';
import { useAuth } from '../../context/useAuth';
import LoadingView from '../../components/LoadingView';
import { colors, spacing, radius } from '../../theme/theme';

export default function JobDetailsScreen({ route }) {
  const { jobId } = route.params;
  const { role } = useAuth();
  const [job, setJob] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await jobApi.getById(jobId);
        setJob(res.data.data.job);
        setHasApplied(res.data.data.hasApplied);
      } finally {
        setLoading(false);
      }
    })();
  }, [jobId]);

  const onApply = async () => {
    setError('');
    setApplying(true);
    try {
      await applicationApi.apply(jobId, coverLetter);
      setHasApplied(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit application.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <LoadingView />;
  if (!job) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.lg }}>
      <Text variant="headlineSmall" style={styles.title}>{job.title}</Text>
      <Text variant="titleMedium" style={styles.company}>{job.companyId?.companyName}</Text>

      <View style={styles.chipRow}>
        {!!job.jobType && <Chip mode="outlined" style={styles.chip}>{job.jobType}</Chip>}
        {!!job.location?.remote && <Chip mode="outlined" style={styles.chip}>Remote</Chip>}
        {!!job.location?.city && <Chip mode="outlined" style={styles.chip}>{job.location.city}</Chip>}
      </View>

      {(job.salaryMin || job.salaryMax) && (
        <Text variant="titleMedium" style={styles.salary}>
          ₹{[job.salaryMin, job.salaryMax].filter(Boolean).join(' - ')} / {job.payType}
        </Text>
      )}

      <Divider style={styles.divider} />

      <Text variant="titleMedium" style={styles.sectionHeading}>Description</Text>
      <Text variant="bodyMedium" style={styles.body}>{job.description}</Text>

      {!!job.skills?.length && (
        <>
          <Text variant="titleMedium" style={styles.sectionHeading}>Skills</Text>
          <View style={styles.chipRow}>
            {job.skills.map((s) => (
              <Chip key={s} style={styles.chip} mode="outlined">{s}</Chip>
            ))}
          </View>
        </>
      )}

      {role === 'candidate' && (
        <>
          <Divider style={styles.divider} />
          {hasApplied ? (
            <Chip icon="check" style={styles.appliedChip}>You've applied to this job</Chip>
          ) : job.status !== 'open' ? (
            <Text style={styles.closedText}>This job is no longer accepting applications.</Text>
          ) : (
            <>
              <TextInput
                mode="outlined"
                label="Cover letter (optional)"
                multiline
                numberOfLines={4}
                value={coverLetter}
                onChangeText={setCoverLetter}
                style={styles.coverLetter}
              />
              {!!error && <Text style={styles.error}>{error}</Text>}
              <Button mode="contained" onPress={onApply} loading={applying} disabled={applying}>
                Apply now
              </Button>
            </>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { color: colors.text, fontWeight: '700' },
  company: { color: colors.primary, marginTop: spacing.xs },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.md },
  chip: { marginRight: spacing.xs, marginBottom: spacing.xs },
  salary: { color: colors.text, fontWeight: '700', marginTop: spacing.md },
  divider: { marginVertical: spacing.lg },
  sectionHeading: { color: colors.text, fontWeight: '700', marginBottom: spacing.sm },
  body: { color: colors.textMuted, lineHeight: 20 },
  coverLetter: { marginBottom: spacing.md, backgroundColor: colors.surface },
  appliedChip: { backgroundColor: '#DCFCE7', alignSelf: 'flex-start' },
  closedText: { color: colors.error },
  error: { color: colors.error, marginBottom: spacing.sm },
});
