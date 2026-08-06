import { useCallback, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Chip, Button, IconButton, FAB } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { jobApi } from '../../api/jobApi';
import EmptyState from '../../components/EmptyState';
import LoadingView from '../../components/LoadingView';
import { colors, spacing, radius } from '../../theme/theme';

/** Company's own job postings — open/close toggle, view applicants, delete. */
export default function MyJobsScreen({ navigation }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await jobApi.getMine();
      setJobs(res.data.data.jobs);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const toggleStatus = async (job) => {
    const nextStatus = job.status === 'open' ? 'closed' : 'open';
    await jobApi.update(job._id, { status: nextStatus });
    load();
  };

  const removeJob = async (job) => {
    await jobApi.remove(job._id);
    load();
  };

  if (loading) return <LoadingView />;

  return (
    <View style={styles.container}>
      <FlatList
        data={jobs}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: spacing.lg }}
        ListEmptyComponent={
          <EmptyState icon="briefcase-outline" title="No job postings yet" subtitle="Tap + to post your first job." />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <Text variant="titleMedium" style={styles.title} numberOfLines={1}>{item.title}</Text>
              <Chip compact style={item.status === 'open' ? styles.openChip : styles.closedChip}>
                {item.status}
              </Chip>
            </View>
            <Text variant="bodySmall" style={styles.meta}>
              {item.applicationsCount || 0} applicants · {item.jobType}
            </Text>
            <View style={styles.actionsRow}>
              <Button
                mode="text"
                compact
                onPress={() => navigation.navigate('JobApplicants', { jobId: item._id, jobTitle: item.title })}
              >
                View applicants
              </Button>
              <Button mode="text" compact onPress={() => toggleStatus(item)}>
                {item.status === 'open' ? 'Close' : 'Reopen'}
              </Button>
              <IconButton icon="delete-outline" iconColor={colors.error} onPress={() => removeJob(item)} />
            </View>
          </View>
        )}
      />
      <FAB icon="plus" style={styles.fab} onPress={() => navigation.navigate('PostJob')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  card: {
    backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md,
    marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border,
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: colors.text, fontWeight: '700', flex: 1 },
  meta: { color: colors.textMuted, marginTop: spacing.xs },
  openChip: { backgroundColor: '#DCFCE7' },
  closedChip: { backgroundColor: '#FEE2E2' },
  actionsRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs },
  fab: { position: 'absolute', right: spacing.lg, bottom: spacing.lg, backgroundColor: colors.primary },
});
