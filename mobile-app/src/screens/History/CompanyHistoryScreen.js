import { useCallback, useMemo, useState } from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Text, Chip, SegmentedButtons } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { jobApi } from '../../api/jobApi';
import { companyApi } from '../../api/companyApi';
import { chatApi } from '../../api/chatApi';
import EmptyState from '../../components/EmptyState';
import LoadingView from '../../components/LoadingView';
import { resolveImageUrl } from '../../constants/config';
import { colors, spacing, radius } from '../../theme/theme';

function HistoryAvatar({ uri, fallback }) {
  const [failed, setFailed] = useState(false);
  const resolved = resolveImageUrl(uri);
  if (resolved && !failed) {
    return <Image source={{ uri: resolved }} style={styles.avatarImage} onError={() => setFailed(true)} />;
  }
  return (
    <View style={styles.avatarFallback}>
      <Text style={styles.avatarFallbackText}>{(fallback || '?').charAt(0).toUpperCase()}</Text>
    </View>
  );
}

/**
 * Company's full activity history in one place:
 *  - "Jobs" tab: every job they've ever posted, open or closed, with
 *    applicant counts and posted date.
 *  - "Hired" tab: every candidate they've hired, and when.
 * Lives in the bottom tab bar (see MainTabNavigator.js).
 */
export default function CompanyHistoryScreen({ navigation }) {
  const [tab, setTab] = useState('jobs');
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [hires, setHires] = useState([]);
  const [messaging, setMessaging] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [jobsRes, hiresRes] = await Promise.all([
        jobApi.getMine(),
        companyApi.getHires(),
      ]);
      setJobs(jobsRes.data.data.jobs || []);
      const hiresList = hiresRes.data.data?.hires || hiresRes.data.data || [];
      setHires(Array.isArray(hiresList) ? hiresList : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const sortedJobs = useMemo(
    () => [...jobs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [jobs],
  );
  const sortedHires = useMemo(
    () => [...hires].sort((a, b) => new Date(b.unlockDate || b.createdAt) - new Date(a.unlockDate || a.createdAt)),
    [hires],
  );

  const openCount = jobs.filter((j) => j.status === 'open').length;
  const closedCount = jobs.filter((j) => j.status === 'closed').length;

  const handleMessage = async (candidate) => {
    setMessaging(candidate._id);
    try {
      const res = await chatApi.openConversation(candidate._id, 'Candidate');
      const conversation = res.data.data.conversation;
      navigation.navigate('ChatTab', {
        screen: 'ChatThread',
        params: { conversationId: conversation._id, otherName: candidate.name, otherAvatar: candidate.profileImage },
      });
    } finally {
      setMessaging(null);
    }
  };

  if (loading) return <LoadingView />;

  return (
    <View style={styles.container}>
      <View style={styles.headerWrap}>
        <Text variant="titleLarge" style={styles.title}>History</Text>
        <SegmentedButtons
          value={tab}
          onValueChange={setTab}
          style={styles.segmented}
          buttons={[
            { value: 'jobs', label: `Jobs (${jobs.length})`, icon: 'briefcase-outline' },
            { value: 'hired', label: `Hired (${hires.length})`, icon: 'account-check-outline' },
          ]}
        />
      </View>

      {tab === 'jobs' ? (
        <FlatList
          data={sortedJobs}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            jobs.length ? (
              <Text variant="bodySmall" style={styles.summaryText}>
                {openCount} open · {closedCount} closed
              </Text>
            ) : null
          }
          ListEmptyComponent={
            <EmptyState icon="briefcase-outline" title="No job postings yet" subtitle="Jobs you post will show up here, open or closed." />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('JobsTab', { screen: 'JobApplicants', params: { jobId: item._id, jobTitle: item.title } })}
            >
              <View style={styles.rowBetween}>
                <Text variant="titleMedium" style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                <Chip compact style={item.status === 'open' ? styles.openChip : styles.closedChip}>
                  {item.status}
                </Chip>
              </View>
              <Text variant="bodySmall" style={styles.meta}>
                {item.applicationsCount || 0} applicant{item.applicationsCount === 1 ? '' : 's'} · {item.jobType}
              </Text>
              <Text variant="bodySmall" style={styles.dateText}>
                Posted on {new Date(item.createdAt).toLocaleDateString()}
                {item.status === 'closed' && item.updatedAt ? ` · Closed on ${new Date(item.updatedAt).toLocaleDateString()}` : ''}
              </Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <FlatList
          data={sortedHires}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <EmptyState icon="account-check-outline" title="No hires yet" subtitle="Candidates you hire will show up here, along with when you hired them." />
          }
          renderItem={({ item }) => {
            const candidate = item.candidateId || item.candidate || item;
            return (
              <TouchableOpacity
                style={styles.card}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('CandidatesTab', { screen: 'CandidateDetails', params: { candidateId: candidate._id } })}
              >
                <View style={styles.hireRow}>
                  <HistoryAvatar uri={candidate.profileImage} fallback={candidate.name} />
                  <View style={styles.hireInfo}>
                    <Text variant="titleMedium" style={styles.cardTitle} numberOfLines={1}>{candidate.name}</Text>
                    {!!candidate.headline && (
                      <Text variant="bodySmall" style={styles.meta} numberOfLines={1}>{candidate.headline}</Text>
                    )}
                    <Text variant="bodySmall" style={styles.dateText}>
                      Hired on {new Date(item.unlockDate || item.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.messageBtn}
                    disabled={messaging === candidate._id}
                    onPress={(e) => { e.stopPropagation(); handleMessage(candidate); }}
                  >
                    <MaterialCommunityIcons name="chat-outline" size={20} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerWrap: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.md },
  title: { color: colors.text, fontWeight: '800', marginBottom: spacing.md },
  segmented: {},
  summaryText: { color: colors.textMuted, marginBottom: spacing.sm },
  listContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  card: {
    backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md,
    marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border,
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { color: colors.text, fontWeight: '700', flex: 1, marginRight: spacing.sm },
  meta: { color: colors.textMuted, marginTop: 2 },
  dateText: { color: colors.primaryDark, fontWeight: '600', fontSize: 12, marginTop: spacing.xs },
  openChip: { backgroundColor: '#DCFCE7' },
  closedChip: { backgroundColor: '#FEE2E2' },
  hireRow: { flexDirection: 'row', alignItems: 'center' },
  hireInfo: { flex: 1, marginLeft: spacing.sm },
  messageBtn: {
    width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, marginLeft: spacing.sm,
  },
  avatarImage: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.border },
  avatarFallback: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarFallbackText: { color: '#fff', fontWeight: '700' },
});
