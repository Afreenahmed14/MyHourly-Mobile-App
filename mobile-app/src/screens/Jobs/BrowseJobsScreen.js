import { useCallback, useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Modal, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { jobApi } from '../../api/jobApi';
import { taxonomyApi } from '../../api/taxonomyApi';
import JobCard from '../../components/JobCard';
import EmptyState from '../../components/EmptyState';
import LoadingView from '../../components/LoadingView';
import { legacyColors as colors, legacyRadius as radius, legacySpacing as spacing } from '../../theme/legacyTheme';

// Matches Job.jobType enum exactly (backend/src/models/Job.js).
const JOB_TYPES = ['All types', 'full-time', 'part-time', 'contract', 'internship'];
// Fallback shown only until the real admin-managed list loads from
// GET /taxonomy/developer-types.
const FALLBACK_DEV_TYPES = [
  'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'DevOps Engineer', 'Java Developer', 'Mobile Developer',
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
            onPress={() => { onSelect(opt); onClose(); }}
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

/**
 * Native port of frontend Browse Jobs page — visual design ported 1:1
 * from the MyHourly reference app's BrowseJobsScreen + its CSS (job
 * type + developer type filter chips, bottom-sheet pickers). Wired to
 * the real GET /jobs/search endpoint with paginated infinite scroll
 * instead of filtering mock data; `developerType` is sent the same way
 * `jobType` already is — confirm the backend route accepts that param.
 */
export default function BrowseJobsScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [jobType, setJobType] = useState('All types');
  const [devType, setDevType] = useState('All developer types');
  const [typeSheetVisible, setTypeSheetVisible] = useState(false);
  const [devSheetVisible, setDevSheetVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [devTypes, setDevTypes] = useState(FALLBACK_DEV_TYPES);

  useEffect(() => {
    taxonomyApi.getDeveloperTypes()
      .then((res) => {
        const list = res.data.data?.developerTypes || [];
        if (list.length) setDevTypes(list.map((t) => t.name));
      })
      .catch(() => {}); // keep fallback list on failure
  }, []);

  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchJobs = useCallback(async (pageNum, replace) => {
    const params = { page: pageNum, limit: 10 };
    if (search) params.q = search;
    if (jobType !== 'All types') params.jobType = jobType;
    if (devType !== 'All developer types') params.developerType = devType;
    const res = await jobApi.search(params);
    const { jobs: newJobs, pagination } = res.data.data;
    setTotalPages(pagination.totalPages);
    setTotal(pagination.total ?? pagination.totalItems ?? newJobs.length);
    setJobs((prev) => (replace ? newJobs : [...prev, ...newJobs]));
  }, [search, jobType, devType]);

  const runSearch = useCallback(async () => {
    setLoading(true);
    setPage(1);
    try {
      await fetchJobs(1, true);
    } finally {
      setLoading(false);
    }
  }, [fetchJobs]);

  useFocusEffect(
    useCallback(() => {
      runSearch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jobType, devType])
  );

  const loadMore = async () => {
    if (loadingMore || page >= totalPages) return;
    setLoadingMore(true);
    const next = page + 1;
    await fetchJobs(next, false);
    setPage(next);
    setLoadingMore(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.container}
        contentContainerStyle={styles.content}
        data={jobs}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={
          <>
            <View style={styles.headerCard}>
              {searchVisible ? (
                <View style={styles.searchBarRow}>
                  <TouchableOpacity
                    style={styles.searchBackBtn}
                    onPress={() => { setSearchVisible(false); if (search) { setSearch(''); runSearch(); } }}
                  >
                    <Ionicons name="arrow-back" size={18} color={colors.text} />
                  </TouchableOpacity>
                  <View style={styles.searchBox}>
                    <Ionicons name="search" size={16} color={colors.textMuted} />
                    <TextInput
                      autoFocus
                      style={styles.searchInput}
                      placeholder="Search by title, skill, or keyword..."
                      placeholderTextColor={colors.textMuted}
                      value={search}
                      onChangeText={setSearch}
                      onSubmitEditing={runSearch}
                      returnKeyType="search"
                    />
                    {!!search && (
                      <TouchableOpacity onPress={() => { setSearch(''); runSearch(); }}>
                        <Ionicons name="close-circle" size={16} color={colors.textMuted} />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
                  <TouchableOpacity
                    style={[styles.filterChip, styles.searchToggleChip, !!search && styles.filterChipActive]}
                    onPress={() => setSearchVisible(true)}
                  >
                    <Ionicons name="search" size={16} color={search ? colors.primaryDark : colors.text} />
                  </TouchableOpacity>

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
                    <Text style={[styles.filterChipText, devType !== 'All developer types' && styles.filterChipTextActive]}>
                      {devType}
                    </Text>
                    <Ionicons name="chevron-down" size={14} color={colors.textMuted} />
                  </TouchableOpacity>
                </ScrollView>
              )}
            </View>

            {!loading && <Text style={styles.resultsCount}>{total} jobs found</Text>}
          </>
        }
        renderItem={({ item, index }) => (
          <JobCard job={item} index={index} onPress={() => navigation.navigate('JobDetails', { jobId: item._id })} />
        )}
        onEndReachedThreshold={0.4}
        onEndReached={loadMore}
        ListEmptyComponent={
          loading ? (
            <LoadingView animated={false} />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="search" size={28} color={colors.textMuted} />
              <Text style={styles.emptyText}>No jobs match your search.</Text>
            </View>
          )
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
        options={['All developer types', ...devTypes]}
        selected={devType}
        onSelect={setDevType}
        onClose={() => setDevSheetVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 40 },

  headerCard: {
    borderWidth: 1.5,
    borderColor: colors.text,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  title: { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: spacing.sm },

  searchBarRow: { flexDirection: 'row', alignItems: 'center' },
  searchBackBtn: { padding: 6, marginRight: 4 },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCEBFC',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  searchInput: { flex: 1, paddingVertical: 10, marginLeft: 8, fontSize: 14, color: colors.text },

  filterRow: { flexDirection: 'row' },
  searchToggleChip: { paddingHorizontal: 10 },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: colors.white,
  },
  filterChipActive: { borderColor: colors.primary, backgroundColor: '#EFF6FF' },
  filterChipText: { fontSize: 12, fontWeight: '600', color: colors.text, marginRight: 4 },
  filterChipTextActive: { color: colors.primaryDark },

  resultsCount: { fontSize: 12, color: colors.textMuted, marginBottom: spacing.md },

  emptyState: { alignItems: 'center', paddingVertical: spacing.xxl },
  emptyText: { color: colors.textMuted, marginTop: spacing.sm },

  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    maxHeight: '60%',
    paddingBottom: spacing.lg,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sheetTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  done: { color: colors.primary, fontWeight: '700' },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  optionText: { fontSize: 15, color: colors.text },
});
