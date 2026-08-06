import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Badge, Avatar } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { useAuth } from '../context/useAuth';
import { useNotifications } from '../context/useNotifications';
import HomeStack from './HomeStack';
import JobsStack from './JobsStack';
import CandidatesStack from './CandidatesStack';
import ApplicationsStack from './ApplicationsStack';
import SubscriptionStack from './SubscriptionStack';
import NotificationsStack from './NotificationsStack';
import ProfileStack from './ProfileStack';
import { colors } from '../theme/theme';

const Tab = createBottomTabNavigator();

function BellIcon({ color, size }) {
  const { unreadCount } = useNotifications();
  return (
    <View>
      <MaterialCommunityIcons name="bell-outline" color={color} size={size} />
      {unreadCount > 0 && (
        <Badge size={16} style={{ position: 'absolute', top: -4, right: -6 }}>{unreadCount}</Badge>
      )}
    </View>
  );
}

// Bottom-tab "Profile" icon shows the user's actual photo instead of a
// generic glyph, ringed in the active tab color when focused.
function ProfileTabIcon({ color, size, focused }) {
  const { user } = useAuth();
  const photo = user?.profileImage || user?.logo;

  if (!photo) {
    return <MaterialCommunityIcons name="account-circle-outline" color={color} size={size} />;
  }

  return (
    <Avatar.Image
      size={size + 4}
      source={{ uri: photo }}
      style={[styles.tabAvatar, focused && { borderColor: colors.primary }]}
    />
  );
}

/**
 * Role-aware tab bar: candidates get Jobs + Applications + Partners;
 * companies get Jobs (their postings) + Freelancers. Home, Subscription,
 * Notifications, and Profile are shared by both roles.
 */
export default function MainTabNavigator() {
  const { role } = useAuth();

  return (
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
      <Tab.Screen
        name="NotificationsTab"
        component={NotificationsStack}
        options={{ title: 'Alerts', tabBarIcon: BellIcon }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{ title: 'Profile', tabBarIcon: ProfileTabIcon }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabAvatar: { borderWidth: 2, borderColor: 'transparent' },
});
