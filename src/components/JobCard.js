import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import styles from '../styles/JobCard.styles';

export default function JobCard({ job, applied, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.topRow}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoBadgeText}>HO</Text>
        </View>
        <View style={styles.titleBlock}>
          <Text style={styles.title} numberOfLines={1}>
            {job.title}
          </Text>
          <Text style={styles.company}>{job.company}</Text>
        </View>
        {applied && (
          <View style={styles.appliedBadge}>
            <Text style={styles.appliedBadgeText}>Applied</Text>
          </View>
        )}
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="briefcase-outline" size={12} color={colors.textMuted} />
          <Text style={styles.metaText}>{job.jobType}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="location-outline" size={12} color={colors.textMuted} />
          <Text style={styles.metaText}>{job.location}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={12} color={colors.textMuted} />
          <Text style={styles.metaText}>{job.postedAgo}</Text>
        </View>
      </View>

      <Text style={styles.salary}>{job.salaryRange}</Text>

      <View style={styles.skillChip}>
        <Text style={styles.skillChipText}>{job.skill}</Text>
      </View>
    </TouchableOpacity>
  );
}
