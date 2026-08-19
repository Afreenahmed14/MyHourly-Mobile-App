import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/useAuth';
import CandidateHistoryScreen from '../screens/History/CandidateHistoryScreen';
import CompanyHistoryScreen from '../screens/History/CompanyHistoryScreen';
import { colors } from '../theme/theme';

const Stack = createNativeStackNavigator();
const headerOptions = { headerStyle: { backgroundColor: colors.surface }, headerTintColor: colors.text };

/**
 * Role-aware History tab: candidates see their applications + who hired
 * them; companies see their job postings (open/closed) + who they hired.
 * Lives in the bottom tab bar (see MainTabNavigator.js).
 */
export default function HistoryStack() {
  const { role } = useAuth();
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      {role === 'company' ? (
        <Stack.Screen name="CompanyHistory" component={CompanyHistoryScreen} options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="CandidateHistory" component={CandidateHistoryScreen} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  );
}
