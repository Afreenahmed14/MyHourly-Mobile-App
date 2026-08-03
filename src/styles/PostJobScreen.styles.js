import { StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 60 },

  eyebrow: { fontSize: 11, fontWeight: '800', color: colors.primary, letterSpacing: 0.5, marginBottom: 6 },
  pageTitle: { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: 4 },
  pageSubtitle: { fontSize: 12, color: colors.textMuted, marginBottom: spacing.lg },

  formCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionLabelFirst: { marginTop: 0 },
  sectionDivider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.lg },

  field: { marginBottom: spacing.lg },
  label: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: spacing.xs },
  required: { color: colors.danger },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.white,
  },
  textArea: { minHeight: 90, textAlignVertical: 'top' },
  error: { color: colors.danger, fontSize: 12, marginTop: 4 },

  row: { flexDirection: 'row', marginHorizontal: -6 },
  rowItem: { flex: 1, marginHorizontal: 6 },

  pickerBox: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },

  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginTop: -4, marginBottom: spacing.sm },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkboxChecked: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkboxLabel: { fontSize: 13, color: colors.text, fontWeight: '600' },

  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  submitBtnText: { color: colors.white, fontWeight: '700', fontSize: 15 },
});
