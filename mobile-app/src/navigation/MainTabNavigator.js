import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';
import { useAuth } from '../context/useAuth';
import AppHeader from '../components/AppHeader';
import HomeStack from './HomeStack';
import JobsStack from './JobsStack';
import CandidatesStack from './CandidatesStack';
import ApplicationsStack from './ApplicationsStack';
import SubscriptionStack from './SubscriptionStack';
import NotificationsStack from './NotificationsStack';
import ProfileStack from './ProfileStack';
import { colors } from '../theme/theme';

const Tab = createBottomTabNavigator();

// Notifications and Profile live behind the top navbar's bell + avatar
// now, not the bottom tab bar — but they stay registered as real tabs
// (just hidden from the tab bar UI) so every existing
// navigation.navigate('NotificationsTab' | 'ProfileTab', ...) call
// elsewhere in the app keeps working untouched.
const hiddenTabOptions = { tabBarButton: () => null, tabBarItemStyle: { display: 'none' } };

/**
 * Role-aware tab bar: candidates get Jobs + Applications + Partners;
 * companies get Jobs (their postings) + Freelancers. Home, Subscription
 * stay on the bottom bar for both roles. Notifications and Profile are
 * reachable from the persistent top navbar instead of the bottom bar.
 */
export default function MainTabNavigator() {
  const { role } = useAuth();

  return (
    <View style={styles.root}>
      <AppHeader />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
        }}
      >
        <Tab.Screen
          name="HomeTab"
          component={HomeStack}
          options={{ title: 'Home', tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="home-outline" color={color} size={size} /> }}
        />
        <Tab.Screen
          name="JobsTab"
          component={JobsStack}
          options={{
            title: role === 'company' ? 'My Jobs' : 'Jobs',
            tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="briefcase-outline" color={color} size={size} />,
          }}
        />
        {role === 'candidate' && (
          <Tab.Screen
            name="ApplicationsTab"
            component={ApplicationsStack}
            options={{ title: 'Applications', tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="file-document-outline" color={color} size={size} /> }}
          />
        )}
        <Tab.Screen
          name="CandidatesTab"
          component={CandidatesStack}
          options={{
            title: role === 'candidate' ? 'Partners' : 'Freelancers',
            tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account-search-outline" color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="SubscriptionTab"
          component={SubscriptionStack}
          options={{ title: 'Plan', tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="crown-outline" color={color} size={size} /> }}
        />
        <Tab.Screen name="NotificationsTab" component={NotificationsStack} options={hiddenTabOptions} />
        <Tab.Screen name="ProfileTab" component={ProfileStack} options={hiddenTabOptions} />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
});
