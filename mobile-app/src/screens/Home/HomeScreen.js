import { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView, Linking, Pressable } from 'react-native';
import { Text, Avatar, Button, Chip, IconButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { candidateApi } from '../../api/candidateApi';
import { jobApi } from '../../api/jobApi';
import { useAuth } from '../../context/useAuth';
import StarRating from '../../components/StarRating';
import LoadingView from '../../components/LoadingView';
import { colors, spacing, radius } from '../../theme/theme';

/**
 * Home tab. Companies see the original quick-action landing page.
 * Candidates see a gig-app-style dashboard: a gradient hero card,
 * rectangular job banner cards in a horizontal carousel, a companies
 * strip, and an expandable About/Skills section. The profile photo
 * itself now only appears in the bottom tab bar and on the Profile tab —
 * Home leads with the greeting + CTA instead.
 */
export default function HomeScreen({ navigation }) {
  const { role } = useAuth();

  if (role === 'candidate') {
    return <CandidateHome navigation={navigation} />;
  }
  return <CompanyHome navigation={navigation} />;
}

function CandidateHome({ navigation }) {
  const [candidate, setCandidate] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [profileRes, jobsRes] = await Promise.allSettled([
        candidateApi.getMyProfile(),
        jobApi.search({ page: 1, limit: 10 }),
      ]);
      if (profileRes.status === 'fulfilled') {
        setCandidate(profileRes.value.data.data.candidate);
      }
      if (jobsRes.status === 'fulfilled') {
        setJobs(jobsRes.value.data.data?.jobs || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const previewResume = () => {
    if (!candidate?.resume) return;
    Linking.openURL(candidate.resume);
  };

  const openJob = (jobId) => {
    navigation.navigate('JobsTab', { screen: 'JobDetails', params: { jobId } });
  };

  const openJobsList = () => {
    navigation.navigate('JobsTab', { screen: 'BrowseJobs' });
  };

  if (loading || !candidate) return <LoadingView />;

  // Companies are derived from the new-jobs list (each job carries its
  // populated companyId) so we don't need a separate browse-companies call.
  const companies = [];
  const seen = new Set();
  for (const job of jobs) {
    const c = job.companyId;
    if (c && c._id && !seen.has(c._id)) {
      seen.add(c._id);
      companies.push(c);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Hero banner — greeting + rating + primary CTA, gig-app style */}
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.heroTopRow}>
          <View style={{ flex: 1 }}>
            <Text variant="bodyMedium" style={styles.heroGreeting}>Welcome back,</Text>
            <Text variant="headlineSmall" style={styles.heroName}>{candidate.name}</Text>
            <View style={styles.ratingRow}>
              <StarRating rating={candidate.rating || 0} />
              <Text variant="bodySmall" style={styles.heroReviewCount}>({candidate.reviewsCount || 0})</Text>
            </View>
          </View>
        </View>

        <Pressable style={styles.heroCta} onPress={openJobsList}>
          <Text style={styles.heroCtaText}>Browse new jobs</Text>
          <MaterialCommunityIcons name="chevron-right" size={22} color={colors.primary} />
        </Pressable>
      </LinearGradient>

      <View style={styles.body}>
        <View style={styles.row}>
          <Button
            mode="outlined"
            style={styles.half}
            onPress={previewResume}
            disabled={!candidate.resume}
          >
            {candidate.resume ? 'Preview resume' : 'No resume uploaded'}
          </Button>
        </View>

        {!!candidate.hourlyRate && (
          <Text variant="titleMedium" style={styles.rate}>₹{candidate.hourlyRate}/hr</Text>
        )}

        {/* About & skills — collapsed by default, expands on tap */}
        <View style={styles.expandHeader}>
          <Text variant="titleMedium" style={styles.sectionHeading}>About & skills</Text>
          <IconButton
            icon={expanded ? 'chevron-up' : 'chevron-down'}
            onPress={() => setExpanded((v) => !v)}
          />
        </View>

        {expanded && (
          <>
            {!!candidate.about && (
              <Text variant="bodyMedium" style={styles.aboutBody}>{candidate.about}</Text>
            )}
            {!!(candidate.primarySkills?.length) && (
              <View style={styles.chipRow}>
                {candidate.primarySkills.map((s) => <Chip key={s} mode="outlined" style={styles.chip}>{s}</Chip>)}
              </View>
            )}
            {!candidate.about && !candidate.primarySkills?.length && (
              <Text variant="bodySmall" style={styles.emptyText}>Nothing added yet.</Text>
            )}
          </>
        )}

        {/* New jobs — rectangular banner cards, horizontal carousel */}
        {!!jobs.length && (
          <>
            <Text variant="titleMedium" style={styles.carouselHeading}>New jobs</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.jobsCarousel}>
              {jobs.map((job, i) => (
                <Pressable key={job._id} onPress={() => openJob(job._id)}>
                  <LinearGradient
                    colors={JOB_CARD_GRADIENTS[i % JOB_CARD_GRADIENTS.length]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.jobCard}
                  >
                    <View style={{ flex: 1 }}>
                      <Text numberOfLines={2} style={styles.jobCardTitle}>{job.title}</Text>
                      <Text numberOfLines={1} style={styles.jobCardCompany}>
                        {job.companyId?.companyName || 'Company'}
                      </Text>
                      {!!job.jobType && (
                        <View style={styles.jobCardPill}>
                          <Text style={styles.jobCardPillText}>{job.jobType}</Text>
                        </View>
                      )}
                    </View>
                    <Avatar.Image
                      size={48}
                      source={job.companyId?.logo ? { uri: job.companyId.logo } : require('../../../assets/icon.png')}
                      style={styles.jobCardLogo}
                    />
                  </LinearGradient>
                </Pressable>
              ))}
            </ScrollView>
            <Button mode="text" onPress={openJobsList} style={{ alignSelf: 'flex-start' }}>
              See all jobs
            </Button>
          </>
        )}

        {/* Companies — compact rectangular pills, horizontal carousel */}
        {!!companies.length && (
          <>
            <Text variant="titleMedium" style={styles.carouselHeading}>Companies hiring</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.companiesCarousel}>
              {companies.map((c) => (
                <View key={c._id} style={styles.companyCard}>
                  <Avatar.Image
                    size={36}
                    source={c.logo ? { uri: c.logo } : require('../../../assets/icon.png')}
                  />
                  <Text numberOfLines={1} style={styles.companyCardName}>{c.companyName}</Text>
                </View>
              ))}
            </ScrollView>
          </>
        )}
      </View>
    </ScrollView>
  );
}

