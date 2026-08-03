import { StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },

  title: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: spacing.lg },

  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  planLabel: { fontSize: 12, color: colors.textMuted, marginBottom: 4 },
  planName: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: spacing.lg },

  usageRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.lg },
  usageCol: { flex: 1 },
  usageLabel: { fontSize: 12, color: colors.textMuted, marginBottom: 4 },
  usageValue: { fontSize: 14, fontWeight: '700', color: colors.text },

  upgradeBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  upgradeBtnText: { color: colors.white, fontWeight: '700', fontSize: 15 },
});
