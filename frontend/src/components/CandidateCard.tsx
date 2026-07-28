import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radius, spacing, fontSize, shadow } from '../constants/theme';

type Candidate = {
  _id: string;
  name: string;
  developerType?: string;
  hourlyRate?: number;
  about?: string;
  skills?: string[];
  isVerified?: boolean;
};

export default function CandidateCard({
  candidate,
  onPress,
}: {
  candidate: Candidate;
  onPress: () => void;
}) {
  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && { opacity: 0.9 }]} onPress={onPress}>
      <View style={styles.headerRow}>
        <Text style={styles.name}>{candidate.name}</Text>
        {candidate.isVerified ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Verified</Text>
          </View>
        ) : null}
      </View>
      {candidate.developerType ? (
        <Text style={styles.developerType}>{candidate.developerType}</Text>
      ) : null}
      {candidate.about ? (
        <Text style={styles.about} numberOfLines={2}>
          {candidate.about}
        </Text>
      ) : null}
      <View style={styles.footerRow}>
        {candidate.hourlyRate ? (
          <Text style={styles.rate}>₹{candidate.hourlyRate}/hr</Text>
        ) : (
          <View />
        )}
        {candidate.skills?.length ? (
          <Text style={styles.skills} numberOfLines={1}>
            {candidate.skills.slice(0, 3).join(' · ')}
          </Text>
        ) : null}
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
  name: { fontSize: fontSize.lg, fontWeight: '700', color: colors.text },
  badge: {
    backgroundColor: colors.successLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  badgeText: { color: colors.success, fontSize: fontSize.xs, fontWeight: '600' },
  developerType: { color: colors.primary, fontSize: fontSize.sm, marginTop: 2, fontWeight: '500' },
  about: { color: colors.textMuted, fontSize: fontSize.sm, marginTop: spacing.xs },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  rate: { fontWeight: '700', color: colors.text, fontSize: fontSize.base },
  skills: { color: colors.textMuted, fontSize: fontSize.xs, flexShrink: 1, marginLeft: spacing.sm },
});
