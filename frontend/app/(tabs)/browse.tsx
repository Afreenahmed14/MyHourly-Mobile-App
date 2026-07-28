import React, { useCallback, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { router } from 'expo-router';
import Input from '../../src/components/Input';
import CandidateCard from '../../src/components/CandidateCard';
import { candidateService } from '../../src/api/candidateService';
import { colors, spacing, fontSize } from '../../src/constants/theme';

export default function Browse() {
  const [search, setSearch] = useState('');
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async (query: string) => {
    try {
      // NOTE: real endpoint is /candidates/search with param `q` — not
      // /candidates?search=... (that route doesn't exist on the backend).
      const res = await candidateService.search({ q: query, page: 1, limit: 20 });
      setCandidates(res.data?.candidates ?? []);
      setError('');
    } catch (e) {
      setError('Could not load engineers. Pull down to retry.');
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
      <Text style={styles.title}>Browse Engineers</Text>
      <Input
        placeholder="Search by name, skill, or role..."
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
          data={candidates}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <CandidateCard
              candidate={item}
              onPress={() => router.push(`/candidate/${item._id}`)}
            />
          )}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListEmptyComponent={<Text style={styles.empty}>No engineers found.</Text>}
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
