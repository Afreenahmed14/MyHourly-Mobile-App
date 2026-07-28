import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { candidateService } from '../../src/api/candidateService';
import { colors, spacing, fontSize, radius } from '../../src/constants/theme';

export default function CandidateDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [candidate, setCandidate] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    candidateService
      .getById(id)
      .then((res) => setCandidate(res.data?.candidate ?? res.data))
      .catch(() => setError('Could not load this profile. Log in to view full details.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.page} contentContainerStyle={{ padding: spacing.xl }}>
      <Text style={styles.name}>{candidate?.name}</Text>
      <Text style={styles.developerType}>{candidate?.developerType}</Text>
      {candidate?.hourlyRate ? (
        <Text style={styles.rate}>₹{candidate.hourlyRate}/hr</Text>
      ) : null}

      {candidate?.about ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.body}>{candidate.about}</Text>
        </View>
      ) : null}

      {candidate?.skills?.length ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <Text style={styles.body}>{candidate.skills.join(', ')}</Text>
        </View>
      ) : null}

      {/* Contact details / portfolio links only appear here once the backend
          returns them — per companyController.js these are gated behind an
          active subscription, same as the web app. */}
      {candidate?.email || candidate?.phone ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <Text style={styles.body}>{candidate.email}</Text>
          <Text style={styles.body}>{candidate.phone}</Text>
        </View>
      ) : (
        <View style={styles.lockedBox}>
          <Text style={styles.lockedText}>
            Contact details are unlocked with an active company subscription.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  error: { color: colors.danger, textAlign: 'center', padding: spacing.xl },
  name: { fontSize: fontSize.xxl, fontWeight: '700', color: colors.text },
  developerType: { color: colors.primary, fontSize: fontSize.base, fontWeight: '600', marginTop: spacing.xs },
  rate: { color: colors.text, fontSize: fontSize.lg, fontWeight: '700', marginTop: spacing.sm },
  section: { marginTop: spacing.xl },
  sectionTitle: { fontSize: fontSize.base, fontWeight: '700', color: colors.text, marginBottom: spacing.xs },
  body: { color: colors.textMuted, fontSize: fontSize.sm, lineHeight: 20 },
  lockedBox: {
    marginTop: spacing.xl,
    backgroundColor: colors.warningLight,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  lockedText: { color: colors.warning, fontSize: fontSize.sm },
});
