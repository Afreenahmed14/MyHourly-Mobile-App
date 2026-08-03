import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useJobs } from '../context/JobsContext';
import { colors } from '../theme';
import styles from '../styles/CompanyListScreens.styles';

export default function MyJobsScreen({ navigation }) {
  const { postedJobs, closeJob, reopenJob, deleteJob } = useJobs();

  const handlePostJob = () => {
    navigation.navigate('PostJob');
  };

  const handleEdit = (job) => {
    navigation.navigate('PostJob', { jobId: job.id });
  };

  const handleViewApplicants = (job) => {
    Alert.alert(
      'Applicants',
      job.applicantsCount > 0
        ? `${job.applicantsCount} engineer${job.applicantsCount > 1 ? 's' : ''} applied to "${job.title}".`
        : `No applicants yet for "${job.title}".`
    );
  };

  const handleToggleStatus = (job) => {
    if (job.status === 'closed') {
      reopenJob(job.id);
      return;
    }
    Alert.alert('Close job', `Close "${job.title}"? Engineers will no longer be able to apply.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Close Job', style: 'destructive', onPress: () => closeJob(job.id) },
    ]);
  };

  const handleDelete = (job) => {
    Alert.alert('Delete job', `Delete "${job.title}"? This can't be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteJob(job.id) },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>My Job Postings</Text>
        <TouchableOpacity style={styles.addBtn} onPress={handlePostJob}>
          <Ionicons name="add" size={16} color={colors.white} />
          <Text style={styles.addBtnText}>Post a Job</Text>
        </TouchableOpacity>
      </View>

      {postedJobs.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>No job postings yet</Text>
          <Text style={styles.emptySubtitle}>
            Post your first job to start receiving applications from engineers.
          </Text>
          <TouchableOpacity style={[styles.addBtn, { marginTop: 16 }]} onPress={handlePostJob}>
            <Ionicons name="add" size={16} color={colors.white} />
            <Text style={styles.addBtnText}>Post a Job</Text>
          </TouchableOpacity>
        </View>
      ) : (
        postedJobs.map((job) => {
          const isOpen = job.status !== 'closed';
          return (
            <View key={job.id} style={styles.jobCard}>
              <View style={styles.jobCardHeader}>
                <View style={styles.jobCardTitleWrap}>
                  <Text style={styles.rowTitle} numberOfLines={1}>
                    {job.title}
                  </Text>
                  <Text style={styles.rowMeta}>
                    {(job.jobType || 'Full-time').toLowerCase()} · Posted {job.postedDate || job.postedAgo} ·{' '}
                    {job.applicantsCount || 0} applicants
                  </Text>
                </View>
                <View style={[styles.statusBadge, !isOpen && styles.statusBadgeClosed]}>
                  <Text style={[styles.statusBadgeText, !isOpen && styles.statusBadgeTextClosed]}>
                    {isOpen ? 'open' : 'closed'}
                  </Text>
                </View>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => handleViewApplicants(job)}>
                  <Ionicons name="people-outline" size={14} color={colors.text} />
                  <Text style={styles.actionBtnText}>View Applicants ({job.applicantsCount || 0})</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionBtn} onPress={() => handleEdit(job)}>
                  <Ionicons name="create-outline" size={14} color={colors.text} />
                  <Text style={styles.actionBtnText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.closeBtn} onPress={() => handleToggleStatus(job)}>
                  <Ionicons
                    name={isOpen ? 'archive-outline' : 'refresh-outline'}
                    size={14}
                    color={colors.text}
                  />
                  <Text style={styles.closeBtnText}>{isOpen ? 'Close' : 'Reopen'}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(job)}>
                  <Ionicons name="trash-outline" size={14} color={colors.white} />
                  <Text style={styles.deleteBtnText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}
