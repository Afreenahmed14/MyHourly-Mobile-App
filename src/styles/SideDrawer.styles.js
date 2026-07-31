import { StyleSheet, Dimensions } from 'react-native';
import { colors, radius, spacing } from '../theme';

const { width } = Dimensions.get('window');
export const DRAWER_WIDTH = Math.min(320, width * 0.82);

export default StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  panel: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: colors.white,
    paddingTop: 50,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logoImage: { width: 30, height: 30 },

  userRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  avatarImage: { width: 44, height: 44, borderRadius: 22, marginRight: spacing.sm },
  avatarText: { color: colors.white, fontWeight: '700', fontSize: 17 },
  userName: { fontSize: 15, fontWeight: '700', color: colors.text },
  userRole: { fontSize: 12, color: colors.textMuted, marginTop: 1 },
  viewProfileLink: { fontSize: 12, color: colors.primary, fontWeight: '700', marginTop: 4 },

  divider: { height: 1, backgroundColor: colors.border },

  navList: { paddingVertical: spacing.sm },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.sm,
    marginVertical: 3,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderRadius: radius.md,
  },
  navItemActive: { backgroundColor: colors.primary },
  navItemText: { fontSize: 14, fontWeight: '600', color: colors.text, marginLeft: 12 },
  navItemTextActive: { color: colors.white },

  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: spacing.sm,
    paddingBottom: spacing.lg,
  },
  logoutText: { color: colors.danger },
});
