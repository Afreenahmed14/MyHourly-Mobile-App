import { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp, Easing } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/useAuth';
import { useSubscription } from '../context/useSubscription';
import { resolveImageUrl } from '../constants/config';
import AnimatedPressable from './AnimatedPressable';
import { legacyColors as colors, legacyRadius as radius, legacySpacing as spacing, legacyShadows as shadows } from '../theme/legacyTheme';

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
export default function CandidateCard({ candidate, onPress, onBookmarkToggle, index = 0 }) {
  const { role } = useAuth();
  const { subscription } = useSubscription();
  const [imageFailed, setImageFailed] = useState(false);

  // `candidate` can come through as null/undefined — e.g. a bookmarked
  // candidate that's since been deleted (populate returns null for that
  // entry) still shows up as a row in the bookmarks list. Bail out to
  // nothing rather than crashing the whole screen on `.primarySkills` of
  // undefined.
  if (!candidate) return null;

  const skills = candidate.primarySkills || candidate.skills || [];
  const showLockBar = role === 'company' && !subscription;
  const avatarUri = resolveImageUrl(candidate.profileImage);

  return (
    <Animated.View entering={FadeInUp.delay(Math.min(index, 8) * 60).duration(280).easing(Easing.out(Easing.cubic))}>
    <AnimatedPressable style={styles.card} onPress={onPress}>
      <View style={styles.inner}>
        <View style={styles.topRow}>
          {avatarUri && !imageFailed ? (
            <Image
              source={{ uri: avatarUri }}
              style={styles.avatarImage}
              onError={() => setImageFailed(true)}
            />
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
    </AnimatedPressable>
    </Animated.View>
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
    // iOS clips shadowing on overflow:hidden views, but Android's
    // elevation still renders — good enough tradeoff to keep the
    // rounded-corner lockBar clipping intact on both platforms.
    ...shadows.card,
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
