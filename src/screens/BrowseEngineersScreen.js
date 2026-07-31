import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Modal, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EngineerCard from '../components/EngineerCard';
import { ENGINEERS } from '../data/engineers';
import { DEVELOPER_TYPES, AVAILABILITY } from '../data/options';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';
import styles from '../styles/BrowseEngineersScreen.styles';
import authStyles from '../styles/Auth.styles';

const SORT_OPTIONS = ['Name (A-Z)', 'Highest Rated', 'Most Experienced', 'Lowest Rate'];
const RATING_OPTIONS = [
  { label: '4★ & up', value: 4 },
  { label: '3★ & up', value: 3 },
  { label: '2★ & up', value: 2 },
  { label: '1★ & up', value: 1 },
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

export default function BrowseEngineersScreen({ navigation }) {
  const { isLoggedIn } = useAuth();
  const [search, setSearch] = useState('');
  const [developerType, setDeveloperType] = useState('All Types');
  const [sort, setSort] = useState('Name (A-Z)');
  const [page, setPage] = useState(1);

  // Filters (match the Filters sheet fields)
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
  const [loginRequiredVisible, setLoginRequiredVisible] = useState(false);
  const [subscriptionRequiredVisible, setSubscriptionRequiredVisible] = useState(false);

  const filtersActive =
    !!minRate ||
    !!maxRate ||
    !!minExp ||
    !!maxExp ||
    !!ratingFilter ||
    availabilityFilter.length > 0 ||
    !!city.trim() ||
    remoteOnly;

  const filtered = useMemo(() => {
    let list = ENGINEERS.filter((e) => e.name.toLowerCase().includes(search.toLowerCase()));

    if (developerType !== 'All Types') {
      list = list.filter(
        (e) =>
          e.role.toLowerCase().includes(developerType.toLowerCase()) ||
          e.skills.some((s) => s.toLowerCase().includes(developerType.toLowerCase()))
      );
    }

    if (minRate) list = list.filter((e) => e.rate >= Number(minRate));
    if (maxRate) list = list.filter((e) => e.rate <= Number(maxRate));
    if (minExp) list = list.filter((e) => e.experience >= Number(minExp));
    if (maxExp) list = list.filter((e) => e.experience <= Number(maxExp));
    if (ratingFilter) list = list.filter((e) => e.rating >= ratingFilter);
    if (availabilityFilter.length > 0) list = list.filter((e) => availabilityFilter.includes(e.availability));
    if (city.trim()) list = list.filter((e) => e.location.toLowerCase().includes(city.trim().toLowerCase()));
    if (remoteOnly) list = list.filter((e) => e.remote);

    switch (sort) {
      case 'Highest Rated':
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      case 'Most Experienced':
        list = [...list].sort((a, b) => b.experience - a.experience);
        break;
      case 'Lowest Rate':
        list = [...list].sort((a, b) => a.rate - b.rate);
        break;
      default:
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [search, developerType, sort, minRate, maxRate, minExp, maxExp, ratingFilter, availabilityFilter, city, remoteOnly]);

  const PAGE_SIZE = 6;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearchChange = (text) => {
    setSearch(text);
    setPage(1);
  };

  const handleViewProfile = (engineer) => {
    if (!isLoggedIn) {
      setLoginRequiredVisible(true);
      return;
    }
    navigation.navigate('ViewProfile', { engineer });
  };

  const handleUnlockContact = (engineer) => {
    if (!isLoggedIn) {
      setLoginRequiredVisible(true);
      return;
    }
    setSubscriptionRequiredVisible(true);
  };

  const toggleAvailability = (opt) => {
    setAvailabilityFilter((prev) => (prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]));
  };

  const clearFilters = () => {
    setMinRate('');
    setMaxRate('');
    setMinExp('');
    setMaxExp('');
    setRatingFilter(null);
    setAvailabilityFilter([]);
    setCity('');
    setRemoteOnly(false);
    setPage(1);
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.container}
        contentContainerStyle={styles.content}
        data={pageItems}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <View style={styles.headerCard}>
              <Text style={styles.title}>Browse Engineers</Text>

              <View style={styles.searchBox}>
                <Ionicons name="search" size={16} color={colors.textMuted} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search by name..."
                  placeholderTextColor={colors.textMuted}
                  value={search}
                  onChangeText={handleSearchChange}
                />
              </View>

              <View style={styles.filterRow}>
                <TouchableOpacity
                  style={[styles.filterChip, developerType !== 'All Types' && styles.filterChipActive]}
                  onPress={() => setTypeSheetVisible(true)}
                >
                  <Text
                    style={[styles.filterChipText, developerType !== 'All Types' && styles.filterChipTextActive]}
                  >
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
                  <Text style={styles.filterChipText}>Sort by {sort}</Text>
                  <Ionicons name="chevron-down" size={14} color={colors.textMuted} />
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.resultsCount}>{filtered.length} engineers found</Text>
          </>
        }
        renderItem={({ item }) => (
          <EngineerCard engineer={item} onViewProfile={handleViewProfile} onUnlockContact={handleUnlockContact} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search" size={28} color={colors.textMuted} />
            <Text style={styles.emptyText}>No engineers match your search.</Text>
          </View>
        }
        ListFooterComponent={
          filtered.length > 0 && (
            <View style={styles.paginationRow}>
              <TouchableOpacity
                style={[styles.pageBtn, page === 1 && styles.pageBtnDisabled]}
                disabled={page === 1}
                onPress={() => setPage((p) => Math.max(1, p - 1))}
              >
                <Text style={styles.pageBtnText}>Previous</Text>
              </TouchableOpacity>
              <Text style={styles.pageLabel}>
                Page {page} of {totalPages}
              </Text>
              <TouchableOpacity
                style={[styles.pageBtn, page === totalPages && styles.pageBtnDisabled]}
                disabled={page === totalPages}
                onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
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
        onSelect={(val) => {
          setDeveloperType(val);
          setPage(1);
        }}
        onClose={() => setTypeSheetVisible(false)}
      />

      <OptionSheet
        visible={sortSheetVisible}
        title="Sort by"
        options={SORT_OPTIONS}
        selected={sort}
        onSelect={(val) => {
          setSort(val);
          setPage(1);
        }}
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
                onChangeText={(v) => {
                  setMinRate(v.replace(/[^0-9]/g, ''));
                  setPage(1);
                }}
              />
              <TextInput
                style={styles.rangeInput}
                placeholder="Max"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                value={maxRate}
                onChangeText={(v) => {
                  setMaxRate(v.replace(/[^0-9]/g, ''));
                  setPage(1);
                }}
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
                onChangeText={(v) => {
                  setMinExp(v.replace(/[^0-9]/g, ''));
                  setPage(1);
                }}
              />
              <TextInput
                style={styles.rangeInput}
                placeholder="Max"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                value={maxExp}
                onChangeText={(v) => {
                  setMaxExp(v.replace(/[^0-9]/g, ''));
                  setPage(1);
                }}
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
                    onPress={() => {
                      setRatingFilter(active ? null : opt.value);
                      setPage(1);
                    }}
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
                    onPress={() => {
                      toggleAvailability(opt);
                      setPage(1);
                    }}
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
                onChangeText={(v) => {
                  setCity(v);
                  setPage(1);
                }}
              />
            </View>

            <View style={styles.divider} />

            <TouchableOpacity
              style={[styles.remoteToggleRow, remoteOnly && styles.remoteToggleRowActive]}
              onPress={() => {
                setRemoteOnly((v) => !v);
                setPage(1);
              }}
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
            <TouchableOpacity style={styles.showResultsBtn} onPress={() => setFiltersSheetVisible(false)}>
              <Text style={styles.showResultsText}>Show results</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Login required modal */}
      <Modal
        visible={loginRequiredVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setLoginRequiredVisible(false)}
      >
        <View style={authStyles.modalBackdrop}>
          <View style={authStyles.modalCard}>
            <View style={authStyles.modalHeader}>
              <Text style={authStyles.modalTitle}>Login required</Text>
              <TouchableOpacity onPress={() => setLoginRequiredVisible(false)}>
                <Ionicons name="close" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            <View style={authStyles.modalBody}>
              <View style={authStyles.modalIconWrap}>
                <Ionicons name="lock-closed-outline" size={24} color={colors.textMuted} />
              </View>
              <Text style={authStyles.modalMessage}>You need to be logged in to view this profile.</Text>
              <View style={authStyles.modalBtnRow}>
                <TouchableOpacity
                  style={authStyles.modalPrimaryBtn}
                  onPress={() => {
                    setLoginRequiredVisible(false);
                    navigation.navigate('LoginRole');
                  }}
                >
                  <Text style={authStyles.modalPrimaryBtnText}>Log In</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={authStyles.modalSecondaryBtn}
                  onPress={() => {
                    setLoginRequiredVisible(false);
                    navigation.navigate('Register');
                  }}
                >
                  <Text style={authStyles.modalSecondaryBtnText}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Subscription required modal (Unlock contact) */}
      <Modal
        visible={subscriptionRequiredVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setSubscriptionRequiredVisible(false)}
      >
        <View style={authStyles.modalBackdrop}>
          <View style={authStyles.modalCard}>
            <View style={authStyles.modalHeader}>
              <Text style={authStyles.modalTitle}>Subscription required</Text>
              <TouchableOpacity onPress={() => setSubscriptionRequiredVisible(false)}>
                <Ionicons name="close" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            <View style={authStyles.modalBody}>
              <View style={authStyles.modalIconWrap}>
                <Ionicons name="lock-closed-outline" size={24} color={colors.textMuted} />
              </View>
              <Text style={authStyles.modalMessage}>
                You need an active subscription to unlock this engineer's contact details.
              </Text>
              <View style={authStyles.modalBtnRow}>
                <TouchableOpacity
                  style={authStyles.modalPrimaryBtn}
                  onPress={() => setSubscriptionRequiredVisible(false)}
                >
                  <Text style={authStyles.modalPrimaryBtnText}>View Plans</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={authStyles.modalSecondaryBtn}
                  onPress={() => setSubscriptionRequiredVisible(false)}
                >
                  <Text style={authStyles.modalSecondaryBtnText}>Not now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
