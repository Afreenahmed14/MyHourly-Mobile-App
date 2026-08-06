import { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Chip, SegmentedButtons } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { subscriptionApi } from '../../api/subscriptionApi';
import { useAuth } from '../../context/useAuth';
import { useSubscription } from '../../context/useSubscription';
import LoadingView from '../../components/LoadingView';
import { colors, spacing, radius } from '../../theme/theme';

/**
 * Native port of the web Pricing/Subscription page. Fetches the same
 * public plan catalog (GET /subscription/plans?for=role), then hands off
 * to SubscriptionCheckoutScreen (Razorpay WebView) for payment — same
 * order/verify flow as web, just a different UI shell for the checkout.
 */
export default function PlansScreen({ navigation }) {
  const { role } = useAuth();
  const { subscription, refresh } = useSubscription();
  const [products, setProducts] = useState([]);
  const [tier, setTier] = useState('monthly');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await subscriptionApi.getPlans(role);
      setProducts(res.data.data.products);
    } finally {
      setLoading(false);
    }
  }, [role]);

  useFocusEffect(useCallback(() => { load(); refresh(); }, [load, refresh]));

  if (loading) return <LoadingView />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.lg }}>
      <Text variant="headlineSmall" style={styles.title}>Plans</Text>
      {!!subscription && (
        <Text variant="bodyMedium" style={styles.currentPlan}>
          Current plan: <Text style={{ fontWeight: '700' }}>{subscription.name || 'Free'}</Text>
        </Text>
      )}

      <SegmentedButtons
        value={tier}
        onValueChange={setTier}
        style={{ marginBottom: spacing.lg }}
        buttons={[{ value: 'monthly', label: 'Monthly' }, { value: 'yearly', label: 'Yearly' }]}
      />

      {products.map((product) => {
        const plan = product.tiers?.[tier] || product.tiers?.find?.((t) => t.id === tier);
        if (!plan) return null;
        return (
          <View key={product.id} style={styles.card}>
            <Text variant="titleMedium" style={styles.productName}>{product.label}</Text>
            <Text variant="headlineSmall" style={styles.price}>
              {plan.price ? `₹${plan.price}` : 'Free'}
              {plan.price ? <Text style={styles.perPeriod}> / {tier}</Text> : null}
            </Text>
            {!!plan.features?.length && (
              <View style={{ marginVertical: spacing.md }}>
                {plan.features.map((f) => (
                  <Text key={f} variant="bodySmall" style={styles.feature}>• {f}</Text>
                ))}
              </View>
            )}
            <Button
              mode="contained"
              disabled={subscription?.product === product.id && subscription?.tier === plan.id}
              onPress={() =>
                navigation.navigate('SubscriptionCheckout', { product: product.id, tier: plan.id, planName: `${product.name} (${tier})` })
              }
            >
              {subscription?.product === product.id && subscription?.tier === plan.id ? 'Current plan' : 'Choose plan'}
            </Button>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { color: colors.text, fontWeight: '700', marginBottom: spacing.xs },
  currentPlan: { color: colors.textMuted, marginBottom: spacing.lg },
  card: {
    backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.lg,
    marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.border,
  },
  productName: { color: colors.text, fontWeight: '700' },
  price: { color: colors.primary, fontWeight: '700', marginTop: spacing.xs },
  perPeriod: { fontSize: 14, color: colors.textMuted, fontWeight: '400' },
  feature: { color: colors.textMuted, marginTop: spacing.xs },
});
