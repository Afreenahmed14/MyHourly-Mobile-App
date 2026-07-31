import { StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 40 },

  pageTitle: { fontSize: 22, fontWeight: '800', color: colors.text, textAlign: 'center' },
  pageSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
    lineHeight: 18,
  },

  groupCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  groupHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  groupTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginLeft: 8 },

  chipRow: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: {
    backgroundColor: '#EFF6FF',
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: { color: colors.primaryDark, fontSize: 12, fontWeight: '600' },
});