// Rotating gradient palette so the job carousel doesn't look flat/repetitive.
const JOB_CARD_GRADIENTS = [
  ['#7C3AED', '#4C1D95'],
  ['#DB2777', '#831843'],
  ['#EA580C', '#7C2D12'],
  ['#0891B2', '#164E63'],
];

function CompanyHome({ navigation }) {
  const { user } = useAuth();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.lg }}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text variant="bodyMedium" style={styles.greeting}>Welcome back,</Text>
          <Text variant="headlineSmall" style={styles.name}>{user?.companyName || user?.name}</Text>
        </View>
        <Avatar.Image
          size={48}
          source={
            (user?.profileImage || user?.logo)
              ? { uri: user.profileImage || user.logo }
              : require('../../../assets/icon.png')
          }
        />
      </View>

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: spacing.xl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  greeting: { color: colors.textMuted },
  name: { color: colors.text, fontWeight: '700' },

  hero: {
    paddingTop: spacing.xl, paddingHorizontal: spacing.lg, paddingBottom: spacing.lg,
    borderBottomLeftRadius: radius.lg, borderBottomRightRadius: radius.lg,
  },
  heroTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  heroGreeting: { color: 'rgba(255,255,255,0.85)' },
  heroName: { color: '#fff', fontWeight: '700', marginTop: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs },
  heroReviewCount: { color: 'rgba(255,255,255,0.85)', marginLeft: spacing.xs },
  heroCta: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fff', borderRadius: radius.pill, paddingVertical: spacing.md, paddingHorizontal: spacing.lg,
  },
  heroCtaText: { color: colors.primary, fontWeight: '700', fontSize: 16 },

  body: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  row: { flexDirection: 'row', gap: spacing.md },
  half: { flex: 1 },
  rate: { color: colors.primary, fontWeight: '700', marginTop: spacing.lg },

  expandHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.sm,
  },
  sectionHeading: { color: colors.text, fontWeight: '700' },
  aboutBody: { color: colors.textMuted, lineHeight: 20, marginBottom: spacing.sm },
  emptyText: { color: colors.textMuted, fontStyle: 'italic' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: { marginRight: spacing.xs, marginBottom: spacing.xs },

  carouselHeading: { color: colors.text, fontWeight: '700', marginTop: spacing.xl, marginBottom: spacing.md },

  jobsCarousel: { gap: spacing.md, paddingRight: spacing.md },
  jobCard: {
    width: 240, height: 130, borderRadius: radius.lg, padding: spacing.md,
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
  },
  jobCardTitle: { color: '#fff', fontWeight: '700', fontSize: 16 },
  jobCardCompany: { color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  jobCardPill: {
    alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 2, marginTop: spacing.sm,
  },
  jobCardPillText: { color: '#fff', fontSize: 11, fontWeight: '600', textTransform: 'capitalize' },
  jobCardLogo: { backgroundColor: '#fff' },

  companiesCarousel: { gap: spacing.sm, paddingRight: spacing.md },
  companyCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.surface, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border,
    paddingVertical: spacing.xs, paddingHorizontal: spacing.sm, maxWidth: 160,
  },
  companyCardName: { color: colors.text, fontWeight: '600', flexShrink: 1 },

  sectionTitle: { color: colors.text, fontWeight: '700', marginBottom: spacing.md },
  actionBtn: { marginBottom: spacing.md },
});
