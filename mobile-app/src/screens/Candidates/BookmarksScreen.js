import { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { companyApi } from '../../api/companyApi';
import CandidateCard from '../../components/CandidateCard';
import LoadingView from '../../components/LoadingView';
import { legacyColors as colors, legacySpacing as spacing } from '../../theme/legacyTheme';

/**
 * Bookmarked Engineers — company-only. Visual design ported from the
 * MyHourly reference app's BookmarkedScreen + CompanyListScreens CSS
 * (bordered header, centered empty state), wired to the real
 * GET /companies/me/bookmarks endpoint instead of mock data.
 */
export default function BookmarksScreen({ navigation }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await companyApi.getBookmarks();
      const list = res.data.data?.bookmarks || res.data.data || [];
      setBookmarks(Array.isArray(list) ? list : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const removeBookmark = async (candidateId) => {
    await companyApi.removeBookmark(candidateId);
    setBookmarks((prev) => prev.filter((c) => c._id !== candidateId));
  };

  if (loading) return <LoadingView />;

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.content}
        data={bookmarks}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={
          <View style={styles.headerRow}>
            <Text style={styles.title}>Bookmarked Engineers</Text>
          </View>
        }
        renderItem={({ item }) => (
          <CandidateCard
            candidate={{ ...item, isBookmarked: true }}
            onPress={() => navigation.navigate('CandidateDetails', { candidateId: item._id })}
            onBookmarkToggle={() => removeBookmark(item._id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>No bookmarks yet</Text>
            <Text style={styles.emptySubtitle}>
              Bookmark engineers while browsing to save them here for later.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: { fontSize: 20, fontWeight: '800', color: colors.text },
  emptyWrap: { alignItems: 'center', paddingVertical: spacing.xxl },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 4 },
  emptySubtitle: { fontSize: 13, color: colors.textMuted, textAlign: 'center', paddingHorizontal: spacing.xl },
});
