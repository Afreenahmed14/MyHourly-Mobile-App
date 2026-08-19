import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home/HomeScreen';
import { colors } from '../theme/theme';

const Stack = createNativeStackNavigator();

// Editing the candidate profile (and, from inside it, building the
// home-page avatar) always happens on the Profile tab's own stack
// (see ProfileStack.js) — that's the single source of truth for both
// screens. HomeScreen's "Complete your profile" shortcut deliberately
// crosses tabs to ProfileTab > EditCandidateProfile instead of pushing
// a local copy here. Previously this stack ALSO registered its own
// EditCandidateProfile/AvatarBuilder screens; nothing actually
// navigated to them locally, but CandidateProfileScreen's edit button
// used to target 'HomeTab' > 'EditCandidateProfile', which landed on
// THIS stack's (headerless, back-button-less) copy instead of
// ProfileStack's. That split the flow across two different navigator
// instances — saving the avatar would "land" correctly in whichever
// stack it was opened from, but going back afterwards didn't return
// to where the user actually started, and the tab bar would silently
// jump to Home. Keeping only one registration (in ProfileStack) and
// having every entry point route there fixes it.
export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.surface }, headerTintColor: colors.text }}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
