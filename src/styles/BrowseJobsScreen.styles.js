import { StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 40 },

  headerCard: {
    borderWidth: 1.5,
    borderColor: colors.text,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  title: { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: spacing.sm },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCEBFC',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  searchInput: { flex: 1, paddingVertical: 10, marginLeft: 8, fontSize: 14, color: colors.text },

  filterRow: { flexDirection: 'row', flexWrap: 'wrap' },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: colors.white,
  },
  filterChipActive: { borderColor: colors.primary, backgroundColor: '#EFF6FF' },
  filterChipText: { fontSize: 12, fontWeight: '600', color: colors.text, marginRight: 4 },
  filterChipTextActive: { color: colors.primaryDark },

  resultsCount: { fontSize: 12, color: colors.textMuted, marginBottom: spacing.md },

  emptyState: { alignItems: 'center', paddingVertical: spacing.xxl },
  emptyText: { color: colors.textMuted, marginTop: spacing.sm },

  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    maxHeight: '60%',
    paddingBottom: spacing.lg,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sheetTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  done: { color: colors.primary, fontWeight: '700' },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  optionText: { fontSize: 15, color: colors.text },
});
