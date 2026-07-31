import { StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme';

export default StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardHighlight: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: '#EFF6FF',
  },
  cardCurrent: {
    borderWidth: 1.5,
    borderColor: colors.success,
  },
  cardCompact: { padding: spacing.md, marginBottom: spacing.sm },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  label: { fontSize: 14, fontWeight: '700', color: colors.text },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeText: { fontSize: 10, fontWeight: '800', color: colors.white, letterSpacing: 0.5 },

  priceRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: spacing.sm, marginBottom: spacing.md },
  price: { fontSize: 28, fontWeight: '800', color: colors.text },
  priceCompact: { fontSize: 22 },
  period: { fontSize: 13, color: colors.textMuted, marginLeft: 4, marginBottom: 4 },

  featureRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.sm },
  featureText: { fontSize: 13, color: colors.text, marginLeft: 8, flex: 1, lineHeight: 18 },

  ctaBtn: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  ctaBtnHighlight: { backgroundColor: colors.primary },
  ctaBtnCurrent: { backgroundColor: colors.white, borderColor: colors.success },
  ctaBtnText: { fontSize: 14, fontWeight: '700', color: colors.primary },
  ctaBtnTextHighlight: { color: colors.white },
  ctaBtnTextCurrent: { color: colors.success },
});
