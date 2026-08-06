import { View, StyleSheet, Pressable } from 'react-native';
import { Text, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '../theme/theme';

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
 * Job card — visual design ported from the MyHourly reference app's
 * JobCard component (logo badge, title/company, meta icon row, salary,
 * Applied badge), adapted to our real job fields.
 */
export default function JobCard({ job, onPress }) {
  const salary = formatSalary(job);
  const posted = timeAgo(job.createdAt);
  const companyName = job.companyId?.companyName || 'Company';

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.topRow}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoBadgeText}>{initials(companyName)}</Text>
        </View>
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
        {(job.location?.city || job.location?.remote) && (
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={12} color={colors.textMuted} />
            <Text style={styles.metaText}>{job.location?.remote ? 'Remote' : job.location.city}</Text>
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
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  topRow: { flexDirection: 'row', alignItems: 'center' },
  logoBadge: {
    width: 44, height: 44, borderRadius: radius.sm, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  logoBadgeText: { color: '#fff', fontWeight: '700' },
  titleBlock: { flex: 1, marginLeft: spacing.sm },
  title: { color: colors.text, fontWeight: '700', fontSize: 15 },
  company: { color: colors.textMuted, marginTop: 2, fontSize: 13 },
  appliedBadge: { backgroundColor: '#DCFCE7', borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 2 },
  appliedBadgeText: { color: colors.success, fontSize: 11, fontWeight: '700' },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.sm },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { color: colors.textMuted, fontSize: 12 },
  salary: { color: colors.primary, fontWeight: '700', marginTop: spacing.sm },
});
