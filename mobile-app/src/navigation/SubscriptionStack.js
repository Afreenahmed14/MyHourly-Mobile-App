import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PlansScreen from '../screens/Subscription/PlansScreen';
import SubscriptionCheckoutScreen from '../screens/Subscription/SubscriptionCheckoutScreen';
import SubscriptionStatusScreen from '../screens/Subscription/SubscriptionStatusScreen';
import { colors } from '../theme/theme';

const Stack = createNativeStackNavigator();
const headerOptions = { headerStyle: { backgroundColor: colors.surface }, headerTintColor: colors.text };

export default function SubscriptionStack() {
  return (
    <Stack.Navigator screenOptions={headerOptions} initialRouteName="SubscriptionStatus">
      <Stack.Screen name="SubscriptionStatus" component={SubscriptionStatusScreen} options={{ title: 'My Plan' }} />
      <Stack.Screen name="Plans" component={PlansScreen} options={{ title: 'Plans' }} />
      <Stack.Screen name="SubscriptionCheckout" component={SubscriptionCheckoutScreen} options={{ title: 'Checkout' }} />
    </Stack.Navigator>
  );
}
