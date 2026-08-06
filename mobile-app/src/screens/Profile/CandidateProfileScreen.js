import { useCallback, useState, useLayoutEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Button, Avatar, IconButton } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { statsApi } from '../../api/statsApi';
import { candidateApi } from '../../api/candidateApi';
import { applicationApi } from '../../api/applicationApi';
import { jobApi } from '../../api/jobApi';
import { useAuth } from '../../context/useAuth';
import { useSubscription } from '../../context/useSubscription';
import { colors, spacing, radius } from '../../theme/theme';
import ProfileCompletionRing from '../../components/ProfileCompletionRing';
import { getProfileCompletion } from '../../utils/profileCompletion';

/**
 * Candidate dashboard — lives on the Profile tab. Shows the profile
 * completion ring, a scrollable stats carousel (rating / jobs applied /
 * new jobs / project partners), the current subscription's start & end
 * dates, and quick action shortcuts. (This used to be the Home tab; the
 * Home tab now holds the editable profile details instead.)
 */
export default function CandidateProfileScreen({ navigation }) {
  const { user, role, logout } = useAuth();
  const { subscription } = useSubscription();
  const [stats, setStats] = useState(null);
  const [candidate, setCandidate] = useState(null);
  const [jobsAppliedCount, setJobsAppliedCount] = useState(null);
  const [projectsCount, setProjectsCount] = useState(null);
  const [newJobsCount, setNewJobsCount] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = useCallback(async () => {
    try {
      const res = await statsApi.getPlatformStats();
      setStats(res.data.data);
    } catch {
      // Non-critical — screen still works without the stats bar.
    }
  }, []);

  const loadCandidateSnapshot = useCallback(async () => {
    try {
      const [profileRes, applicationsRes, partnersRes, jobsRes] = await Promise.allSettled([
        candidateApi.getMyProfile(),
        applicationApi.getMine(),
        candidateApi.getProjectPartners(),
        jobApi.search({ page: 1 }),
      ]);

      if (profileRes.status === 'fulfilled') {
        setCandidate(profileRes.value.data.data.candidate);
      }
      if (applicationsRes.status === 'fulfilled') {
        const list = applicationsRes.value.data.data?.applications || applicationsRes.value.data.data || [];
        setJobsAppliedCount(Array.isArray(list) ? list.length : 0);
      }
      if (partnersRes.status === 'fulfilled') {
        const list = partnersRes.value.data.data?.partners || partnersRes.value.data.data || [];
        setProjectsCount(Array.isArray(list) ? list.length : 0);
      }
      if (jobsRes.status === 'fulfilled') {
        const { jobs, pagination } = jobsRes.value.data.data || {};
        setNewJobsCount(pagination?.total ?? pagination?.totalItems ?? jobs?.length ?? 0);
      }
    } catch {
      // Non-critical — header falls back to defaults below.
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadStats();
      loadCandidateSnapshot();
    }, [loadStats, loadCandidateSnapshot])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="pencil-outline"
          iconColor={colors.primary}
          disabled={!candidate}
          onPress={() => navigation.navigate('HomeTab', { screen: 'EditCandidateProfile', params: { candidate } })}
        />
      ),
    });
  }, [navigation, candidate]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadStats(), loadCandidateSnapshot()]);
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: spacing.lg }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text variant="bodyMedium" style={styles.greeting}>Welcome back,</Text>
          <Text variant="headlineSmall" style={styles.name}>{candidate?.name || user?.name}</Text>
        </View>

        <ProfileCompletionRing
          uri={candidate?.profileImage || user?.profileImage}
          percent={getProfileCompletion(candidate)}
          fallbackSource={require('../../../assets/icon.png')}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carousel}
        style={styles.carouselScroll}
      >
        <View style={styles.statCard}>
          <Text variant="headlineSmall" style={styles.statNumber}>
            {(candidate?.rating ?? 0).toFixed(1)} ★
          </Text>
          <Text variant="bodySmall" style={styles.statLabel}>Rating</Text>
        </View>
        <View style={styles.statCard}>
          <Text variant="headlineSmall" style={styles.statNumber}>
            {jobsAppliedCount ?? '—'}
          </Text>
          <Text variant="bodySmall" style={styles.statLabel}>Jobs applied</Text>
        </View>
        <View style={styles.statCard}>
          <Text variant="headlineSmall" style={styles.statNumber}>
            {newJobsCount ?? '—'}
          </Text>
          <Text variant="bodySmall" style={styles.statLabel}>New jobs</Text>
        </View>
        <View style={styles.statCard}>
          <Text variant="headlineSmall" style={styles.statNumber}>
            {projectsCount ?? '—'}
          </Text>
          <Text variant="bodySmall" style={styles.statLabel}>Project partners</Text>
        </View>
      </ScrollView>

      {!!subscription && (
        <Card style={styles.planCard} onPress={() => navigation.navigate('SubscriptionTab')}>
          <Card.Content>
            <Text variant="labelLarge" style={styles.planLabel}>Current plan</Text>
            <Text variant="titleMedium" style={styles.planName}>{subscription.name || 'Free'}</Text>
            <View style={styles.planDatesRow}>
              <View>
                <Text variant="bodySmall" style={styles.planDateLabel}>Start date</Text>
                <Text variant="bodyMedium" style={styles.planDateValue}>
                  {subscription.startDate ? new Date(subscription.startDate).toLocaleDateString() : '—'}
                </Text>
              </View>
              <View>
                <Text variant="bodySmall" style={styles.planDateLabel}>End date</Text>
                <Text variant="bodyMedium" style={styles.planDateValue}>
                  {subscription.endDate ? new Date(subscription.endDate).toLocaleDateString() : '—'}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      )}

      {!!stats && (
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text variant="headlineSmall" style={styles.statNumber}>{stats.totalCandidates}</Text>
            <Text variant="bodySmall" style={styles.statLabel}>Engineers</Text>
          </View>
          <View style={styles.statBox}>
            <Text variant="headlineSmall" style={styles.statNumber}>{stats.totalCompanies}</Text>
            <Text variant="bodySmall" style={styles.statLabel}>Companies</Text>
          </View>
        </View>
      )}

      <Text variant="titleMedium" style={styles.sectionTitle}>Quick actions</Text>

      <Button mode="contained" style={styles.actionBtn} onPress={() => navigation.navigate('JobsTab')}>
        Browse Jobs
      </Button>
      <Button mode="outlined" style={styles.actionBtn} onPress={() => navigation.navigate('ApplicationsTab')}>
        My Applications
      </Button>
      <Button mode="outlined" style={styles.actionBtn} onPress={() => navigation.navigate('CandidatesTab')}>
        Find Project Partners
      </Button>

      <Button mode="text" textColor={colors.error} style={{ marginTop: spacing.xl }} onPress={logout}>
        Log out
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  greeting: { color: colors.textMuted },
  name: { color: colors.text, fontWeight: '700' },
  planCard: { marginBottom: spacing.lg, backgroundColor: colors.primary, borderRadius: radius.md },
  planLabel: { color: '#E0E7FF' },
  planName: { color: '#fff', fontWeight: '700' },
  planDatesRow: { flexDirection: 'row', marginTop: spacing.md, gap: spacing.xl },
  planDateLabel: { color: '#E0E7FF' },
  planDateValue: { color: '#fff', fontWeight: '600', marginTop: 2 },
  carouselScroll: { marginBottom: spacing.lg },
  carousel: { gap: spacing.md, paddingRight: spacing.md },
  statCard: {
    width: 108, backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md,
    alignItems: 'center', borderWidth: 1, borderColor: colors.border,
  },
  statsRow: { flexDirection: 'row', marginBottom: spacing.lg, gap: spacing.md },
  statBox: {
    flex: 1, backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md,
    alignItems: 'center', borderWidth: 1, borderColor: colors.border,
  },
  statNumber: { color: colors.primary, fontWeight: '700' },
  statLabel: { color: colors.textMuted, marginTop: spacing.xs },
  sectionTitle: { color: colors.text, fontWeight: '700', marginBottom: spacing.md },
  actionBtn: { marginBottom: spacing.md },
});
