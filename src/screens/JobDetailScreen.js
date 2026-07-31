import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useJobs } from '../context/JobsContext';
import { colors } from '../theme';
import styles from '../styles/JobDetailScreen.styles';

export default function JobDetailScreen({ route }) {
  const { jobId } = route.params;
  const { jobs, hasApplied, applyToJob } = useJobs();
  const job = jobs.find((j) => j.id === jobId);

  const [applyModalVisible, setApplyModalVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  if (!job) {
    return (
      <View style={styles.container}>
        <Text style={styles.descriptionText}>Job not found.</Text>
      </View>
    );
  }

  const applied = hasApplied(job.id);

  const handleSubmitApplication = () => {
    applyToJob(job.id, coverLetter);
    setApplyModalVisible(false);
    setConfirmVisible(true);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <View style={styles.topRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>HO</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{job.title}</Text>
            <Text style={styles.company}>{job.company}</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="briefcase-outline" size={13} color={colors.textMuted} />
            <Text style={styles.metaText}>{job.jobType}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={13} color={colors.textMuted} />
            <Text style={styles.metaText}>{job.location}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={13} color={colors.textMuted} />
            <Text style={styles.metaText}>Posted {job.postedDate}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="people-outline" size={13} color={colors.textMuted} />
            <Text style={styles.metaText}>
              {job.openings} {job.openings === 1 ? 'Opening' : 'Openings'}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.salary}>{job.salaryRange}</Text>
        <Text style={styles.experienceText}>Experience: {job.experienceRange}</Text>
        <View style={styles.skillChip}>
          <Text style={styles.skillChipText}>{job.skill}</Text>
        </View>

        <Text style={styles.sectionTitle}>Job Description</Text>
        <Text style={styles.descriptionText}>{job.description}</Text>

        {applied ? (
          <View style={styles.appliedBadge}>
            <Text style={styles.appliedBadgeText}>You've applied to this job</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.applyBtn} onPress={() => setApplyModalVisible(true)}>
            <Text style={styles.applyBtnText}>Apply Now</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={applyModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setApplyModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Apply to {job.title}</Text>
              <TouchableOpacity onPress={() => setApplyModalVisible(false)}>
                <Ionicons name="close" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.fieldLabel}>Cover letter (optional)</Text>
              <TextInput
                style={styles.coverLetterInput}
                value={coverLetter}
                onChangeText={setCoverLetter}
                placeholder="Tell the company why you're a good fit..."
                placeholderTextColor={colors.textMuted}
                multiline
              />
              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmitApplication}>
                <Text style={styles.submitBtnText}>Submit Application</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={confirmVisible} animationType="fade" transparent onRequestClose={() => setConfirmVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.confirmBody}>
              <View style={styles.confirmIconWrap}>
                <Ionicons name="checkmark-circle" size={30} color={colors.success} />
              </View>
              <Text style={styles.confirmText}>Application submitted.</Text>
              <TouchableOpacity style={styles.confirmOkBtn} onPress={() => setConfirmVisible(false)}>
                <Text style={styles.confirmOkBtnText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
