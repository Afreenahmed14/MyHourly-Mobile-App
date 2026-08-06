import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/useAuth';
import { useSubscription } from '../context/useSubscription';
import { legacyColors as colors, legacyRadius as radius, legacySpacing as spacing } from '../theme/legacyTheme';

function Stars({ rating }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Ionicons key={i} name={i <= Math.round(rating) ? 'star' : 'star-outline'} size={12} color={colors.star} />
    );
  }
  return <View style={{ flexDirection: 'row' }}>{stars}</View>;
}

/**
 * Engineer card — pixel-for-pixel port of the MyHourly reference app's
 * EngineerCard component and its CSS, wired to real candidate fields
 * (no `location`/`available`/`postedAgo` tracked by this backend, so
 * those rows are simply omitted rather than faked). The bookmark toggle
 * replaces the reference app's static top-right slot when a company is
 * browsing.
 */
export default function CandidateCard({ candidate, onPress, onBookmarkToggle }) {
  const { role } = useAuth();
  const { subscription } = useSubscription();
  const skills = candidate.primarySkills || candidate.skills || [];
  const showLockBar = role === 'company' && !subscription;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.inner}>
        <View style={styles.topRow}>
          {candidate.profileImage ? (
            <Image source={{ uri: candidate.profileImage }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{(candidate.name || '?').charAt(0)}</Text>
            </View>
          )}

          <View style={styles.nameBlock}>
            <Text style={styles.name} numberOfLines={1}>{candidate.name}</Text>
            {!!candidate.headline && (
              <Text style={styles.role} numberOfLines={2}>{candidate.headline}</Text>
            )}
          </View>

          {onBookmarkToggle && (
            <TouchableOpacity onPress={onBookmarkToggle} style={styles.bookmarkBtn}>
              <Ionicons
                name={candidate.isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={18}
                color={colors.primary}
              />
            </TouchableOpacity>
          )}
        </View>

        {!!skills.length && (
          <View style={styles.skillsWrap}>
            {skills.slice(0, 6).map((skill) => (
              <View key={skill} style={styles.skillChip}>
                <Text style={styles.skillChipText}>{skill}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.bottomRow}>
          <Text style={styles.rate}>{candidate.hourlyRate ? `₹${candidate.hourlyRate}/Hour` : ''}</Text>
        </View>

        <View style={styles.ratingRow}>
          <Stars rating={candidate.rating || 0} />
          <Text style={styles.ratingText}>
            {(candidate.rating || 0).toFixed(1)} ({candidate.reviewsCount || 0} reviews)
          </Text>
        </View>
      </View>

      {showLockBar && (
        <View style={styles.lockBar}>
          <Ionicons name="lock-closed" size={12} color={colors.primaryDark} />
          <Text style={styles.lockText}>Unlock contact with a subscription</Text>
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
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  inner: { padding: spacing.md },
  topRow: { flexDirection: 'row', alignItems: 'flex-start' },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  avatarText: { color: colors.white, fontWeight: '700', fontSize: 16 },
  avatarImage: { width: 44, height: 44, borderRadius: 22, marginRight: spacing.sm, backgroundColor: colors.border },
  nameBlock: { flex: 1 },
  name: { fontSize: 15, fontWeight: '700', color: colors.text },
  role: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  bookmarkBtn: { padding: 4, marginLeft: spacing.xs },
  skillsWrap: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.sm },
  skillChip: {
    backgroundColor: '#EFF6FF',
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  skillChipText: { color: colors.primaryDark, fontSize: 10, fontWeight: '700' },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  rate: { fontSize: 15, fontWeight: '800', color: colors.text },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  ratingText: { fontSize: 11, color: colors.textMuted, marginLeft: 4 },
  lockBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    paddingVertical: 8,
  },
  lockText: { fontSize: 11, color: colors.primaryDark, fontWeight: '600', marginLeft: 6 },
});
