import { useCallback, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Searchbar, IconButton } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { candidateApi } from '../../api/candidateApi';
import { companyApi } from '../../api/companyApi';
import { useAuth } from '../../context/useAuth';
import CandidateCard from '../../components/CandidateCard';
import EmptyState from '../../components/EmptyState';
import LoadingView from '../../components/LoadingView';
import { colors, spacing, radius } from '../../theme/theme';

/** Native port of the web "Browse Freelancers" page: GET /candidates/search. */
export default function BrowseFreelancersScreen({ navigation }) {
  const { role } = useAuth();
  const [query, setQuery] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchCandidates = useCallback(async (pageNum, replace) => {
    const params = { page: pageNum, limit: 10 };
    if (query) params.q = query;
    const res = await candidateApi.search(params);
    const { candidates: newOnes, pagination } = res.data.data;
    setTotalPages(pagination.totalPages);
    setTotal(pagination.total ?? pagination.totalItems ?? newOnes.length);
    setCandidates((prev) => (replace ? newOnes : [...prev, ...newOnes]));
  }, [query]);

  const runSearch = useCallback(async () => {
    setLoading(true);
    setPage(1);
    try {
      await fetchCandidates(1, true);
    } finally {
      setLoading(false);
    }
  }, [fetchCandidates]);

  useFocusEffect(useCallback(() => { runSearch(); }, [runSearch]));

  const loadMore = async () => {
    if (loadingMore || page >= totalPages) return;
    setLoadingMore(true);
    const next = page + 1;
    await fetchCandidates(next, false);
    setPage(next);
    setLoadingMore(false);
  };

  const toggleBookmark = async (candidate) => {
    if (role !== 'company') return;
    if (candidate.isBookmarked) await companyApi.removeBookmark(candidate._id);
    else await companyApi.bookmarkCandidate(candidate._id);
    setCandidates((prev) =>
      prev.map((c) => (c._id === candidate._id ? { ...c, isBookmarked: !c.isBookmarked } : c))
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <View style={styles.headerTopRow}>
          <Text variant="titleLarge" style={styles.title}>Browse Engineers</Text>
          {role === 'company' && (
            <IconButton
              icon="bookmark-outline"
              iconColor={colors.primary}
              onPress={() => navigation.navigate('Bookmarks')}
            />
          )}
        </View>
        <Searchbar
          placeholder="Search by name..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={runSearch}
          style={styles.searchbar}
        />
      </View>

      {!loading && <Text style={styles.resultsCount}>{total} engineers found</Text>}

      {loading ? (
        <LoadingView />
      ) : (
        <FlatList
          data={candidates}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.sm }}
          renderItem={({ item }) => (
            <CandidateCard
              candidate={item}
              onPress={() => navigation.navigate('CandidateDetails', { candidateId: item._id })}
              onBookmarkToggle={role === 'company' ? () => toggleBookmark(item) : undefined}
            />
          )}
          onEndReachedThreshold={0.4}
          onEndReached={loadMore}
          ListEmptyComponent={<EmptyState icon="account-search-outline" title="No engineers found" />}
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
  headerTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { color: colors.text, fontWeight: '700' },
  searchbar: { marginTop: spacing.sm, elevation: 0, backgroundColor: colors.background, borderRadius: radius.md },
  resultsCount: { color: colors.textMuted, marginHorizontal: spacing.lg, marginTop: spacing.sm },
});
