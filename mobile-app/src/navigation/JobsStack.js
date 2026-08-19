import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/useAuth';
import BrowseJobsScreen from '../screens/Jobs/BrowseJobsScreen';
import JobDetailsScreen from '../screens/Jobs/JobDetailsScreen';
import MyJobsScreen from '../screens/Jobs/MyJobsScreen';
import PostJobScreen from '../screens/Jobs/PostJobScreen';
import JobApplicantsScreen from '../screens/Jobs/JobApplicantsScreen';
import { colors } from '../theme/theme';

const Stack = createNativeStackNavigator();

const headerOptions = { headerStyle: { backgroundColor: colors.surface }, headerTintColor: colors.text };

export default function JobsStack() {
  const { role } = useAuth();
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      {role === 'company' ? (
        <>
          <Stack.Screen name="MyJobs" component={MyJobsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="PostJob" component={PostJobScreen} options={{ headerShown:false, headerBackVisible:false}} />
          <Stack.Screen name="JobApplicants" component={JobApplicantsScreen} options={{ title: 'Applicants' }} />
        </>
      ) : (
        <>
          <Stack.Screen name="BrowseJobs" component={BrowseJobsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="JobDetails" component={JobDetailsScreen} options={{ title: 'Job Details' }} />
        </>
      )}
    </Stack.Navigator>
  );
}
