import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import styles from '../styles/EngineerCard.styles';

function Stars({ rating }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Ionicons key={i} name={i <= Math.round(rating) ? 'star' : 'star-outline'} size={12} color={colors.star} />
    );
  }
  return <View style={{ flexDirection: 'row' }}>{stars}</View>;
}

export default function EngineerCard({ engineer, onViewProfile, onUnlockContact }) {
  return (
    <View style={styles.card}>
      <View style={styles.inner}>
        <View style={styles.topRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{engineer.name.charAt(0)}</Text>
          </View>

          <View style={styles.nameBlock}>
            <Text style={styles.name} numberOfLines={1}>
              {engineer.name}
            </Text>
            <Text style={styles.role} numberOfLines={2}>
              {engineer.role}
            </Text>
            <Text style={styles.location} numberOfLines={1}>
              {engineer.location}
            </Text>
          </View>

          <View style={styles.metaCol}>
            {engineer.available && (
              <View style={styles.availableBadge}>
                <View style={styles.availableDot} />
                <Text style={styles.availableText}>Available</Text>
              </View>
            )}
            <Text style={styles.postedAgo}>{engineer.postedAgo}</Text>
          </View>
        </View>

        <View style={styles.skillsWrap}>
          {engineer.skills.map((skill) => (
            <View key={skill} style={styles.skillChip}>
              <Text style={styles.skillChipText}>{skill}</Text>
            </View>
          ))}
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.rate}>₹{engineer.rate}/Hour</Text>
          <TouchableOpacity style={styles.viewBtn} onPress={() => onViewProfile(engineer)}>
            <Text style={styles.viewBtnText}>View Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.ratingRow}>
          <Stars rating={engineer.rating} />
          <Text style={styles.ratingText}>
            {engineer.rating.toFixed(1)} ({engineer.reviews} reviews)
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.lockBar}
        activeOpacity={0.7}
        onPress={() => onUnlockContact && onUnlockContact(engineer)}
      >
        <Ionicons name="lock-closed" size={12} color={colors.primaryDark} />
        <Text style={styles.lockText}>Unlock contact with a subscription</Text>
      </TouchableOpacity>
    </View>
  );
}
