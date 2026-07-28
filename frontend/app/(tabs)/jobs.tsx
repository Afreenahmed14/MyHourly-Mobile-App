import React, { useCallback, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { router } from 'expo-router';
import Input from '../../src/components/Input';
import JobCard from '../../src/components/JobCard';
import { jobService } from '../../src/api/jobService';
import { colors, spacing, fontSize } from '../../src/constants/theme';

export default function Jobs() {
  const [search, setSearch] = useState('');
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async (query: string) => {
    try {
      const res = await jobService.search({ q: query, page: 1, limit: 20 });
      setJobs(res.data?.jobs ?? []);
      setError('');
    } catch (e) {
      setError('Could not load jobs. Pull down to retry.');
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    load(search).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchSubmit = () => {
    setLoading(true);
    load(search).finally(() => setLoading(false));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await load(search);
    setRefreshing(false);
  };

  return (
    <View style={styles.page}>
      <Text style={styles.title}>Browse Jobs</Text>
      <Input
        placeholder="Search by title, skill, or role..."
        value={search}
        onChangeText={setSearch}
        onSubmitEditing={handleSearchSubmit}
        returnKeyType="search"
      />

      {loading ? (
        <ActivityIndicator style={{ marginTop: spacing.xxl }} color={colors.primary} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <JobCard job={item} onPress={() => router.push(`/job/${item._id}`)} />
          )}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListEmptyComponent={<Text style={styles.empty}>No open jobs found.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg, padding: spacing.lg, paddingTop: spacing.xxl },
  title: { fontSize: fontSize.xl, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  error: { color: colors.danger, textAlign: 'center', marginTop: spacing.xxl },
  empty: { color: colors.textMuted, textAlign: 'center', marginTop: spacing.xxl },
});
