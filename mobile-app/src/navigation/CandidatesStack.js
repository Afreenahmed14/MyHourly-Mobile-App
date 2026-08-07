import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BrowseFreelancersScreen from '../screens/Candidates/BrowseFreelancersScreen';
import CandidateDetailsScreen from '../screens/Candidates/CandidateDetailsScreen';
import BookmarksScreen from '../screens/Candidates/BookmarksScreen';
import HiredCandidatesScreen from '../screens/Candidates/HiredCandidatesScreen';
import { colors } from '../theme/theme';

const Stack = createNativeStackNavigator();
const headerOptions = { headerStyle: { backgroundColor: colors.surface }, headerTintColor: colors.text };

export default function CandidatesStack() {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen name="BrowseFreelancers" component={BrowseFreelancersScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CandidateDetails" component={CandidateDetailsScreen} options={{ title: 'Profile' }} />
      <Stack.Screen name="Bookmarks" component={BookmarksScreen} options={{ title: 'Bookmarked Engineers' }} />
      <Stack.Screen name="HiredCandidates" component={HiredCandidatesScreen} options={{ title: 'Hired Candidates' }} />
    </Stack.Navigator>
  );
}
