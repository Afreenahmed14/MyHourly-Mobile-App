import { useCallback, useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, Chip, IconButton } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { applicationApi } from '../../api/applicationApi';
import EmptyState from '../../components/EmptyState';
import LoadingView from '../../components/LoadingView';
import { colors, spacing, radius } from '../../theme/theme';

const STATUS_COLORS = {
  applied: '#E0E7FF', shortlisted: '#FEF3C7', hired: '#DCFCE7', rejected: '#FEE2E2',
};

export default function MyApplicationsScreen({ navigation }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await applicationApi.getMine();
      setApplications(res.data.data.applications);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const withdraw = (application) => {
    Alert.alert('Withdraw application?', `Withdraw your application for "${application.jobId?.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Withdraw', style: 'destructive', onPress: async () => {
          await applicationApi.withdraw(application._id);
          load();
        },
      },
    ]);
  };

  if (loading) return <LoadingView />;

  return (
    <View style={styles.container}>
      <FlatList
        data={applications}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: spacing.lg }}
        ListEmptyComponent={<EmptyState icon="file-document-outline" title="No applications yet" subtitle="Jobs you apply to will show up here." />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <Text
                variant="titleMedium"
                style={styles.title}
                numberOfLines={1}
                onPress={() => item.jobId && navigation.navigate('JobsTab', { screen: 'JobDetails', params: { jobId: item.jobId._id } })}
              >
                {item.jobId?.title || 'Job removed'}
              </Text>
              {item.status === 'applied' && (
                <IconButton icon="close-circle-outline" iconColor={colors.error} onPress={() => withdraw(item)} />
              )}
            </View>
            <Text variant="bodySmall" style={styles.company}>{item.companyId?.companyName}</Text>
            <Chip compact style={{ backgroundColor: STATUS_COLORS[item.status] || colors.border, alignSelf: 'flex-start', marginTop: spacing.xs }}>
              {item.status}
            </Chip>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  card: {
    backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md,
    marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border,
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: colors.text, fontWeight: '700', flex: 1 },
  company: { color: colors.textMuted, marginTop: 2 },
});
