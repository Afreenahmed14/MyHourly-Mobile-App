import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { Text, Button } from 'react-native-paper';
import { subscriptionApi } from '../../api/subscriptionApi';
import { useAuth } from '../../context/useAuth';
import { useSubscription } from '../../context/useSubscription';
import LoadingView from '../../components/LoadingView';
import { colors, spacing } from '../../theme/theme';

/**
 * Razorpay Checkout has no native Expo-Go-compatible SDK, so this loads
 * Razorpay's own checkout.js inside a WebView — same hosted checkout UI
 * the web app uses, just embedded. On success/failure it posts a message
 * back to React Native, which then calls the exact same
 * POST /subscription/verify endpoint the web app uses (server-side
 * signature verification — nothing trusted from the client).
 */
function buildCheckoutHtml({ keyId, amount, currency, orderId, name, description, prefillEmail }) {
  return `
<!DOCTYPE html>
<html><head><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;">
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
<script>
  function post(payload) {
    window.ReactNativeWebView.postMessage(JSON.stringify(payload));
  }
  var options = {
    key: "${keyId}",
    amount: "${amount}",
    currency: "${currency}",
    order_id: "${orderId}",
    name: "HourlyRecruit",
    description: "${description}",
    prefill: { email: "${prefillEmail || ''}" },
    handler: function (response) {
      post({ type: 'success', response: response });
    },
    modal: {
      ondismiss: function () {
        post({ type: 'dismissed' });
      }
    }
  };
  var rzp = new Razorpay(options);
  rzp.on('payment.failed', function (response) {
    post({ type: 'failed', response: response.error });
  });
  rzp.open();
</script>
</body></html>`;
}

export default function SubscriptionCheckoutScreen({ route, navigation }) {
  const { product, tier, planName } = route.params;
  const { user } = useAuth();
  const { refresh } = useSubscription();
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await subscriptionApi.createOrder(product, tier);
        setOrderData(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not start checkout.');
      }
    })();
  }, [product, tier]);

  const onMessage = async (event) => {
    let payload;
    try {
      payload = JSON.parse(event.nativeEvent.data);
    } catch {
      return;
    }

    if (payload.type === 'success') {
      setVerifying(true);
      try {
        await subscriptionApi.verifyPayment({
          razorpay_order_id: payload.response.razorpay_order_id,
          razorpay_payment_id: payload.response.razorpay_payment_id,
          razorpay_signature: payload.response.razorpay_signature,
          product,
          tier,
        });
        await refresh();
        setDone(true);
      } catch (err) {
        setError(err.response?.data?.message || 'Payment verification failed.');
      } finally {
        setVerifying(false);
      }
    } else if (payload.type === 'failed') {
      setError(payload.response?.description || 'Payment failed.');
    } else if (payload.type === 'dismissed') {
      navigation.goBack();
    }
  };

  if (done) {
    return (
      <View style={styles.centered}>
        <Text variant="headlineSmall" style={styles.successTitle}>You're all set!</Text>
        <Text variant="bodyMedium" style={styles.successBody}>Your {planName} plan is now active.</Text>
        <Button mode="contained" style={{ marginTop: spacing.lg }} onPress={() => navigation.navigate('SubscriptionStatus')}>
          View my plan
        </Button>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Button mode="outlined" style={{ marginTop: spacing.lg }} onPress={() => navigation.goBack()}>
          Go back
        </Button>
      </View>
    );
  }

  if (!orderData || verifying) return <LoadingView />;

  const html = buildCheckoutHtml({
    keyId: orderData.keyId,
    amount: orderData.amount,
    currency: orderData.currency,
    orderId: orderData.orderId,
    name: planName,
    description: planName,
    prefillEmail: user?.email,
  });

  return (
    <WebView
      originWhitelist={['*']}
      source={{ html }}
      onMessage={onMessage}
      style={{ flex: 1 }}
    />
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg, backgroundColor: colors.background },
  successTitle: { color: colors.text, fontWeight: '700' },
  successBody: { color: colors.textMuted, marginTop: spacing.sm },
  errorText: { color: colors.error, textAlign: 'center' },
});
