import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyApplicationsScreen from '../screens/Applications/MyApplicationsScreen';
import { colors } from '../theme/theme';

const Stack = createNativeStackNavigator();

export default function ApplicationsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.surface }, headerTintColor: colors.text }}>
      <Stack.Screen name="MyApplications" component={MyApplicationsScreen} options={{ title: 'My Applications' }} />
    </Stack.Navigator>
  );
}
