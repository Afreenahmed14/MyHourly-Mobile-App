import { useCallback, useState } from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { Text, Avatar } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { companyApi } from '../../api/companyApi';
import EmptyState from '../../components/EmptyState';
import LoadingView from '../../components/LoadingView';
import { colors, spacing, radius } from '../../theme/theme';

/**
 * Hired Candidates — company-only. Ports the empty-state look from the
 * MyHourly reference app's HiredCandidatesScreen, wired to the real
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
        data={hires}
        keyExtractor={(item) => item._id || item.candidateId?._id}
        contentContainerStyle={{ padding: spacing.lg }}
        renderItem={({ item }) => {
          const candidate = item.candidateId || item.candidate || item;
          return (
            <Pressable
              style={styles.card}
              onPress={() => navigation.navigate('CandidateDetails', { candidateId: candidate._id })}
            >
              <Avatar.Image
                size={48}
                source={candidate.profileImage ? { uri: candidate.profileImage } : require('../../../assets/icon.png')}
              />
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <Text style={styles.name} numberOfLines={1}>{candidate.name}</Text>
                {!!candidate.headline && (
                  <Text style={styles.headline} numberOfLines={1}>{candidate.headline}</Text>
                )}
                {!!item.hiredAt && (
                  <Text style={styles.hiredDate}>
                    Hired on {new Date(item.hiredAt).toLocaleDateString()}
                  </Text>
                )}
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <EmptyState
            icon="account-check-outline"
            title="No hires yet"
            subtitle="Candidates you hire from their profile will show up here, along with when you hired them and their contact details."
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.md,
    padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border,
  },
  name: { color: colors.text, fontWeight: '700', fontSize: 15 },
  headline: { color: colors.textMuted, marginTop: 2, fontSize: 13 },
  hiredDate: { color: colors.primary, marginTop: spacing.xs, fontSize: 12, fontWeight: '600' },
});
