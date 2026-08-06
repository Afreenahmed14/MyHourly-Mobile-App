import { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Chip, Button, Avatar, Divider, Dialog, Portal, TextInput } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { candidateApi } from '../../api/candidateApi';
import { reviewApi } from '../../api/reviewApi';
import { useAuth } from '../../context/useAuth';
import StarRating from '../../components/StarRating';
import LoadingView from '../../components/LoadingView';
import { colors, spacing, radius } from '../../theme/theme';

/**
 * Native port of CandidateDetails page. Backend already returns a locked
 * (teaser) or full profile depending on the viewer's subscription — this
 * screen just renders whatever comes back, same as web.
 */
export default function CandidateDetailsScreen({ route }) {
  const { candidateId } = route.params;
  const { role } = useAuth();
  const [data, setData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hiring, setHiring] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [actionError, setActionError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [profileRes, reviewsRes] = await Promise.all([
        candidateApi.getById(candidateId),
        reviewApi.getForCandidate(candidateId),
      ]);
      setData(profileRes.data.data);
      setReviews(reviewsRes.data.data.reviews);
    } finally {
      setLoading(false);
    }
  }, [candidateId]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const onHire = async () => {
    setActionError('');
    setHiring(true);
    try {
      await candidateApi.hire(candidateId, {});
      load();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Could not hire this engineer.');
    } finally {
      setHiring(false);
    }
  };

  const submitReview = async () => {
    setActionError('');
    try {
      await reviewApi.create({ candidateId, rating, review: reviewText });
      setReviewDialogOpen(false);
      setReviewText('');
      load();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Could not submit review.');
    }
  };

  if (loading) return <LoadingView />;
  if (!data) return null;

  const { candidate, socialLocked, profileLocked, hire } = data;
  const canReview = role === 'company' || role === 'candidate';

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.lg }}>
      <View style={styles.headerRow}>
        <Avatar.Image
          size={72}
          source={candidate.profileImage ? { uri: candidate.profileImage } : require('../../../assets/icon.png')}
        />
        <View style={{ marginLeft: spacing.md, flex: 1 }}>
          <Text variant="headlineSmall" style={styles.name}>{candidate.name}</Text>
          {!!candidate.headline && <Text variant="bodyMedium" style={styles.headline}>{candidate.headline}</Text>}
          <View style={styles.ratingRow}>
            <StarRating rating={candidate.rating || 0} />
            <Text variant="bodySmall" style={styles.reviewCount}>({candidate.reviewsCount || 0} reviews)</Text>
          </View>
        </View>
      </View>

      {!!candidate.hourlyRate && (
        <Text variant="titleMedium" style={styles.rate}>₹{candidate.hourlyRate}/hr</Text>
      )}

      {profileLocked && (
        <View style={styles.lockedBanner}>
          <Text style={styles.lockedText}>
            Upgrade your plan to view this engineer's full profile and hire them.
          </Text>
        </View>
      )}

      {!!candidate.about && (
        <>
          <Text variant="titleMedium" style={styles.sectionHeading}>About</Text>
          <Text variant="bodyMedium" style={styles.body}>{candidate.about}</Text>
        </>
      )}

      {!!(candidate.primarySkills?.length || candidate.skills?.length) && (
        <>
          <Text variant="titleMedium" style={styles.sectionHeading}>Skills</Text>
          <View style={styles.chipRow}>
            {(candidate.primarySkills || candidate.skills || []).map((s) => (
              <Chip key={s} mode="outlined" style={styles.chip}>{s}</Chip>
            ))}
          </View>
        </>
      )}

      {!socialLocked && (candidate.github || candidate.linkedin) && (
        <>
          <Text variant="titleMedium" style={styles.sectionHeading}>Links</Text>
          {!!candidate.github && <Text style={styles.link}>{candidate.github}</Text>}
          {!!candidate.linkedin && <Text style={styles.link}>{candidate.linkedin}</Text>}
        </>
      )}

      {!!hire && (
        <>
          <Divider style={styles.divider} />
          {hire.alreadyHired ? (
            <Chip icon="check" style={styles.hiredChip}>
              {hire.role === 'company' ? 'Hired' : 'Added as project partner'}
            </Chip>
          ) : (
            <Button mode="contained" onPress={onHire} loading={hiring} disabled={hiring || profileLocked}>
              {hire.role === 'company' ? 'Hire now' : 'Get as project partner'}
            </Button>
          )}
        </>
      )}

      {canReview && (
        <Button mode="outlined" style={{ marginTop: spacing.md }} onPress={() => setReviewDialogOpen(true)}>
          Leave a review
        </Button>
      )}

      {!!actionError && <Text style={styles.error}>{actionError}</Text>}

      {!!reviews.length && (
        <>
          <Divider style={styles.divider} />
          <Text variant="titleMedium" style={styles.sectionHeading}>Reviews</Text>
          {reviews.map((r) => (
            <View key={r._id} style={styles.reviewCard}>
              <View style={styles.rowBetween}>
                <Text variant="titleSmall" style={styles.reviewerName}>{r.companyId?.companyName || 'Company'}</Text>
                <StarRating rating={r.rating} size={14} />
              </View>
              {!!r.review && <Text variant="bodySmall" style={styles.reviewBody}>{r.review}</Text>}
            </View>
          ))}
        </>
      )}

      <Portal>
        <Dialog visible={reviewDialogOpen} onDismiss={() => setReviewDialogOpen(false)}>
          <Dialog.Title>Leave a review</Dialog.Title>
          <Dialog.Content>
            <View style={{ marginBottom: spacing.md }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <Chip
                  key={n}
                  selected={rating === n}
                  onPress={() => setRating(n)}
                  style={styles.ratingChip}
                >
                  {n} star{n > 1 ? 's' : ''}
                </Chip>
              ))}
            </View>
            <TextInput
              mode="outlined"
              label="Review (optional)"
              multiline
              numberOfLines={3}
              value={reviewText}
              onChangeText={setReviewText}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setReviewDialogOpen(false)}>Cancel</Button>
            <Button onPress={submitReview}>Submit</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  name: { color: colors.text, fontWeight: '700' },
  headline: { color: colors.textMuted, marginTop: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs },
  reviewCount: { color: colors.textMuted, marginLeft: spacing.xs },
  rate: { color: colors.primary, fontWeight: '700', marginTop: spacing.md },
  lockedBanner: { backgroundColor: '#FEF3C7', borderRadius: radius.md, padding: spacing.md, marginTop: spacing.md },
  lockedText: { color: '#92400E' },
  sectionHeading: { color: colors.text, fontWeight: '700', marginTop: spacing.lg, marginBottom: spacing.sm },
  body: { color: colors.textMuted, lineHeight: 20 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: { marginRight: spacing.xs, marginBottom: spacing.xs },
  link: { color: colors.primary, marginBottom: spacing.xs },
  divider: { marginVertical: spacing.lg },
  hiredChip: { backgroundColor: '#DCFCE7', alignSelf: 'flex-start' },
  error: { color: colors.error, marginTop: spacing.sm },
  reviewCard: { borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: spacing.sm },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reviewerName: { color: colors.text, fontWeight: '600' },
  reviewBody: { color: colors.textMuted, marginTop: spacing.xs },
  ratingChip: { marginBottom: spacing.xs },
});
