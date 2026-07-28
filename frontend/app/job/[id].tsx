import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { jobService } from '../../src/api/jobService';
import { colors, spacing, fontSize } from '../../src/constants/theme';

export default function JobDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [job, setJob] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    jobService
      .getById(id)
      .then((res) => setJob(res.data?.job))
      .catch(() => setError('Could not load this job.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.page} contentContainerStyle={{ padding: spacing.xl }}>
      <Text style={styles.title}>{job?.title}</Text>
      {job?.companyId?.companyName ? (
        <Text style={styles.company}>{job.companyId.companyName}</Text>
      ) : null}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.body}>{job?.description}</Text>
      </View>
      {job?.skills?.length ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <Text style={styles.body}>{job.skills.join(', ')}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  error: { color: colors.danger, textAlign: 'center', padding: spacing.xl },
  title: { fontSize: fontSize.xxl, fontWeight: '700', color: colors.text },
  company: { color: colors.primary, fontSize: fontSize.base, fontWeight: '600', marginTop: spacing.xs },
  section: { marginTop: spacing.xl },
  sectionTitle: { fontSize: fontSize.base, fontWeight: '700', color: colors.text, marginBottom: spacing.xs },
  body: { color: colors.textMuted, fontSize: fontSize.sm, lineHeight: 20 },
});
