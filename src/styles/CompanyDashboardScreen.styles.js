import { StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },

  brandBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.md,
    marginBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  brandLogoRow: { flexDirection: 'row', alignItems: 'center' },
  hamburgerBtn: { marginRight: spacing.sm },
  brandLogoImage: { width: 36, height: 36, marginRight: spacing.sm },
  brandName: { fontSize: 16, fontWeight: '800', color: colors.text },
  brandTagline: { fontSize: 8, fontWeight: '700', color: colors.textMuted, letterSpacing: 0.3, marginTop: 1 },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: { fontSize: 24, fontWeight: '800', color: colors.text },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.md,
  },
  editBtnText: { color: colors.white, fontWeight: '700', fontSize: 13, marginLeft: 6 },

  authStatusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  authStatusText: { fontSize: 12, color: colors.textMuted, marginLeft: 6, fontWeight: '600' },

  alert: {
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
    backgroundColor: '#FFFBEB',
    padding: spacing.md,
    borderRadius: radius.sm,
    marginBottom: spacing.lg,
  },
  alertText: { color: '#78350F', fontSize: 13, lineHeight: 18 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: { width: '48%' },
  statLabel: { fontSize: 12, color: colors.textMuted, marginBottom: 6 },
  statValue: { fontSize: 20, fontWeight: '800', color: colors.text },
  statSub: { fontSize: 12, fontWeight: '400', color: colors.textMuted },
  badge: {
    backgroundColor: '#F3F4F6',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    marginTop: 4,
  },
  badgeText: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
  badgeSuccess: { backgroundColor: '#DCFCE7' },
  badgeSuccessText: { color: colors.success },

  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  seeAllText: { fontSize: 13, color: colors.primary, fontWeight: '700' },
  summaryText: { color: colors.textMuted, fontSize: 14, lineHeight: 20 },

  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  quickCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  quickIconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  quickCardTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 2 },
  quickCardSubtitle: { fontSize: 11, color: colors.textMuted, lineHeight: 15 },

  jobRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  jobRowLast: { borderBottomWidth: 0 },
  jobTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  jobMeta: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  jobOpenBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  jobOpenBadgeText: { fontSize: 11, fontWeight: '700', color: colors.success },

  emptyText: { color: colors.textMuted, fontSize: 13, fontStyle: 'italic' },

  starRow: { flexDirection: 'row', marginBottom: 6 },
  starIcon: { marginRight: 2 },

  ctaBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  ctaBtnText: { color: colors.white, fontWeight: '700', fontSize: 14 },
});
