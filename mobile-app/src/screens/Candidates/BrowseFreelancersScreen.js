import { useCallback, useRef, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Modal, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { candidateApi } from '../../api/candidateApi';
import { companyApi } from '../../api/companyApi';
import { useAuth } from '../../context/useAuth';
import CandidateCard from '../../components/CandidateCard';
import EmptyState from '../../components/EmptyState';
import LoadingView from '../../components/LoadingView';
import { legacyColors as colors, legacyRadius as radius, legacySpacing as spacing } from '../../theme/legacyTheme';

const DEVELOPER_TYPES = [
  'Full Stack', 'Frontend', 'Backend', 'Mobile', 'DevOps', 'Data Engineer',
  'QA / Test Automation', 'UI/UX Designer',
];
const AVAILABILITY = ['Full time', 'Part time', 'Contract', 'Not available'];
const SORT_OPTIONS = [
  { label: 'Name (A-Z)', value: 'name' },
  { label: 'Highest Rated', value: '-rating' },
  { label: 'Most Experienced', value: '-experience' },
  { label: 'Lowest Rate', value: 'hourlyRate' },
];
const RATING_OPTIONS = [
  { label: '4★ & up', value: 4 },
  { label: '3★ & up', value: 3 },
  { label: '2★ & up', value: 2 },
  { label: '1★ & up', value: 1 },
];
const PAGE_SIZE = 10;

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
        {options.map((opt) => {
          const value = typeof opt === 'string' ? opt : opt.value;
          const label = typeof opt === 'string' ? opt : opt.label;
          return (
            <TouchableOpacity
              key={String(value)}
              style={styles.optionRow}
              onPress={() => { onSelect(value); onClose(); }}
            >
              <Text style={styles.optionText}>{label}</Text>
              {selected === value ? (
                <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
              ) : (
                <Ionicons name="ellipse-outline" size={20} color={colors.border} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </Modal>
  );
}

/**
 * Native port of the web "Browse Freelancers" page — full filter set
 * (developer type, rate range, experience range, rating, availability,
 * city, remote-only) and sort, visual design ported 1:1 from the
 * MyHourly reference app's BrowseEngineersScreen + its CSS. Wired to the
 * real GET /candidates/search endpoint instead of mock data; filters are
 * sent as query params — confirm param names against the backend route
 * if it expects different keys.
 */
export default function BrowseFreelancersScreen({ navigation }) {
  const { role } = useAuth();
  const listRef = useRef(null);
  const [search, setSearch] = useState('');
  const [developerType, setDeveloperType] = useState('All Types');
  const [sort, setSort] = useState(SORT_OPTIONS[0]);
  const [candidates, setCandidates] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [minRate, setMinRate] = useState('');
  const [maxRate, setMaxRate] = useState('');
  const [minExp, setMinExp] = useState('');
  const [maxExp, setMaxExp] = useState('');
  const [ratingFilter, setRatingFilter] = useState(null);
  const [availabilityFilter, setAvailabilityFilter] = useState([]);
  const [city, setCity] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);

  const [typeSheetVisible, setTypeSheetVisible] = useState(false);
  const [sortSheetVisible, setSortSheetVisible] = useState(false);
  const [filtersSheetVisible, setFiltersSheetVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);

  const filtersActive =
    !!minRate || !!maxRate || !!minExp || !!maxExp || !!ratingFilter ||
    availabilityFilter.length > 0 || !!city.trim() || remoteOnly;

  const buildParams = useCallback((pageNum) => {
    const params = { page: pageNum, limit: PAGE_SIZE, sort: sort.value };
    if (search) params.q = search;
    if (developerType !== 'All Types') params.developerType = developerType;
    if (minRate) params.minRate = minRate;
    if (maxRate) params.maxRate = maxRate;
    if (minExp) params.minExperience = minExp;
    if (maxExp) params.maxExperience = maxExp;
    if (ratingFilter) params.minRating = ratingFilter;
    if (availabilityFilter.length > 0) params.availability = availabilityFilter.join(',');
    if (city.trim()) params.city = city.trim();
    if (remoteOnly) params.remote = true;
    return params;
  }, [search, developerType, sort, minRate, maxRate, minExp, maxExp, ratingFilter, availabilityFilter, city, remoteOnly]);

  const fetchCandidates = useCallback(async (pageNum) => {
    const res = await candidateApi.search(buildParams(pageNum));
    const { candidates: newOnes, pagination } = res.data.data;
    setTotalPages(pagination.totalPages || 1);
    setTotal(pagination.total ?? pagination.totalItems ?? newOnes.length);
    setCandidates(newOnes);
  }, [buildParams]);

  const runSearch = useCallback(async () => {
    setLoading(true);
    setPage(1);
    try {
      await fetchCandidates(1);
    } finally {
      setLoading(false);
    }
  }, [fetchCandidates]);

  useFocusEffect(useCallback(() => { runSearch(); }, [runSearch]));

  const goToPage = async (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    setLoading(true);
    try {
      await fetchCandidates(nextPage);
      setPage(nextPage);
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (text) => setSearch(text);

  const handleViewProfile = (candidate) => navigation.navigate('CandidateDetails', { candidateId: candidate._id });

  const toggleBookmark = async (candidate) => {
    if (role !== 'company') return;
    if (candidate.isBookmarked) await companyApi.removeBookmark(candidate._id);
    else await companyApi.bookmarkCandidate(candidate._id);
    setCandidates((prev) =>
      prev.map((c) => (c._id === candidate._id ? { ...c, isBookmarked: !c.isBookmarked } : c))
    );
  };

  const toggleAvailability = (opt) => {
    setAvailabilityFilter((prev) => (prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]));
  };

  const clearFilters = () => {
    setMinRate(''); setMaxRate(''); setMinExp(''); setMaxExp('');
    setRatingFilter(null); setAvailabilityFilter([]); setCity(''); setRemoteOnly(false);
  };

  if (loading && page === 1 && candidates.length === 0) {
    // still render the header/filters shell while first page loads
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        style={styles.container}
        contentContainerStyle={styles.content}
        data={candidates}
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
                      placeholder="Search by name..."
                      placeholderTextColor={colors.textMuted}
                      value={search}
                      onChangeText={handleSearchChange}
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
                    style={[styles.filterChip, developerType !== 'All Types' && styles.filterChipActive]}
                    onPress={() => setTypeSheetVisible(true)}
                  >
                    <Text style={[styles.filterChipText, developerType !== 'All Types' && styles.filterChipTextActive]}>
                      {developerType === 'All Types' ? 'Developer Type' : developerType}
                    </Text>
                    <Ionicons name="chevron-down" size={14} color={colors.textMuted} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.filterChip, filtersActive && styles.filterChipActive]}
                    onPress={() => setFiltersSheetVisible(true)}
                  >
                    <Text style={[styles.filterChipText, filtersActive && styles.filterChipTextActive]}>
                      Filters{filtersActive ? ' •' : ''}
                    </Text>
                    <Ionicons name="chevron-down" size={14} color={colors.textMuted} />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.filterChip} onPress={() => setSortSheetVisible(true)}>
                    <Text style={styles.filterChipText}>Sort by {sort.label}</Text>
                    <Ionicons name="chevron-down" size={14} color={colors.textMuted} />
                  </TouchableOpacity>

                  {role === 'company' && (
                    <TouchableOpacity
                      style={[styles.filterChip, styles.searchToggleChip]}
                      onPress={() => navigation.navigate('Bookmarks')}
                    >
                      <Ionicons name="bookmark-outline" size={16} color={colors.primary} />
                    </TouchableOpacity>
                  )}
                </ScrollView>
              )}
            </View>

            {!loading && <Text style={styles.resultsCount}>{total} engineers found</Text>}
          </>
        }
        renderItem={({ item }) => (
          <CandidateCard
            candidate={item}
            onPress={() => handleViewProfile(item)}
            onBookmarkToggle={role === 'company' ? () => toggleBookmark(item) : undefined}
          />
        )}
        ListEmptyComponent={
          loading ? (
            <LoadingView />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="search" size={28} color={colors.textMuted} />
              <Text style={styles.emptyText}>No engineers match your search.</Text>
            </View>
          )
        }
        ListFooterComponent={
          !loading && candidates.length > 0 && (
            <View style={styles.paginationRow}>
              <TouchableOpacity
                style={[styles.pageBtn, page === 1 && styles.pageBtnDisabled]}
                disabled={page === 1}
                onPress={() => goToPage(page - 1)}
              >
                <Text style={styles.pageBtnText}>Previous</Text>
              </TouchableOpacity>
              <Text style={styles.pageLabel}>Page {page} of {totalPages}</Text>
              <TouchableOpacity
                style={[styles.pageBtn, page === totalPages && styles.pageBtnDisabled]}
                disabled={page === totalPages}
                onPress={() => goToPage(page + 1)}
              >
                <Text style={styles.pageBtnText}>Next</Text>
              </TouchableOpacity>
            </View>
          )
        }
      />

      <OptionSheet
        visible={typeSheetVisible}
        title="Developer Type"
        options={['All Types', ...DEVELOPER_TYPES]}
        selected={developerType}
        onSelect={(val) => { setDeveloperType(val); runSearch(); }}
        onClose={() => setTypeSheetVisible(false)}
      />

      <OptionSheet
        visible={sortSheetVisible}
        title="Sort by"
        options={SORT_OPTIONS}
        selected={sort.value}
        onSelect={(val) => { setSort(SORT_OPTIONS.find((o) => o.value === val)); runSearch(); }}
        onClose={() => setSortSheetVisible(false)}
      />

      {/* Filters sheet */}
      <Modal
        visible={filtersSheetVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setFiltersSheetVisible(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setFiltersSheetVisible(false)} />
        <View style={styles.filtersSheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Filters</Text>
            <TouchableOpacity style={styles.closeIconBtn} onPress={() => setFiltersSheetVisible(false)}>
              <Ionicons name="close" size={18} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filtersScroll} contentContainerStyle={styles.filtersBody}>
            <Text style={styles.filterGroupLabel}>CHARGES PER HOUR (₹)</Text>
            <View style={styles.rangeRow}>
              <TextInput
                style={styles.rangeInput}
                placeholder="Min"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                value={minRate}
                onChangeText={(v) => setMinRate(v.replace(/[^0-9]/g, ''))}
              />
              <TextInput
                style={styles.rangeInput}
                placeholder="Max"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                value={maxRate}
                onChangeText={(v) => setMaxRate(v.replace(/[^0-9]/g, ''))}
              />
            </View>

            <View style={styles.divider} />

            <Text style={styles.filterGroupLabel}>YEARS OF EXPERIENCE</Text>
            <View style={styles.rangeRow}>
              <TextInput
                style={styles.rangeInput}
                placeholder="Min"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                value={minExp}
                onChangeText={(v) => setMinExp(v.replace(/[^0-9]/g, ''))}
              />
              <TextInput
                style={styles.rangeInput}
                placeholder="Max"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                value={maxExp}
                onChangeText={(v) => setMaxExp(v.replace(/[^0-9]/g, ''))}
              />
            </View>

            <View style={styles.divider} />

            <Text style={styles.filterGroupLabel}>RATING</Text>
            <View style={styles.chipsWrap}>
              {RATING_OPTIONS.map((opt) => {
                const active = ratingFilter === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    style={[styles.optChip, active && styles.optChipActive]}
                    onPress={() => setRatingFilter(active ? null : opt.value)}
                  >
                    <Text style={[styles.optChipText, active && styles.optChipTextActive]}>{opt.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.divider} />

            <Text style={styles.filterGroupLabel}>AVAILABILITY</Text>
            <View style={styles.chipsWrap}>
              {AVAILABILITY.map((opt) => {
                const active = availabilityFilter.includes(opt);
                return (
                  <TouchableOpacity
                    key={opt}
                    style={[styles.optChip, active && styles.optChipActive]}
                    onPress={() => toggleAvailability(opt)}
                  >
                    <Text style={[styles.optChipText, active && styles.optChipTextActive]}>{opt}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.divider} />

            <Text style={styles.filterGroupLabel}>CITY</Text>
            <View style={styles.cityInputRow}>
              <Ionicons name="location-outline" size={16} color={colors.textMuted} />
              <TextInput
                style={styles.cityInput}
                placeholder="e.g. Bengaluru"
                placeholderTextColor={colors.textMuted}
                value={city}
                onChangeText={setCity}
              />
            </View>

            <View style={styles.divider} />

            <TouchableOpacity
              style={[styles.remoteToggleRow, remoteOnly && styles.remoteToggleRowActive]}
              onPress={() => setRemoteOnly((v) => !v)}
            >
              <Text style={[styles.remoteToggleText, remoteOnly && styles.remoteToggleTextActive]}>
                Remote only
              </Text>
              {remoteOnly ? <Ionicons name="checkmark-circle" size={18} color={colors.primary} /> : null}
            </TouchableOpacity>

            <TouchableOpacity style={styles.clearBtn} onPress={clearFilters}>
              <Text style={styles.clearBtnText}>Clear filters</Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.filtersFooter}>
            <TouchableOpacity
              style={styles.showResultsBtn}
              onPress={() => { setFiltersSheetVisible(false); runSearch(); }}
            >
              <Text style={styles.showResultsText}>Show results</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  title: { fontSize: 20, fontWeight: '800', color: colors.text },

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

  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  pageBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.white,
  },
  pageBtnDisabled: { opacity: 0.4 },
  pageBtnText: { fontSize: 12, fontWeight: '600', color: colors.text },
  pageLabel: { fontSize: 12, color: colors.textMuted },

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

  filtersBody: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.lg },
  filterGroupLabel: { fontSize: 12, fontWeight: '700', color: colors.textMuted, marginTop: spacing.md, marginBottom: spacing.sm },
  clearBtn: { marginTop: spacing.md, paddingVertical: 10, alignItems: 'center' },
  clearBtnText: { fontSize: 13, color: colors.danger, fontWeight: '700' },

  filtersSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    maxHeight: '88%',
    minHeight: '60%',
  },
  filtersScroll: { flexGrow: 0 },
  closeIconBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: { height: 1, backgroundColor: colors.border, marginTop: spacing.md },

  rangeRow: { flexDirection: 'row' },
  rangeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
    marginRight: spacing.sm,
    backgroundColor: colors.white,
  },

  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  optChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  optChipActive: { borderColor: colors.primary, backgroundColor: '#EFF6FF' },
  optChipText: { fontSize: 13, fontWeight: '600', color: colors.text },
  optChipTextActive: { color: colors.primaryDark },

  cityInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
  },
  cityInput: { flex: 1, paddingVertical: 10, marginLeft: 8, fontSize: 14, color: colors.text },

  remoteToggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: 14,
    marginTop: spacing.md,
  },
  remoteToggleRowActive: { borderColor: colors.primary, backgroundColor: '#EFF6FF' },
  remoteToggleText: { fontSize: 14, fontWeight: '700', color: colors.text, marginRight: spacing.xs },
  remoteToggleTextActive: { color: colors.primaryDark },

  filtersFooter: { borderTopWidth: 1, borderTopColor: colors.border, padding: spacing.lg },
  showResultsBtn: { backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: 14, alignItems: 'center' },
  showResultsText: { color: colors.white, fontWeight: '700', fontSize: 15 },
});
