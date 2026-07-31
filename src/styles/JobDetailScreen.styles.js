import { StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 60 },

  card: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.md },
  logoBadge: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  logoBadgeText: { color: colors.white, fontWeight: '800', fontSize: 16 },
  title: { fontSize: 19, fontWeight: '800', color: colors.text },
  company: { fontSize: 13, color: colors.textMuted, marginTop: 2 },

  metaRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.md },
  metaItem: { flexDirection: 'row', alignItems: 'center', marginRight: spacing.md, marginBottom: 4 },
  metaText: { fontSize: 12, color: colors.textMuted, marginLeft: 4 },

  divider: { height: 1, backgroundColor: colors.border, marginBottom: spacing.md },

  salary: { fontSize: 18, fontWeight: '800', color: colors.primaryDark, marginBottom: spacing.sm },
  experienceText: { fontSize: 13, color: colors.textMuted, marginBottom: 4 },
  skillChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: spacing.lg,
  },
  skillChipText: { fontSize: 11, color: colors.primaryDark, fontWeight: '700' },

  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  descriptionText: { fontSize: 14, color: colors.text, lineHeight: 20, marginBottom: spacing.lg },

  applyBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  applyBtnText: { color: colors.white, fontWeight: '700', fontSize: 15 },

  appliedBadge: {
    backgroundColor: '#DCFCE7',
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  appliedBadgeText: { color: colors.success, fontWeight: '700', fontSize: 14 },

  // Apply modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: { fontSize: 16, fontWeight: '700', color: colors.text, flexShrink: 1, marginRight: spacing.sm },
  modalBody: { padding: spacing.lg },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: spacing.xs },
  coverLetterInput: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: 14,
    color: colors.text,
    minHeight: 110,
    textAlignVertical: 'top',
    marginBottom: spacing.lg,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitBtnText: { color: colors.white, fontWeight: '700', fontSize: 15 },

  // Confirmation modal
  confirmBody: { padding: spacing.xl, alignItems: 'center' },
  confirmIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  confirmText: { fontSize: 15, fontWeight: '600', color: colors.text, marginBottom: spacing.lg },
  confirmOkBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 12,
    paddingHorizontal: 40,
  },
  confirmOkBtnText: { color: colors.white, fontWeight: '700', fontSize: 14 },
});
