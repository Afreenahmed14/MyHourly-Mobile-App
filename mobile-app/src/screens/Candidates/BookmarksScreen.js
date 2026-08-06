import { useCallback, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { companyApi } from '../../api/companyApi';
import CandidateCard from '../../components/CandidateCard';
import EmptyState from '../../components/EmptyState';
import LoadingView from '../../components/LoadingView';
import { colors, spacing } from '../../theme/theme';

/**
 * Bookmarked Engineers — company-only. Ports the empty-state look from
 * the MyHourly reference app's BookmarkedScreen, but wired to the real
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
        data={bookmarks}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: spacing.lg }}
        renderItem={({ item }) => (
          <CandidateCard
            candidate={{ ...item, isBookmarked: true }}
            onPress={() => navigation.navigate('CandidateDetails', { candidateId: item._id })}
            onBookmarkToggle={() => removeBookmark(item._id)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="bookmark-outline"
            title="No bookmarks yet"
            subtitle="Bookmark engineers while browsing to save them here for later."
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
});
