import { useCallback, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Searchbar, Chip } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { jobApi } from '../../api/jobApi';
import JobCard from '../../components/JobCard';
import EmptyState from '../../components/EmptyState';
import LoadingView from '../../components/LoadingView';
import { colors, spacing, radius } from '../../theme/theme';

const JOB_TYPES = ['full-time', 'part-time', 'contract', 'internship'];

/**
 * Native port of frontend Browse Jobs page: search, jobType filter,
 * paginated infinite scroll. Hits GET /jobs/search — same endpoint,
 * same query params as web.
 */
export default function BrowseJobsScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [jobType, setJobType] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchJobs = useCallback(async (pageNum, replace) => {
    const params = { page: pageNum, limit: 10 };
    if (query) params.q = query;
    if (jobType) params.jobType = jobType;
    const res = await jobApi.search(params);
    const { jobs: newJobs, pagination } = res.data.data;
    setTotalPages(pagination.totalPages);
    setTotal(pagination.total ?? pagination.totalItems ?? newJobs.length);
    setJobs((prev) => (replace ? newJobs : [...prev, ...newJobs]));
  }, [query, jobType]);

  const runSearch = useCallback(async () => {
    setLoading(true);
    setPage(1);
    try {
      await fetchJobs(1, true);
    } finally {
      setLoading(false);
    }
  }, [fetchJobs]);

  useFocusEffect(
    useCallback(() => {
      runSearch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jobType])
  );

  const loadMore = async () => {
    if (loadingMore || page >= totalPages) return;
    setLoadingMore(true);
    const next = page + 1;
    await fetchJobs(next, false);
    setPage(next);
    setLoadingMore(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <Text variant="titleLarge" style={styles.title}>Browse Jobs</Text>
        <Searchbar
          placeholder="Search jobs..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={runSearch}
          style={styles.searchbar}
        />
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={JOB_TYPES}
          keyExtractor={(item) => item}
          style={styles.filterRow}
          renderItem={({ item }) => (
            <Chip
              mode={jobType === item ? 'flat' : 'outlined'}
              selected={jobType === item}
              onPress={() => setJobType(jobType === item ? null : item)}
              style={styles.filterChip}
            >
              {item}
            </Chip>
          )}
        />
      </View>

      {!loading && <Text style={styles.resultsCount}>{total} jobs found</Text>}

      {loading ? (
        <LoadingView />
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.sm }}
          renderItem={({ item }) => (
            <JobCard job={item} onPress={() => navigation.navigate('JobDetails', { jobId: item._id })} />
          )}
          onEndReachedThreshold={0.4}
          onEndReached={loadMore}
          ListEmptyComponent={<EmptyState icon="briefcase-search-outline" title="No jobs found" subtitle="Try a different search or filter." />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerCard: {
    backgroundColor: colors.surface, padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  title: { color: colors.text, fontWeight: '700' },
  searchbar: { marginTop: spacing.sm, elevation: 0, backgroundColor: colors.background, borderRadius: radius.md },
  filterRow: { marginTop: spacing.sm, flexGrow: 0 },
  filterChip: { marginRight: spacing.sm },
  resultsCount: { color: colors.textMuted, marginHorizontal: spacing.lg, marginTop: spacing.sm },
});
