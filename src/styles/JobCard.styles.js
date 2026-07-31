import { StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme';

export default StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  topRow: { flexDirection: 'row', alignItems: 'flex-start' },
  logoBadge: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  logoBadgeText: { color: colors.white, fontWeight: '800', fontSize: 13 },
  titleBlock: { flex: 1 },
  title: { fontSize: 15, fontWeight: '700', color: colors.text },
  company: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  appliedBadge: {
    backgroundColor: '#DCFCE7',
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  appliedBadgeText: { fontSize: 11, color: colors.success, fontWeight: '700' },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.sm },
  metaItem: { flexDirection: 'row', alignItems: 'center', marginRight: spacing.md, marginBottom: 4 },
  metaText: { fontSize: 11, color: colors.textMuted, marginLeft: 4 },
  salary: { fontSize: 14, fontWeight: '800', color: colors.primaryDark, marginTop: spacing.sm },
  skillChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: spacing.sm,
  },
  skillChipText: { fontSize: 11, color: colors.primaryDark, fontWeight: '700' },
});
