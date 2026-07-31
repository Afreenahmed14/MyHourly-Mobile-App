import { StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  headerCard: { paddingVertical: spacing.lg },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarText: { color: colors.white, fontSize: 22, fontWeight: '700' },
  name: { fontSize: 18, fontWeight: '800', color: colors.text },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  ratingText: { fontSize: 12, color: colors.textMuted },
  rateBox: { alignItems: 'flex-end' },
  rateValue: { fontSize: 18, fontWeight: '800', color: colors.primary },
  rateUnit: { fontSize: 12, color: colors.textMuted },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  bodyText: { fontSize: 14, color: colors.textMuted, lineHeight: 20 },
  skillsWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  skillChip: {
    backgroundColor: '#EFF6FF',
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  skillChipText: { color: colors.primaryDark, fontWeight: '600', fontSize: 12 },
});
