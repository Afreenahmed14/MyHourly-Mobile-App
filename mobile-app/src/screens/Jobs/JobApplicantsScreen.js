import { useCallback, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Chip, Menu, Button, Avatar } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { applicationApi } from '../../api/applicationApi';
import EmptyState from '../../components/EmptyState';
import LoadingView from '../../components/LoadingView';
import { colors, spacing, radius } from '../../theme/theme';

const STATUS_COLORS = {
  applied: '#E0E7FF',
  shortlisted: '#FEF3C7',
  hired: '#DCFCE7',
  rejected: '#FEE2E2',
};

function ApplicantRow({ application, onStatusChange }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const candidate = application.candidateId || {};

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Avatar.Image
          size={44}
          source={candidate.profileImage ? { uri: candidate.profileImage } : require('../../../assets/icon.png')}
        />
        <View style={{ flex: 1, marginLeft: spacing.sm }}>
          <Text variant="titleMedium" style={styles.name}>{candidate.name}</Text>
          {!!candidate.headline && <Text variant="bodySmall" style={styles.headline}>{candidate.headline}</Text>}
        </View>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Chip
              onPress={() => setMenuVisible(true)}
              style={{ backgroundColor: STATUS_COLORS[application.status] || colors.border }}
            >
              {application.status}
            </Chip>
          }
        >
          {['applied', 'shortlisted', 'hired', 'rejected'].map((s) => (
            <Menu.Item
              key={s}
              title={s}
              onPress={() => {
                setMenuVisible(false);
                onStatusChange(application._id, s);
              }}
            />
          ))}
        </Menu>
      </View>
      {!!application.coverLetter && (
        <Text variant="bodySmall" style={styles.cover} numberOfLines={3}>{application.coverLetter}</Text>
      )}
    </View>
  );
}

export default function JobApplicantsScreen({ route }) {
  const { jobId, jobTitle } = route.params;
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await applicationApi.getForJob(jobId);
      setApplications(res.data.data.applications);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const onStatusChange = async (applicationId, status) => {
    await applicationApi.updateStatus(applicationId, status);
    load();
  };

  if (loading) return <LoadingView />;

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.header}>{jobTitle}</Text>
      <FlatList
        data={applications}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: spacing.lg, paddingTop: 0 }}
        ListEmptyComponent={<EmptyState icon="account-search-outline" title="No applicants yet" />}
        renderItem={({ item }) => <ApplicantRow application={item} onStatusChange={onStatusChange} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { color: colors.text, fontWeight: '700', padding: spacing.lg, paddingBottom: spacing.sm },
  card: {
    backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md,
    marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  name: { color: colors.text, fontWeight: '700' },
  headline: { color: colors.textMuted },
  cover: { color: colors.textMuted, marginTop: spacing.sm },
});
