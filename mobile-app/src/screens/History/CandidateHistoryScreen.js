import { useCallback, useMemo, useState } from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Text, Chip, SegmentedButtons } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { applicationApi } from '../../api/applicationApi';
import { candidateApi } from '../../api/candidateApi';
import { chatApi } from '../../api/chatApi';
import EmptyState from '../../components/EmptyState';
import LoadingView from '../../components/LoadingView';
import { resolveImageUrl } from '../../constants/config';
import { colors, spacing, radius } from '../../theme/theme';

const APP_STATUS_COLORS = {
  applied: '#E0E7FF', shortlisted: '#FEF3C7', hired: '#DCFCE7', rejected: '#FEE2E2',
};

function HistoryAvatar({ uri, fallback }) {
  const [failed, setFailed] = useState(false);
  const resolved = resolveImageUrl(uri);
  if (resolved && !failed) {
    return <Image source={{ uri: resolved }} style={styles.avatarImage} onError={() => setFailed(true)} />;
  }
  return (
    <View style={styles.avatarFallback}>
      <Text style={styles.avatarFallbackText}>{(fallback || '?').charAt(0).toUpperCase()}</Text>
    </View>
  );
}

/**
 * Candidate's full activity history in one place:
 *  - "Applied" tab: every job they've applied to (status, company, when).
 *  - "Hired / Partners" tab: every time a company hired them, or a fellow
 *    candidate brought them on as a project partner (who, and when).
 * Lives in the bottom tab bar (see MainTabNavigator.js).
 */
export default function CandidateHistoryScreen({ navigation }) {
  const [tab, setTab] = useState('applied');
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [hires, setHires] = useState([]);
  const [messaging, setMessaging] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [appsRes, hiresRes] = await Promise.all([
        applicationApi.getMine(),
        candidateApi.getHiredBy(),
      ]);
      setApplications(appsRes.data.data.applications || []);
      setHires(hiresRes.data.data.hires || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  // Newest first for both tabs.
  const sortedApplications = useMemo(
    () => [...applications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [applications],
  );
  const sortedHires = useMemo(
    () => [...hires].sort((a, b) => new Date(b.unlockDate || b.createdAt) - new Date(a.unlockDate || a.createdAt)),
    [hires],
  );

  if (loading) return <LoadingView />;

  const handleMessage = async (hirer, isCompany) => {
    setMessaging(hirer._id);
    try {
      const res = await chatApi.openConversation(hirer._id, isCompany ? 'Company' : 'Candidate');
      const conversation = res.data.data.conversation;
      const name = isCompany ? hirer.companyName : hirer.name;
      const avatar = isCompany ? hirer.logo : hirer.profileImage;
      navigation.navigate('ChatTab', {
        screen: 'ChatThread',
        params: { conversationId: conversation._id, otherName: name, otherAvatar: avatar },
      });
    } finally {
      setMessaging(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerWrap}>
        <Text variant="titleLarge" style={styles.title}>History</Text>
        <SegmentedButtons
          value={tab}
          onValueChange={setTab}
          style={styles.segmented}
          buttons={[
            { value: 'applied', label: `Applied (${applications.length})`, icon: 'file-document-outline' },
            { value: 'hired', label: `Hired (${hires.length})`, icon: 'briefcase-check-outline' },
          ]}
        />
      </View>

      {tab === 'applied' ? (
        <FlatList
          data={sortedApplications}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <EmptyState icon="file-document-outline" title="No applications yet" subtitle="Jobs you apply to will show up here." />
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.rowBetween}>
                <Text
                  variant="titleMedium"
                  style={styles.cardTitle}
                  numberOfLines={1}
                  onPress={() => item.jobId && navigation.navigate('JobsTab', { screen: 'JobDetails', params: { jobId: item.jobId._id } })}
                >
                  {item.jobId?.title || 'Job removed'}
                </Text>
                <Chip compact style={{ backgroundColor: APP_STATUS_COLORS[item.status] || colors.border }}>
                  {item.status}
                </Chip>
              </View>
              <Text variant="bodySmall" style={styles.meta}>{item.companyId?.companyName}</Text>
              <Text variant="bodySmall" style={styles.dateText}>
                Applied on {new Date(item.createdAt).toLocaleDateString()}
              </Text>
              {!!item.coverLetter && (
                <Text variant="bodySmall" style={styles.coverLetter} numberOfLines={2}>
                  “{item.coverLetter}”
                </Text>
              )}
            </View>
          )}
        />
      ) : (
        <FlatList
          data={sortedHires}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <EmptyState icon="briefcase-check-outline" title="No hires yet" subtitle="When a company or a fellow engineer hires you, it'll show up here." />
          }
          renderItem={({ item }) => {
            const isCompany = !!item.companyId;
            const hirer = isCompany ? item.companyId : item.hiringCandidateId;
            const name = isCompany ? hirer?.companyName : hirer?.name;
            const subtitle = isCompany
              ? [hirer?.industry, hirer?.location?.city].filter(Boolean).join(' · ')
              : hirer?.headline;
            return (
              <View style={styles.card}>
                <View style={styles.hireRow}>
                  <HistoryAvatar uri={isCompany ? hirer?.logo : hirer?.profileImage} fallback={name} />
                  <View style={styles.hireInfo}>
                    <View style={styles.rowBetween}>
                      <Text variant="titleMedium" style={styles.cardTitle} numberOfLines={1}>{name || 'Unknown'}</Text>
                      <Chip compact style={isCompany ? styles.companyChip : styles.partnerChip}>
                        {isCompany ? 'Company' : 'Project partner'}
                      </Chip>
                    </View>
                    {!!subtitle && <Text variant="bodySmall" style={styles.meta} numberOfLines={1}>{subtitle}</Text>}
                    <Text variant="bodySmall" style={styles.dateText}>
                      Hired on {new Date(item.unlockDate || item.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.messageBtn}
                    disabled={!hirer || messaging === hirer._id}
                    onPress={() => hirer && handleMessage(hirer, isCompany)}
                  >
                    <MaterialCommunityIcons name="chat-outline" size={20} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerWrap: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.md },
  title: { color: colors.text, fontWeight: '800', marginBottom: spacing.md },
  segmented: {},
  listContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  card: {
    backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md,
    marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border,
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { color: colors.text, fontWeight: '700', flex: 1, marginRight: spacing.sm },
  meta: { color: colors.textMuted, marginTop: 2 },
  dateText: { color: colors.primaryDark, fontWeight: '600', fontSize: 12, marginTop: spacing.xs },
  coverLetter: { color: colors.textMuted, marginTop: spacing.xs, fontStyle: 'italic' },
  hireRow: { flexDirection: 'row', alignItems: 'center' },
  hireInfo: { flex: 1, marginLeft: spacing.sm },
  messageBtn: {
    width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, marginLeft: spacing.sm,
  },
  avatarImage: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.border },
  avatarFallback: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarFallbackText: { color: '#fff', fontWeight: '700' },
  companyChip: { backgroundColor: '#E0E7FF' },
  partnerChip: { backgroundColor: '#FEF3C7' },
});
