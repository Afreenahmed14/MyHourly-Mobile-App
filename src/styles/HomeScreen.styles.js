import { StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme';

const navy = '#0B1B4D';
const navyDark = '#081536';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing.xxl },

  // Top brand bar
  brandBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  brandLogoRow: { flexDirection: 'row', alignItems: 'center' },
  brandLogoImage: { width: 32, height: 32, marginRight: spacing.sm },
  brandName: { fontSize: 15, fontWeight: '800', color: colors.text },
  brandTagline: { fontSize: 7, fontWeight: '700', color: colors.textMuted, letterSpacing: 0.3 },
  loginLink: { fontSize: 13, fontWeight: '700', color: colors.primary },

  // Hero
  hero: { backgroundColor: '#E9EEFC', paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  verifiedBadge: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: spacing.md,
  },
  verifiedBadgeText: { fontSize: 11, fontWeight: '700', color: colors.success, marginLeft: 4 },
  heroTitle: { fontSize: 30, fontWeight: '800', color: colors.text, lineHeight: 36 },
  heroTitleAccent: { color: colors.primary },
  heroSubtitle: { fontSize: 14, color: colors.textMuted, lineHeight: 21, marginTop: spacing.md },
  heroBtnRow: { marginTop: spacing.xl },
  heroPrimaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  heroPrimaryBtnText: { color: colors.white, fontWeight: '700', fontSize: 15 },
  heroSecondaryBtn: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  heroSecondaryBtnText: { color: colors.primary, fontWeight: '700', fontSize: 15 },

  // Stats bar
  statsBar: {
    flexDirection: 'row',
    backgroundColor: navy,
    marginHorizontal: spacing.lg,
    marginTop: -spacing.xl,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    justifyContent: 'space-around',
  },
  statItem: { alignItems: 'center', paddingHorizontal: spacing.sm },
  statCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  statNumber: { color: colors.white, fontSize: 16, fontWeight: '800' },
  statLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 10, fontWeight: '600', textAlign: 'center', marginTop: 2 },

  // Section shared
  section: { paddingHorizontal: spacing.lg, paddingTop: spacing.xxl },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: colors.text, textAlign: 'center' },
  sectionSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
    lineHeight: 19,
  },

  // How it works
  stepCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginTop: spacing.md,
    alignItems: 'flex-start',
  },
  stepIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  stepNumber: { fontSize: 11, fontWeight: '800', color: colors.primary, marginBottom: 2 },
  stepTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  stepDesc: { fontSize: 12, color: colors.textMuted, marginTop: 2, lineHeight: 17 },

  // Skills tree (dark section)
  skillsSection: {
    backgroundColor: navyDark,
    marginTop: spacing.xxl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
  },
  skillsIconRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: spacing.lg },
  skillsIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  skillsTitle: { fontSize: 18, fontWeight: '800', color: colors.white, textAlign: 'center' },
  skillsSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 18,
  },
  skillsLinkRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: spacing.lg },
  skillsLinkText: { color: '#93C5FD', fontWeight: '700', fontSize: 13, marginRight: 4 },

  // Are you an engineer / company CTA cards
  ctaCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
  ctaTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: spacing.sm },
  ctaBullet: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.sm },
  ctaBulletText: { fontSize: 13, color: colors.textMuted, marginLeft: spacing.sm, flex: 1, lineHeight: 18 },
  ctaBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  ctaBtnOutline: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: spacing.sm,
    backgroundColor: colors.white,
  },
  ctaBtnText: { color: colors.white, fontWeight: '700', fontSize: 14 },
  ctaBtnOutlineText: { color: colors.primary, fontWeight: '700', fontSize: 14 },
});
