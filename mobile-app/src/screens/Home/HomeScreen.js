import { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, Linking, Pressable, Share, Image } from 'react-native';
import { Text, Button, Chip, IconButton } from 'react-native-paper';
import Animated, {
  FadeInUp, FadeInRight, useAnimatedStyle, useSharedValue, withTiming, Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AnimatedPressable from '../../components/AnimatedPressable';
import { candidateApi } from '../../api/candidateApi';
import { jobApi } from '../../api/jobApi';
import { subscriptionApi } from '../../api/subscriptionApi';
import { useAuth } from '../../context/useAuth';
import StarRating from '../../components/StarRating';
import LoadingView from '../../components/LoadingView';
import SafeAvatar from '../../components/SafeAvatar';
import { getProfileCompletion } from '../../utils/profileCompletion';
import { colors, spacing, radius } from '../../theme/theme';

/**
 * Home tab. Companies see the original quick-action landing page.
 * Candidates see a gig-app-style dashboard modeled on the reference
 * screenshot: a top status bar, a bold headline banner with CTA, a
 * horizontal promo carousel (real "new jobs" data) with a page counter,
 * an invite-friends bar, and a profile-completion milestone tracker.
 *
 * Two honest adaptations from the reference, since this is a hiring app
 * rather than a delivery-shift app:
 *  - The reference's "Refer & Earn ₹15,000" bar implied a real cash
 *    reward. This backend has no referral program, so that bar opens the
 *    native share sheet to invite a friend instead of promising a payout
 *    that doesn't exist.
 *  - The "Available for work" toggle needs an `isAvailable` field on the
 *    Candidate model — it isn't there yet, so the toggle updates local
 *    state and calls candidateApi.updateMyProfile({ isAvailable }) on a
 *    best-effort basis; add that field to the backend schema/route to
 *    make it actually persist.
 */
export default function HomeScreen({ navigation }) {
  const { role } = useAuth();

  if (role === 'candidate') {
    return <CandidateHome navigation={navigation} />;
  }
  return <CompanyHome navigation={navigation} />;
}

const CARD_WIDTH = 240;
const CARD_GAP = 16;

// Playful, upbeat one-liners for the headline banner — picked once per
// screen visit so it doesn't change mid-scroll.
const FLIRTY_LINES = [
  "These jobs have been eyeing your profile all week 😉",
  "Warning: irresistibly good opportunities ahead.",
  "Your resume just picked up a few new admirers.",
  "New jobs, and they're totally into you.",
  "Ready to swipe right on your next gig?",
  "Don't leave these jobs on read.",
];

function CandidateHome({ navigation }) {
  const [candidate, setCandidate] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [available, setAvailable] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [flirtyLine] = useState(() => FLIRTY_LINES[Math.floor(Math.random() * FLIRTY_LINES.length)]);
  const [avatarFailed, setAvatarFailed] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [profileRes, jobsRes] = await Promise.allSettled([
        candidateApi.getMyProfile(),
        jobApi.search({ page: 1, limit: 10 }),
      ]);
      if (profileRes.status === 'fulfilled') {
        const c = profileRes.value.data.data.candidate;
        setCandidate(c);
        if (typeof c.isAvailable === 'boolean') setAvailable(c.isAvailable);
      }
      if (jobsRes.status === 'fulfilled') {
        setJobs(jobsRes.value.data.data?.jobs || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const toggleAvailable = async () => {
    const next = !available;
    setAvailable(next); // optimistic
    try {
      await candidateApi.updateMyProfile({ isAvailable: next });
    } catch {
      setAvailable(!next); // revert if the backend rejects the field
    }
  };

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

  const openSupport = () => {
    navigation.navigate('ProfileTab', { screen: 'Support' });
  };

  const reportIssue = () => {
    Linking.openURL('mailto:support@hourlyrecruit.com?subject=Reporting an issue');
  };

  const inviteFriend = () => {
    Share.share({
      message: 'I\'m using HourlyRecruit to find hourly engineering gigs — you should check it out too!',
    });
  };

  const onCarouselScroll = (e) => {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / (CARD_WIDTH + CARD_GAP));
    setCarouselIndex(Math.max(0, Math.min(jobs.length - 1, idx)));
  };

  if (loading || !candidate) return <LoadingView />;

  const completion = getProfileCompletion(candidate);
  const milestones = [25, 50, 75, 100];
  const badgeLabel = (candidate.rating || 0) >= 4.5 ? 'Top Rated' : (candidate.rating || 0) >= 4 ? 'Rising Star' : 'New';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
    

      <View style={styles.body}>
        {/* Bold headline banner + CTA. The candidate's optional
            Bitmoji-style avatar sits here when they've built one — the
            real profile photo still only shows up in the top navbar. */}
        <Animated.View entering={FadeInUp.duration(450)}>
        <View style={styles.greetingRow}>
          <View style={{ flex: 1 }}>
            <View style={styles.headlineRow}>
              {!!candidate.avatarImage && !avatarFailed && (
                <Image
                  source={{ uri: candidate.avatarImage }}
                  style={styles.homeAvatar}
                  onError={() => setAvatarFailed(true)}
                />
              )}
              <Text style={styles.headline}>New jobs{'\n'}live now!</Text>
            </View>
          </View>
          <Text style={styles.flirtyLineCorner}>{flirtyLine}</Text>
        </View>
        <Text style={styles.headlineSub}>
          {jobs.length} opportunit{jobs.length === 1 ? 'y' : 'ies'} posted recently
        </Text>
        <AnimatedPressable style={styles.ctaBtn} onPress={openJobsList} scaleTo={0.98}>
          <Text style={styles.ctaBtnText}>Let's browse jobs</Text>
          <MaterialCommunityIcons name="chevron-right" size={22} color="#fff" />
        </AnimatedPressable>
        </Animated.View>
      </View>

      {/* Invite a friend — real native share, no fabricated payout */}
      <Animated.View entering={FadeInUp.delay(80).duration(450)}>
      <AnimatedPressable style={styles.inviteBar} onPress={inviteFriend} scaleTo={0.98}>
        <View style={styles.inviteLeft}>
          <Ionicons name="gift-outline" size={20} color={colors.text} />
          <Text style={styles.inviteText}>Invite a friend</Text>
        </View>
        <View style={styles.invitePill}>
          <Text style={styles.invitePillText}>Share app</Text>
          <MaterialCommunityIcons name="chevron-right" size={16} color="#fff" />
        </View>
      </AnimatedPressable>
      </Animated.View>

      {/* New jobs — promo-style carousel with a page counter */}
      {!!jobs.length && (
        <Animated.View entering={FadeInUp.delay(140).duration(450)} style={styles.carouselSection}>
          <ScrollView
            horizontal
            pagingEnabled={false}
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + CARD_GAP}
            decelerationRate="fast"
            contentContainerStyle={styles.jobsCarousel}
            onMomentumScrollEnd={onCarouselScroll}
          >
            {jobs.map((job, i) => (
              <Animated.View key={job._id} entering={FadeInRight.delay(i * 90).duration(400)}>
              <AnimatedPressable onPress={() => openJob(job._id)} scaleTo={0.96}>
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
                  <SafeAvatar
                    uri={job.companyId?.logo}
                    size={48}
                    fallbackSource={require('../../../assets/icon.png')}
                    style={styles.jobCardLogo}
                  />
                </LinearGradient>
              </AnimatedPressable>
              </Animated.View>
            ))}
          </ScrollView>

          <View style={styles.pageCounterRow}>
            <View style={styles.pageCounterPill}>
              <Text style={styles.pageCounterText}>{carouselIndex + 1}/{jobs.length}</Text>
            </View>
            <Button mode="text" compact onPress={openJobsList}>See all</Button>
          </View>
        </Animated.View>
      )}

      <View style={styles.body}>
        <Animated.View entering={FadeInUp.delay(180).duration(450)}>
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
        </Animated.View>

        {/* Profile-completion milestone tracker — real % from candidate data */}
        <Animated.View entering={FadeInUp.delay(240).duration(450)} style={styles.incentiveCard}>
          <View style={styles.incentiveHeaderRow}>
            <View>
              <Text style={styles.incentiveTitle}>Complete your profile</Text>
              <Text style={styles.incentiveSub}>{completion}% done — finish it to stand out to companies</Text>
            </View>
            <IconButton
              icon="chevron-right"
              size={20}
              onPress={() => navigation.navigate('ProfileTab', { screen: 'EditCandidateProfile', params: { candidate } })}
            />
          </View>

          <View style={styles.trackRow}>
            <View style={styles.trackLine}>
              <Animated.View
                entering={FadeInRight.delay(320).duration(600).easing(Easing.out(Easing.exp))}
                style={[styles.trackLineFill, { width: `${completion}%` }]}
              />
            </View>
          </View>
          <View style={styles.milestoneRow}>
            {milestones.map((m, mi) => {
              const reached = completion >= m;
              return (
                <Animated.View key={m} entering={FadeInUp.delay(280 + mi * 60)} style={styles.milestoneItem}>
                  <View style={[styles.milestoneDot, reached && styles.milestoneDotReached]}>
                    <Ionicons
                      name={reached ? 'checkmark' : 'lock-closed'}
                      size={12}
                      color={reached ? '#fff' : colors.textMuted}
                    />
                  </View>
                  <Text style={styles.milestoneLabel}>{m}%</Text>
                </Animated.View>
              );
            })}
          </View>
        </Animated.View>

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

// Distinct icon-tile quick actions for the company dashboard — deliberately
// a different visual language from the candidate side's carousel/incentive
// layout, so the two roles don't feel like reskins of the same screen.
const COMPANY_ACTIONS = [
  { key: 'post', label: 'Post a Job', icon: 'plus-box-outline', nav: ['JobsTab', 'PostJob'] },
  { key: 'browse', label: 'Browse Talent', icon: 'account-search-outline', nav: ['CandidatesTab'] },
  { key: 'jobs', label: 'My Postings', icon: 'briefcase-outline', nav: ['JobsTab', 'MyJobs'] },
  { key: 'hired', label: 'Hired', icon: 'account-check-outline', nav: ['CandidatesTab', 'HiredCandidates'] },
];

const JOB_STATUS_META = {
  open: { label: 'Open', color: colors.success },
  closed: { label: 'Closed', color: colors.textMuted },
  filled: { label: 'Filled', color: colors.primary },
  draft: { label: 'Draft', color: colors.secondary },
};

function CompanyHome({ navigation }) {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [jobsRes, subRes] = await Promise.allSettled([
        jobApi.getMine(),
        subscriptionApi.getStatus(),
      ]);
      if (jobsRes.status === 'fulfilled') setJobs(jobsRes.value.data.data?.jobs || []);
      if (subRes.status === 'fulfilled') setSubscription(subRes.value.data.data?.subscription || null);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  if (loading && !jobs.length) return <LoadingView />;

  const openCount = jobs.filter((j) => j.status === 'open').length;
  const recentJobs = jobs.slice(0, 3);
  const planLabel = subscription?.name || (subscription?.tier ? subscription.tier : 'Free');

  const go = ([screen, nested]) => {
    if (nested) navigation.navigate(screen, { screen: nested });
    else navigation.navigate(screen);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.companyScrollContent}>
      <Animated.View entering={FadeInUp.duration(450)}>
      <LinearGradient colors={[colors.primaryDark, colors.primary]} style={styles.companyHero}>
        <View style={styles.companyHeroTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.companyGreeting}>Welcome back,</Text>
            <Text style={styles.companyName} numberOfLines={1}>{user?.companyName || user?.name}</Text>
          </View>
          <SafeAvatar
            uri={user?.profileImage || user?.logo}
            size={52}
            fallbackSource={require('../../../assets/icon.png')}
            style={styles.companyAvatar}
          />
        </View>

        <View style={styles.companyPlanPill}>
          <MaterialCommunityIcons name="shield-star-outline" size={14} color="#fff" />
          <Text style={styles.companyPlanText}>{planLabel} plan</Text>
        </View>

        <View style={styles.companyStatsRow}>
          <View style={styles.companyStatCard}>
            <Text style={styles.companyStatValue}>{jobs.length}</Text>
            <Text style={styles.companyStatLabel}>Total postings</Text>
          </View>
          <View style={styles.companyStatDivider} />
          <View style={styles.companyStatCard}>
            <Text style={styles.companyStatValue}>{openCount}</Text>
            <Text style={styles.companyStatLabel}>Open now</Text>
          </View>
          <View style={styles.companyStatDivider} />
          <View style={styles.companyStatCard}>
            <Text style={styles.companyStatValue}>{jobs.length - openCount}</Text>
            <Text style={styles.companyStatLabel}>Wrapped up</Text>
          </View>
        </View>
      </LinearGradient>
      </Animated.View>

      <View style={styles.companyBody}>
        <Text style={styles.companySectionTitle}>Quick actions</Text>
        <View style={styles.companyActionGrid}>
          {COMPANY_ACTIONS.map((action, ai) => (
            <Animated.View key={action.key} entering={FadeInUp.delay(100 + ai * 60)} style={{ width: '47%' }}>
            <AnimatedPressable style={styles.companyActionTile} onPress={() => go(action.nav)} scaleTo={0.95}>
              <View style={styles.companyActionIconWrap}>
                <MaterialCommunityIcons name={action.icon} size={22} color={colors.primary} />
              </View>
              <Text style={styles.companyActionLabel}>{action.label}</Text>
            </AnimatedPressable>
            </Animated.View>
          ))}
        </View>

        <View style={styles.companyListHeader}>
          <Text style={styles.companySectionTitle}>Recent postings</Text>
          {jobs.length > 3 && (
            <Pressable onPress={() => go(['JobsTab', 'MyJobs'])}>
              <Text style={styles.companySeeAll}>See all</Text>
            </Pressable>
          )}
        </View>

        {recentJobs.length ? (
          recentJobs.map((job, ji) => {
            const meta = JOB_STATUS_META[job.status] || JOB_STATUS_META.open;
            return (
              <Animated.View key={job._id} entering={FadeInUp.delay(220 + ji * 70)}>
              <AnimatedPressable
                style={styles.companyJobRow}
                onPress={() => go(['JobsTab', 'MyJobs'])}
              >
                <View style={styles.companyJobIconWrap}>
                  <MaterialCommunityIcons name="briefcase-variant-outline" size={18} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.companyJobTitle} numberOfLines={1}>{job.title}</Text>
                  <Text style={styles.companyJobSub} numberOfLines={1}>
                    {job.developerType || 'General'} · {job.jobType || 'Contract'}
                  </Text>
                </View>
                <View style={[styles.companyJobStatusPill, { backgroundColor: `${meta.color}1A` }]}>
                  <Text style={[styles.companyJobStatusText, { color: meta.color }]}>{meta.label}</Text>
                </View>
              </AnimatedPressable>
              </Animated.View>
            );
          })
        ) : (
          <View style={styles.companyEmptyState}>
            <MaterialCommunityIcons name="briefcase-plus-outline" size={28} color={colors.textMuted} />
            <Text style={styles.companyEmptyText}>No jobs posted yet</Text>
            <Button mode="contained" compact onPress={() => go(['JobsTab', 'PostJob'])} style={{ marginTop: spacing.sm }}>
              Post your first job
            </Button>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: spacing.xl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  greeting: { color: colors.textMuted },
  name: { color: colors.text, fontWeight: '700' },

  // Top status bar
  statusBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.lg,
  },
  availabilityPill: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
  },
  availabilityDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#9CA3AF', marginRight: spacing.sm },
  availabilityDotOn: { backgroundColor: colors.success },
  availabilityText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  statusIconsRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  statusIconBtn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: radius.pill,
    paddingHorizontal: spacing.sm, paddingVertical: 6, gap: 4,
  },
  statusIconText: { fontSize: 10, fontWeight: '800', color: colors.text },
  reportBtn: { backgroundColor: '#FEE2E2' },
  reportBtnText: { fontSize: 10, fontWeight: '800', color: colors.error },
  badgeCircle: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },
  badgeText: { fontSize: 7, fontWeight: '700', color: colors.text, marginTop: 1 },

  // Headline + CTA
  headline: { fontSize: 26, fontWeight: '800', color: colors.text, lineHeight: 30 },
  headlineSub: { color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.md },
  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.md, paddingHorizontal: spacing.lg,
  },
  ctaBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  // Invite bar
  inviteBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.surface, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border,
    marginHorizontal: spacing.lg, marginTop: spacing.lg, paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
  },
  inviteLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  inviteText: { color: colors.text, fontWeight: '700' },
  invitePill: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.secondary,
    borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 6,
  },
  invitePillText: { color: '#fff', fontWeight: '700', fontSize: 12, marginRight: 2 },

  // Carousel section
  carouselSection: { marginTop: spacing.xl, paddingLeft: spacing.lg },
  jobsCarousel: { gap: CARD_GAP, paddingRight: spacing.lg },
  jobCard: {
    width: CARD_WIDTH, height: 130, borderRadius: radius.lg, padding: spacing.md,
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
  pageCounterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: spacing.lg, marginTop: spacing.sm },
  pageCounterPill: { backgroundColor: 'rgba(15,23,42,0.85)', borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 3 },
  pageCounterText: { color: '#fff', fontSize: 11, fontWeight: '700' },

  body: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  greetingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headlineRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  homeAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.background },
  flirtyLineCorner: { color: colors.primary, fontWeight: '600', fontSize: 12, maxWidth: 120, textAlign: 'right' },
  row: { flexDirection: 'row', gap: spacing.md },
  half: { flex: 1 },
  rate: { color: colors.primary, fontWeight: '700', marginTop: spacing.lg },

  // Profile-completion "incentive" card
  incentiveCard: {
    backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border,
    padding: spacing.md, marginTop: spacing.xl,
  },
  incentiveHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  incentiveTitle: { color: colors.text, fontWeight: '700', fontSize: 15 },
  incentiveSub: { color: colors.textMuted, fontSize: 12, marginTop: 2, maxWidth: 230 },
  trackRow: { marginTop: spacing.sm, marginBottom: spacing.sm },
  trackLine: { height: 4, backgroundColor: colors.border, borderRadius: 2, overflow: 'hidden' },
  trackLineFill: { height: 4, backgroundColor: colors.success, borderRadius: 2 },
  milestoneRow: { flexDirection: 'row', justifyContent: 'space-between' },
  milestoneItem: { alignItems: 'center' },
  milestoneDot: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: colors.background,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center',
  },
  milestoneDotReached: { backgroundColor: colors.success, borderColor: colors.success },
  milestoneLabel: { color: colors.textMuted, fontSize: 10, marginTop: 4 },

  expandHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.sm,
  },
  sectionHeading: { color: colors.text, fontWeight: '700' },
  aboutBody: { color: colors.textMuted, lineHeight: 20, marginBottom: spacing.sm },
  emptyText: { color: colors.textMuted, fontStyle: 'italic' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: { marginRight: spacing.xs, marginBottom: spacing.xs },

  sectionTitle: { color: colors.text, fontWeight: '700', marginBottom: spacing.md },
  actionBtn: { marginBottom: spacing.md },

  // --- Company dashboard: distinct visual language from the candidate
  // home screen (gradient stat hero + icon-tile actions instead of a
  // carousel/incentive-tracker layout). ---
  companyScrollContent: { paddingBottom: spacing.xl },
  companyHero: {
    paddingTop: spacing.xl, paddingBottom: spacing.lg, paddingHorizontal: spacing.lg,
    borderBottomLeftRadius: radius.lg, borderBottomRightRadius: radius.lg,
  },
  companyHeroTop: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  companyGreeting: { color: 'rgba(255,255,255,0.75)', fontSize: 13 },
  companyName: { color: '#fff', fontWeight: '800', fontSize: 20, marginTop: 2 },
  companyAvatar: { borderWidth: 2, borderColor: 'rgba(255,255,255,0.6)' },
  companyPlanPill: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: radius.pill,
    paddingHorizontal: spacing.sm, paddingVertical: 5, marginBottom: spacing.lg,
  },
  companyPlanText: { color: '#fff', fontWeight: '700', fontSize: 11, textTransform: 'capitalize' },
  companyStatsRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: radius.lg, paddingVertical: spacing.md,
  },
  companyStatCard: { flex: 1, alignItems: 'center' },
  companyStatValue: { color: '#fff', fontWeight: '800', fontSize: 20 },
  companyStatLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 11, marginTop: 2, textAlign: 'center' },
  companyStatDivider: { width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.25)' },

  companyBody: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  companySectionTitle: { color: colors.text, fontWeight: '700', fontSize: 15, marginBottom: spacing.md },
  companyActionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl },
  companyActionTile: {
    backgroundColor: colors.surface, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.border, padding: spacing.md,
  },
  companyActionIconWrap: {
    width: 38, height: 38, borderRadius: radius.md, backgroundColor: `${colors.primary}14`,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm,
  },
  companyActionLabel: { color: colors.text, fontWeight: '700', fontSize: 13 },

  companyListHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  companySeeAll: { color: colors.primary, fontWeight: '700', fontSize: 12, marginBottom: spacing.md },
  companyJobRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    padding: spacing.sm, marginBottom: spacing.sm,
  },
  companyJobIconWrap: {
    width: 34, height: 34, borderRadius: 17, backgroundColor: `${colors.primary}14`,
    alignItems: 'center', justifyContent: 'center',
  },
  companyJobTitle: { color: colors.text, fontWeight: '700', fontSize: 13 },
  companyJobSub: { color: colors.textMuted, fontSize: 11, marginTop: 1, textTransform: 'capitalize' },
  companyJobStatusPill: { borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 4 },
  companyJobStatusText: { fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
  companyEmptyState: {
    alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed', padding: spacing.xl,
  },
  companyEmptyText: { color: colors.textMuted, marginTop: spacing.sm, fontWeight: '600' },
});
