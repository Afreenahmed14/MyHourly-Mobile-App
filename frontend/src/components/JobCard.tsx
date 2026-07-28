import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radius, spacing, fontSize, shadow } from '../constants/theme';

type Job = {
  _id: string;
  title: string;
  jobType?: string;
  description?: string;
  skills?: string[];
  salaryMin?: number;
  salaryMax?: number;
  payType?: string;
  location?: { city?: string; remote?: boolean };
  companyId?: { companyName?: string };
  hasApplied?: boolean;
};

export default function JobCard({ job, onPress }: { job: Job; onPress: () => void }) {
  const salary =
    job.salaryMin || job.salaryMax
      ? `₹${job.salaryMin ?? ''}${job.salaryMax ? `–₹${job.salaryMax}` : ''}${
          job.payType ? `/${job.payType}` : ''
        }`
      : null;

  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && { opacity: 0.9 }]} onPress={onPress}>
      <View style={styles.headerRow}>
        <Text style={styles.title} numberOfLines={1}>{job.title}</Text>
        {job.hasApplied ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Applied</Text>
          </View>
        ) : null}
      </View>
      {job.companyId?.companyName ? (
        <Text style={styles.company}>{job.companyId.companyName}</Text>
      ) : null}
      {job.description ? (
        <Text style={styles.description} numberOfLines={2}>{job.description}</Text>
      ) : null}
      <View style={styles.footerRow}>
        {salary ? <Text style={styles.salary}>{salary}</Text> : <View />}
        <Text style={styles.meta} numberOfLines={1}>
          {[job.jobType, job.location?.remote ? 'Remote' : job.location?.city].filter(Boolean).join(' · ')}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadow.sm,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: fontSize.lg, fontWeight: '700', color: colors.text, flexShrink: 1 },
  badge: {
    backgroundColor: colors.infoLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  badgeText: { color: colors.info, fontSize: fontSize.xs, fontWeight: '600' },
  company: { color: colors.primary, fontSize: fontSize.sm, marginTop: 2, fontWeight: '500' },
  description: { color: colors.textMuted, fontSize: fontSize.sm, marginTop: spacing.xs },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  salary: { fontWeight: '700', color: colors.text, fontSize: fontSize.base },
  meta: { color: colors.textMuted, fontSize: fontSize.xs, flexShrink: 1, marginLeft: spacing.sm },
});
