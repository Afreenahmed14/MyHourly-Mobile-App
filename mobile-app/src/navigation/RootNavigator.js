import { useEffect, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/useAuth';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import SplashScreen from '../screens/Auth/SplashScreen';
import WelcomeTransitionScreen from '../screens/Auth/WelcomeTransitionScreen';
import { navigationRef } from './navigationRef';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { isAuthenticated, loading } = useAuth();

  // Tracks whether we've established a baseline auth state yet, so a
  // restored session on cold start doesn't replay the "just logged in"
  // airplane transition — it should only play right after an explicit
  // login/registration that happens while the app is already open.
  const authBaselineSet = useRef(false);
  const wasAuthenticated = useRef(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!authBaselineSet.current) {
      authBaselineSet.current = true;
      wasAuthenticated.current = isAuthenticated;
      return;
    }
    if (isAuthenticated && !wasAuthenticated.current) {
      setShowWelcome(true);
    }
    wasAuthenticated.current = isAuthenticated;
  }, [isAuthenticated, loading]);

  if (loading) return <SplashScreen />;

  if (isAuthenticated && showWelcome) {
    return <WelcomeTransitionScreen onFinish={() => setShowWelcome(false)} />;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="App" component={MainTabNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
