import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ProfileProvider } from './src/context/ProfileContext';
import { AuthProvider } from './src/context/AuthContext';
import { JobsProvider } from './src/context/JobsContext';
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
import { colors } from './src/theme';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <ProfileProvider>
        <AuthProvider>
          <JobsProvider>
            <NavigationContainer>
              <StatusBar style="dark" />
              <Stack.Navigator
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
              </Stack.Navigator>
            </NavigationContainer>
          </JobsProvider>
        </AuthProvider>
      </ProfileProvider>
    </SafeAreaProvider>
  );
}
