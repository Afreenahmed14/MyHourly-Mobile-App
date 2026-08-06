import { useCallback, useState, useLayoutEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Button, Avatar, IconButton } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { companyApi } from '../../api/companyApi';
import { jobApi } from '../../api/jobApi';
import { useAuth } from '../../context/useAuth';
import { useSubscription } from '../../context/useSubscription';
import { colors, spacing, radius } from '../../theme/theme';
import ProfileCompletionRing from '../../components/ProfileCompletionRing';
import { getCompanyProfileCompletion } from '../../utils/profileCompletion';

/**
 * Company dashboard — lives on the Profile tab. Mirrors
 * CandidateProfileScreen.js: completion ring, a stats carousel
 * (rating / jobs posted / hires / bookmarked candidates), the current
 * subscription's start & end dates, quick actions, a header edit icon,
 * and Log out. Logo/description editing happens on EditCompanyProfileScreen.
 */
export default function CompanyProfileScreen({ navigation }) {
  const { logout } = useAuth();
  const { subscription } = useSubscription();
  const [company, setCompany] = useState(null);
  const [jobsCount, setJobsCount] = useState(null);
  const [hiresCount, setHiresCount] = useState(null);
  const [bookmarksCount, setBookmarksCount] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadSnapshot = useCallback(async () => {
    try {
      const [profileRes, jobsRes, hiresRes, bookmarksRes] = await Promise.allSettled([
        companyApi.getMyProfile(),
        jobApi.getMine(),
        companyApi.getHires(),
        companyApi.getBookmarks(),
      ]);

      if (profileRes.status === 'fulfilled') {
        setCompany(profileRes.value.data.data.company);
      }
      if (jobsRes.status === 'fulfilled') {
        const list = jobsRes.value.data.data?.jobs || jobsRes.value.data.data || [];
        setJobsCount(Array.isArray(list) ? list.length : 0);
      }
      if (hiresRes.status === 'fulfilled') {
        const list = hiresRes.value.data.data?.hires || hiresRes.value.data.data || [];
        setHiresCount(Array.isArray(list) ? list.length : 0);
      }
      if (bookmarksRes.status === 'fulfilled') {
        const list = bookmarksRes.value.data.data?.bookmarks || bookmarksRes.value.data.data || [];
        setBookmarksCount(Array.isArray(list) ? list.length : 0);
      }
    } catch {
      // Non-critical — dashboard falls back to defaults below.
    }
  }, []);

  useFocusEffect(useCallback(() => { loadSnapshot(); }, [loadSnapshot]));

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="pencil-outline"
          iconColor={colors.primary}
          disabled={!company}
          onPress={() => navigation.navigate('EditCompanyProfile', { company })}
        />
      ),
    });
  }, [navigation, company]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSnapshot();
    setRefreshing(false);
  };

  if (!company) return null;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: spacing.lg }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text variant="bodyMedium" style={styles.greeting}>Welcome back,</Text>
          <Text variant="headlineSmall" style={styles.name}>{company.companyName}</Text>
        </View>

        <ProfileCompletionRing
          uri={company.logo}
          percent={getCompanyProfileCompletion(company)}
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
            {(company.rating ?? 0).toFixed(1)} ★
          </Text>
          <Text variant="bodySmall" style={styles.statLabel}>Rating</Text>
        </View>
        <View style={styles.statCard}>
          <Text variant="headlineSmall" style={styles.statNumber}>
            {jobsCount ?? '—'}
          </Text>
          <Text variant="bodySmall" style={styles.statLabel}>Jobs posted</Text>
        </View>
        <View style={styles.statCard}>
          <Text variant="headlineSmall" style={styles.statNumber}>
            {hiresCount ?? '—'}
          </Text>
          <Text variant="bodySmall" style={styles.statLabel}>Hires</Text>
        </View>
        <View style={styles.statCard}>
          <Text variant="headlineSmall" style={styles.statNumber}>
            {bookmarksCount ?? '—'}
          </Text>
          <Text variant="bodySmall" style={styles.statLabel}>Bookmarked</Text>
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

      <Text variant="titleMedium" style={styles.sectionTitle}>Quick actions</Text>

      <Button mode="contained" style={styles.actionBtn} onPress={() => navigation.navigate('JobsTab', { screen: 'PostJob' })}>
        Post a Job
      </Button>
      <Button mode="outlined" style={styles.actionBtn} onPress={() => navigation.navigate('CandidatesTab')}>
        Browse Freelancers
      </Button>
      <Button mode="outlined" style={styles.actionBtn} onPress={() => navigation.navigate('JobsTab', { screen: 'MyJobs' })}>
        My Job Postings
      </Button>
      <Button mode="outlined" style={styles.actionBtn} onPress={() => navigation.navigate('CandidatesTab', { screen: 'Bookmarks' })}>
        Bookmarked Engineers
      </Button>
      <Button mode="outlined" style={styles.actionBtn} onPress={() => navigation.navigate('CandidatesTab', { screen: 'HiredCandidates' })}>
        Hired Candidates
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
  statNumber: { color: colors.primary, fontWeight: '700' },
  statLabel: { color: colors.textMuted, marginTop: spacing.xs },
  sectionTitle: { color: colors.text, fontWeight: '700', marginBottom: spacing.md },
  actionBtn: { marginBottom: spacing.md },
});
