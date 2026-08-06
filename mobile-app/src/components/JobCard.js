import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { legacyColors as colors, legacyRadius as radius, legacySpacing as spacing } from '../theme/legacyTheme';

const formatSalary = (job) => {
  if (!job.salaryMin && !job.salaryMax) return null;
  const range = [job.salaryMin, job.salaryMax].filter(Boolean).join(' – ');
  return `₹${range} / ${job.payType || 'yearly'}`;
};

const timeAgo = (dateStr) => {
  if (!dateStr) return null;
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return 'Today';
  if (days === 1) return '1d ago';
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}m ago`;
};

const initials = (name) =>
  (name || 'J').split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

/**
 * Job card — pixel-for-pixel port of the MyHourly reference app's JobCard
 * component and its CSS (logo badge, title/company, meta icon row,
 * salary, Applied badge, primary-skill chip), wired to real job fields.
 */
export default function JobCard({ job, onPress }) {
  const salary = formatSalary(job);
  const posted = timeAgo(job.createdAt);
  const companyName = job.companyId?.companyName || 'Company';
  const companyLogo = job.companyId?.logo;
  const primarySkill = (job.skills && job.skills[0]) || job.primarySkill;
  const locationText = job.location?.remote ? 'Remote' : job.location?.city;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.topRow}>
        {companyLogo ? (
          <Image source={{ uri: companyLogo }} style={styles.logoImage} />
        ) : (
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>{initials(companyName)}</Text>
          </View>
        )}
        <View style={styles.titleBlock}>
          <Text style={styles.title} numberOfLines={1}>{job.title}</Text>
          <Text style={styles.company} numberOfLines={1}>{companyName}</Text>
        </View>
        {job.hasApplied && (
          <View style={styles.appliedBadge}>
            <Text style={styles.appliedBadgeText}>Applied</Text>
          </View>
        )}
      </View>

      <View style={styles.metaRow}>
        {!!job.jobType && (
          <View style={styles.metaItem}>
            <Ionicons name="briefcase-outline" size={12} color={colors.textMuted} />
            <Text style={styles.metaText}>{job.jobType}</Text>
          </View>
        )}
        {!!locationText && (
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={12} color={colors.textMuted} />
            <Text style={styles.metaText}>{locationText}</Text>
          </View>
        )}
        {!!posted && (
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={12} color={colors.textMuted} />
            <Text style={styles.metaText}>{posted}</Text>
          </View>
        )}
      </View>

      {!!salary && <Text style={styles.salary}>{salary}</Text>}

      {!!primarySkill && (
        <View style={styles.skillChip}>
          <Text style={styles.skillChipText}>{primarySkill}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
  logoImage: { width: 40, height: 40, borderRadius: radius.sm, marginRight: spacing.sm, backgroundColor: colors.border },
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
