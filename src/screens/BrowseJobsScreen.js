import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import JobCard from '../components/JobCard';
import { useJobs } from '../context/JobsContext';
import { colors } from '../theme';
import styles from '../styles/BrowseJobsScreen.styles';

const JOB_TYPES = ['All types', 'Full-time', 'Part-time', 'Contract', 'Internship'];
const DEV_TYPES = [
  'All developer types',
  'Backend Developer',
  'Data Analyst',
  'DevOps Engineer',
  'Frontend Developer',
  'Full Stack Developer',
  'Mobile App Developer',
  'Python developer',
  'UI/UX Developer',
];

function OptionSheet({ visible, title, options, selected, onSelect, onClose }) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>{title}</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.done}>Done</Text>
          </TouchableOpacity>
        </View>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={styles.optionRow}
            onPress={() => {
              onSelect(opt);
              onClose();
            }}
          >
            <Text style={styles.optionText}>{opt}</Text>
            {selected === opt ? (
              <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
            ) : (
              <Ionicons name="ellipse-outline" size={20} color={colors.border} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </Modal>
  );
}

export default function BrowseJobsScreen({ navigation }) {
  const { jobs, hasApplied } = useJobs();
  const [search, setSearch] = useState('');
  const [jobType, setJobType] = useState('All types');
  const [devType, setDevType] = useState('All developer types');
  const [typeSheetVisible, setTypeSheetVisible] = useState(false);
  const [devSheetVisible, setDevSheetVisible] = useState(false);

  const filtered = useMemo(() => {
    let list = jobs.filter(
      (j) =>
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.skill.toLowerCase().includes(search.toLowerCase())
    );
    if (jobType !== 'All types') {
      list = list.filter((j) => j.jobType === jobType);
    }
    if (devType !== 'All developer types') {
      list = list.filter((j) => j.developerType === devType);
    }
    return list;
  }, [jobs, search, jobType, devType]);

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.container}
        contentContainerStyle={styles.content}
        data={filtered}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <View style={styles.headerCard}>
              <Text style={styles.title}>Browse Jobs</Text>

              <View style={styles.searchBox}>
                <Ionicons name="search" size={16} color={colors.textMuted} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search by title, skill, or keyword..."
                  placeholderTextColor={colors.textMuted}
                  value={search}
                  onChangeText={setSearch}
                />
              </View>

              <View style={styles.filterRow}>
                <TouchableOpacity
                  style={[styles.filterChip, jobType !== 'All types' && styles.filterChipActive]}
                  onPress={() => setTypeSheetVisible(true)}
                >
                  <Text style={[styles.filterChipText, jobType !== 'All types' && styles.filterChipTextActive]}>
                    {jobType}
                  </Text>
                  <Ionicons name="chevron-down" size={14} color={colors.textMuted} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.filterChip, devType !== 'All developer types' && styles.filterChipActive]}
                  onPress={() => setDevSheetVisible(true)}
                >
                  <Text
                    style={[styles.filterChipText, devType !== 'All developer types' && styles.filterChipTextActive]}
                  >
                    {devType}
                  </Text>
                  <Ionicons name="chevron-down" size={14} color={colors.textMuted} />
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.resultsCount}>{filtered.length} jobs found</Text>
          </>
        }
        renderItem={({ item }) => (
          <JobCard
            job={item}
            applied={hasApplied(item.id)}
            onPress={() => navigation.navigate('JobDetail', { jobId: item.id })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search" size={28} color={colors.textMuted} />
            <Text style={styles.emptyText}>No jobs match your search.</Text>
          </View>
        }
      />

      <OptionSheet
        visible={typeSheetVisible}
        title="Job Type"
        options={JOB_TYPES}
        selected={jobType}
        onSelect={setJobType}
        onClose={() => setTypeSheetVisible(false)}
      />

      <OptionSheet
        visible={devSheetVisible}
        title="Developer Type"
        options={DEV_TYPES}
        selected={devType}
        onSelect={setDevType}
        onClose={() => setDevSheetVisible(false)}
      />
    </View>
  );
}
