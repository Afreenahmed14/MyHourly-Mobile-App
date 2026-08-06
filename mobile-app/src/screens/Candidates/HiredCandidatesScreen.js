import { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { companyApi } from '../../api/companyApi';
import LoadingView from '../../components/LoadingView';
import { legacyColors as colors, legacyRadius as radius, legacySpacing as spacing } from '../../theme/legacyTheme';

/**
 * Hired Candidates — company-only. Visual design ported from the
 * MyHourly reference app's HiredCandidatesScreen + CompanyListScreens CSS
 * (bordered header, card list, centered empty state), wired to the real
 * GET /companies/me/hires endpoint instead of mock data.
 */
export default function HiredCandidatesScreen({ navigation }) {
  const [hires, setHires] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await companyApi.getHires();
      const list = res.data.data?.hires || res.data.data || [];
      setHires(Array.isArray(list) ? list : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  if (loading) return <LoadingView />;

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.content}
        data={hires}
        keyExtractor={(item) => item._id || item.candidateId?._id}
        ListHeaderComponent={
          <View style={styles.headerRow}>
            <Text style={styles.title}>Hired Candidates</Text>
          </View>
        }
        renderItem={({ item }) => {
          const candidate = item.candidateId || item.candidate || item;
          return (
            <TouchableOpacity
              style={styles.jobCard}
              onPress={() => navigation.navigate('CandidateDetails', { candidateId: candidate._id })}
            >
              <View style={styles.jobCardHeader}>
                {candidate.profileImage ? (
                  <Image source={{ uri: candidate.profileImage }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{(candidate.name || '?').charAt(0)}</Text>
                  </View>
                )}
                <View style={styles.jobCardTitleWrap}>
                  <Text style={styles.rowTitle} numberOfLines={1}>{candidate.name}</Text>
                  {!!candidate.headline && (
                    <Text style={styles.rowMeta} numberOfLines={1}>{candidate.headline}</Text>
                  )}
                  {!!item.hiredAt && (
                    <Text style={styles.hiredDate}>Hired on {new Date(item.hiredAt).toLocaleDateString()}</Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>No hires yet</Text>
            <Text style={styles.emptySubtitle}>
              Candidates you hire from their profile will show up here, along with when you hired
              them and their contact details.
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

  jobCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  jobCardHeader: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm,
  },
  avatarText: { color: colors.white, fontWeight: '700', fontSize: 16 },
  avatarImage: { width: 44, height: 44, borderRadius: 22, marginRight: spacing.sm, backgroundColor: colors.border },
  jobCardTitleWrap: { flex: 1, marginRight: spacing.sm },
  rowTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  rowMeta: { fontSize: 12, color: colors.textMuted, marginTop: 3 },
  hiredDate: { fontSize: 11, color: colors.primaryDark, fontWeight: '700', marginTop: 4 },

  emptyWrap: { alignItems: 'center', paddingVertical: spacing.xxl },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 4 },
  emptySubtitle: { fontSize: 13, color: colors.textMuted, textAlign: 'center', paddingHorizontal: spacing.xl },
});
