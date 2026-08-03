import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ProfileProvider } from './src/context/ProfileContext';
import { AuthProvider } from './src/context/AuthContext';
import { JobsProvider } from './src/context/JobsContext';
import { CompanyProfileProvider } from './src/context/CompanyProfileContext';
import DashboardScreen from './src/screens/DashboardScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import ViewProfileScreen from './src/screens/ViewProfileScreen';
import BrowseEngineersScreen from './src/screens/BrowseEngineersScreen';
import BrowseJobsScreen from './src/screens/BrowseJobsScreen';
import TechnologiesScreen from './src/screens/TechnologiesScreen';
import PricingScreen from './src/screens/PricingScreen';
import JobDetailScreen from './src/screens/JobDetailScreen';
import LoginRoleScreen from './src/screens/LoginRoleScreen';
import LoginFormScreen from './src/screens/LoginFormScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import CompanyDashboardScreen from './src/screens/CompanyDashboardScreen';
import CompanyProfileScreen from './src/screens/CompanyProfileScreen';
import SubscriptionScreen from './src/screens/SubscriptionScreen';
import MyJobsScreen from './src/screens/MyJobsScreen';
import PostJobScreen from './src/screens/PostJobScreen';
import BookmarkedScreen from './src/screens/BookmarkedScreen';
import HiredCandidatesScreen from './src/screens/HiredCandidatesScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import { colors } from './src/theme';

const Stack = createNativeStackNavigator();

export default function App() {
  return ( 
    <SafeAreaProvider>
      <ProfileProvider>
        <CompanyProfileProvider>
        <AuthProvider>
          <JobsProvider>
            <NavigationContainer>
              <StatusBar style="dark" />
              <Stack.Navigator
                initialRouteName="LoginRole"
                screenOptions={{
                  headerStyle: { backgroundColor: colors.white },
                  headerTitleStyle: { color: colors.text, fontWeight: '700' },
                  headerShadowVisible: false,
                  contentStyle: { backgroundColor: colors.background },
                }}
              >
                <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
                <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
                <Stack.Screen name="ViewProfile" component={ViewProfileScreen} options={{ title: 'Profile' }} />
                <Stack.Screen
                  name="BrowseEngineers"
                  component={BrowseEngineersScreen}
                  options={{ title: 'Browse Engineers' }}
                />
                <Stack.Screen name="BrowseJobs" component={BrowseJobsScreen} options={{ title: 'Browse Jobs' }} />
                <Stack.Screen
                  name="Technologies"
                  component={TechnologiesScreen}
                  options={{ title: 'Technologies' }}
                />
                <Stack.Screen name="Pricing" component={PricingScreen} options={{ title: 'Pricing' }} />
                <Stack.Screen
                  name="JobDetail"
                  component={JobDetailScreen}
                  options={{ title: 'Job Details' }}
                />
                <Stack.Screen name="LoginRole" component={LoginRoleScreen} options={{ title: 'Log In' }} />
                <Stack.Screen name="LoginForm" component={LoginFormScreen} options={{ title: 'Log In' }} />
                <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Sign Up' }} />
                <Stack.Screen
                  name="CompanyDashboard"
                  component={CompanyDashboardScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="CompanyProfile"
                  component={CompanyProfileScreen}
                  options={{ title: 'Company Profile' }}
                />
                <Stack.Screen name="MyJobs" component={MyJobsScreen} options={{ title: 'My Jobs' }} />
                <Stack.Screen
                  name="PostJob"
                  component={PostJobScreen}
                  options={({ route }) => ({ title: route?.params?.jobId ? 'Edit Job' : 'Post a Job' })}
                />
                <Stack.Screen
                  name="Subscription"
                  component={SubscriptionScreen}
                  options={{ title: 'Subscription' }}
                />
                <Stack.Screen name="Bookmarked" component={BookmarkedScreen} options={{ title: 'Bookmarked' }} />
                <Stack.Screen
                  name="HiredCandidates"
                  component={HiredCandidatesScreen}
                  options={{ title: 'Hired Candidates' }}
                />
                <Stack.Screen
                  name="Notifications"
                  component={NotificationsScreen}
                  options={{ title: 'Notifications' }}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </JobsProvider>
        </AuthProvider>
        </CompanyProfileProvider>
      </ProfileProvider>
    </SafeAreaProvider>
  );
}
