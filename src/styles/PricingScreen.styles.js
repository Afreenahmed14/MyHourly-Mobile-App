import { StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 48 },

  pageTitle: { fontSize: 22, fontWeight: '800', color: colors.text, textAlign: 'center' },
  pageSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
    lineHeight: 18,
  },

  section: { marginBottom: spacing.xl },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: colors.text, textAlign: 'center' },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: spacing.md,
  },

  planStack: { gap: spacing.md },

  planCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  planCardBest: {
    borderColor: colors.primary,
    borderWidth: 1.5,
    backgroundColor: '#EFF6FF',
  },

  bestBadge: {
    position: 'absolute',
    top: -10,
    right: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  bestBadgeText: { color: colors.white, fontSize: 10, fontWeight: '800' },

  planName: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 4, marginBottom: spacing.md },
  price: { fontSize: 26, fontWeight: '800', color: colors.text },
  period: { fontSize: 13, color: colors.textMuted, marginLeft: 4, marginBottom: 4 },

  featureList: { marginBottom: spacing.lg },
  featureRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  featureIcon: { marginTop: 2, marginRight: 6 },
  featureText: { flex: 1, fontSize: 13, color: colors.text, lineHeight: 18 },

  ctaBtn: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  ctaBtnBest: { backgroundColor: colors.primary, borderColor: colors.primary },
  ctaBtnText: { color: colors.primary, fontWeight: '700', fontSize: 14 },
  ctaBtnTextBest: { color: colors.white },
  ctaBtnCurrent: { backgroundColor: colors.background, borderColor: colors.border },
  ctaBtnTextCurrent: { color: colors.textMuted },

  pickerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  pickerBackdropPress: { ...StyleSheet.absoluteFillObject },
  pickerCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    maxHeight: '85%',
  },
  pickerHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  pickerTitle: { fontSize: 18, fontWeight: '800', color: colors.text, flex: 1, marginRight: spacing.sm },
  pickerSubtitle: { fontSize: 12, color: colors.textMuted, marginTop: 4, marginBottom: spacing.md, lineHeight: 17 },

  pickerTabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.md,
  },
  pickerTabBtn: { marginRight: spacing.lg, paddingBottom: spacing.sm },
  pickerTabText: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
  pickerTabTextActive: { color: colors.primary },
  pickerTabUnderline: {
    marginTop: 6,
    height: 2,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },
  pickerSectionSubtitle: { fontSize: 12, color: colors.textMuted, marginBottom: spacing.md },
});
