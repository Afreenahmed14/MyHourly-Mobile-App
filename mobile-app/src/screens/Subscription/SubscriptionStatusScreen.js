import { useCallback } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, ProgressBar } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { subscriptionApi } from '../../api/subscriptionApi';
import { useSubscription } from '../../context/useSubscription';
import LoadingView from '../../components/LoadingView';
import { colors, spacing, radius } from '../../theme/theme';

export default function SubscriptionStatusScreen({ navigation }) {
  const { subscription, loading, refresh } = useSubscription();

  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));

  const onCancel = () => {
    Alert.alert('Cancel subscription?', "You'll move back to the Free plan immediately.", [
      { text: 'Keep plan', style: 'cancel' },
      {
        text: 'Cancel plan', style: 'destructive', onPress: async () => {
          await subscriptionApi.cancel();
          refresh();
        },
      },
    ]);
  };

  if (loading || !subscription) return <LoadingView />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.lg }}>
      <Text variant="headlineSmall" style={styles.title}>Your subscription</Text>

      <View style={styles.card}>
        <Text variant="titleMedium" style={styles.planName}>{subscription.name || 'Free'}</Text>
        <Text variant="bodySmall" style={styles.status}>Status: {subscription.status}</Text>
        {!!subscription.endDate && (
          <Text variant="bodySmall" style={styles.status}>
            Renews/expires: {new Date(subscription.endDate).toLocaleDateString()}
          </Text>
        )}
      </View>

      {Object.entries(subscription.quotas || {}).map(([key, quota]) => (
        <View key={key} style={styles.quotaCard}>
          <Text variant="bodyMedium" style={styles.quotaLabel}>{key}</Text>
          <Text variant="bodySmall" style={styles.quotaUsage}>
            {quota.limit === null ? 'Unlimited' : `${quota.used} / ${quota.limit} used`}
          </Text>
          {quota.limit !== null && (
            <ProgressBar
              progress={quota.limit ? Math.min(1, quota.used / quota.limit) : 0}
              color={colors.primary}
              style={styles.progressBar}
            />
          )}
        </View>
      ))}

      <Button mode="contained" style={{ marginTop: spacing.lg }} onPress={() => navigation.navigate('Plans')}>
        Change plan
      </Button>
      {subscription.tier !== 'free' && (
        <Button mode="outlined" textColor={colors.error} style={{ marginTop: spacing.md }} onPress={onCancel}>
          Cancel subscription
        </Button>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { color: colors.text, fontWeight: '700', marginBottom: spacing.lg },
  card: {
    backgroundColor: colors.primary, borderRadius: radius.md, padding: spacing.lg, marginBottom: spacing.lg,
  },
  planName: { color: '#fff', fontWeight: '700' },
  status: { color: '#E0E7FF', marginTop: spacing.xs },
  quotaCard: {
    backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md,
    marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border,
  },
  quotaLabel: { color: colors.text, fontWeight: '600', textTransform: 'capitalize' },
  quotaUsage: { color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.sm },
  progressBar: { height: 6, borderRadius: 3 },
});
