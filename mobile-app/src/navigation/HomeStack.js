import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home/HomeScreen';
import EditCandidateProfileScreen from '../screens/Profile/EditCandidateProfileScreen';
import AvatarBuilderScreen from '../screens/Profile/AvatarBuilderScreen';
import { colors } from '../theme/theme';

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.surface }, headerTintColor: colors.text }}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="EditCandidateProfile"
        component={EditCandidateProfileScreen}
        options={{ title: 'Edit Profile' }}
      />
      <Stack.Screen name="AvatarBuilder" component={AvatarBuilderScreen} options={{ title: 'Build your avatar' }} />
    </Stack.Navigator>
  );
}
