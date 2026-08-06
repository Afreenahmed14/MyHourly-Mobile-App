import { View, StyleSheet, Pressable } from 'react-native';
import { Text, Avatar, IconButton, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import StarRating from './StarRating';
import { useAuth } from '../context/useAuth';
import { useSubscription } from '../context/useSubscription';
import { colors, spacing, radius } from '../theme/theme';

/**
 * "Engineer card" — visual design ported from the MyHourly reference app's
 * EngineerCard component (avatar + name/headline, skill chips, rate +
 * View Profile button, star rating row), adapted to our real candidate
 * fields (no location/availability tracked in this backend, so those rows
 * are simply omitted rather than faked).
 */
export default function CandidateCard({ candidate, onPress, onBookmarkToggle }) {
  const { role } = useAuth();
  const { subscription } = useSubscription();
  const skills = candidate.primarySkills || candidate.skills || [];
  const showLockBar = role === 'company' && !subscription;

  return (
    <View style={styles.card}>
      <Pressable onPress={onPress} style={styles.inner}>
        <View style={styles.topRow}>
          <Avatar.Image
            size={52}
            source={candidate.profileImage ? { uri: candidate.profileImage } : require('../../assets/icon.png')}
          />
          <View style={styles.nameBlock}>
            <Text style={styles.name} numberOfLines={1}>{candidate.name}</Text>
            {!!candidate.headline && (
              <Text style={styles.headline} numberOfLines={2}>{candidate.headline}</Text>
            )}
          </View>
          {onBookmarkToggle && (
            <IconButton
              icon={candidate.isBookmarked ? 'bookmark' : 'bookmark-outline'}
              iconColor={colors.primary}
              onPress={onBookmarkToggle}
            />
          )}
        </View>

        {!!skills.length && (
          <View style={styles.skillsWrap}>
            {skills.slice(0, 4).map((skill) => (
              <View key={skill} style={styles.skillChip}>
                <Text style={styles.skillChipText}>{skill}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.bottomRow}>
          {!!candidate.hourlyRate ? (
            <Text style={styles.rate}>₹{candidate.hourlyRate}/hr</Text>
          ) : <View />}
          <Button mode="contained-tonal" compact onPress={onPress} style={styles.viewBtn}>
            View Profile
          </Button>
        </View>

        <View style={styles.ratingRow}>
          <StarRating rating={candidate.rating || 0} />
          <Text style={styles.ratingText}>
            {(candidate.rating || 0).toFixed(1)} ({candidate.reviewsCount || 0} reviews)
          </Text>
        </View>
      </Pressable>

      {showLockBar && (
        <View style={styles.lockBar}>
          <Ionicons name="lock-closed" size={12} color={colors.primaryDark} />
          <Text style={styles.lockText}>Unlock contact with a subscription</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  inner: { padding: spacing.md },
  topRow: { flexDirection: 'row', alignItems: 'flex-start' },
  nameBlock: { flex: 1, marginLeft: spacing.sm },
  name: { color: colors.text, fontWeight: '700', fontSize: 16 },
  headline: { color: colors.textMuted, marginTop: 2, fontSize: 13 },
  skillsWrap: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.sm },
  skillChip: {
    backgroundColor: '#EEF2FF', borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 3,
    marginRight: spacing.xs, marginBottom: spacing.xs,
  },
  skillChipText: { color: colors.primaryDark, fontSize: 11, fontWeight: '600' },
  bottomRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.md,
  },
  rate: { color: colors.primary, fontWeight: '700', fontSize: 15 },
  viewBtn: { marginLeft: 'auto' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  ratingText: { color: colors.textMuted, fontSize: 12, marginLeft: spacing.xs },
  lockBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs,
    backgroundColor: '#FEF3C7', paddingVertical: spacing.sm,
  },
  lockText: { color: colors.primaryDark, fontSize: 12, fontWeight: '600' },
});
