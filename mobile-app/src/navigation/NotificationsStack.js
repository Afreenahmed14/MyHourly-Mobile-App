import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NotificationsScreen from '../screens/Notifications/NotificationsScreen';
import { colors } from '../theme/theme';

const Stack = createNativeStackNavigator();

export default function NotificationsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.surface }, headerTintColor: colors.text }}>
      <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
