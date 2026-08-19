import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/useAuth';
import CandidateProfileScreen from '../screens/Profile/CandidateProfileScreen';
import EditCandidateProfileScreen from '../screens/Profile/EditCandidateProfileScreen';
import CompanyProfileScreen from '../screens/Profile/CompanyProfileScreen';
import EditCompanyProfileScreen from '../screens/Profile/EditCompanyProfileScreen';
import AvatarBuilderScreen from '../screens/Profile/AvatarBuilderScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import AboutScreen from '../screens/Settings/AboutScreen';
import SupportScreen from '../screens/Settings/SupportScreen';
import PrivacyScreen from '../screens/Settings/PrivacyScreen';
import TermsScreen from '../screens/Settings/TermsScreen';
import { colors } from '../theme/theme';

const Stack = createNativeStackNavigator();
const headerOptions = { headerStyle: { backgroundColor: colors.surface }, headerTintColor: colors.text };

export default function ProfileStack() {
  const { role } = useAuth();
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      {role === 'company' ? (
        <>
          <Stack.Screen name="CompanyProfile" component={CompanyProfileScreen} options={{ headerShown: false }} />
          <Stack.Screen name="EditCompanyProfile" component={EditCompanyProfileScreen} options={{ headerShown:false, headerBackVisible:false}} />
        </>
      ) : (
        <>
          <Stack.Screen name="CandidateProfile" component={CandidateProfileScreen} options={{ headerShown: false }} />
          <Stack.Screen name="EditCandidateProfile" component={EditCandidateProfileScreen} options={{ title: 'Edit Profile' }} />
        </>
      )}
      <Stack.Screen name="AvatarBuilder" component={AvatarBuilderScreen} options={{ headerShown:false, headerBackVisible:false}} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="Support" component={SupportScreen} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} options={{ title: 'Privacy Policy' }} />
      <Stack.Screen name="Terms" component={TermsScreen} options={{ title: 'Terms of Service' }} />
    </Stack.Navigator>
  );
}
