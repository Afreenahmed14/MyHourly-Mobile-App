import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ConversationsListScreen from '../screens/Chat/ConversationsListScreen';
import ChatThreadScreen from '../screens/Chat/ChatThreadScreen';
import { colors } from '../theme/theme';

const Stack = createNativeStackNavigator();

/**
 * Chat tab, reachable from the top navbar's chat icon (see AppHeader.js).
 * List of threads -> individual thread. New threads are started from a
 * hired candidate's / company's profile via a "Message" action, since
 * chat is gated server-side to accounts with an existing hire.
 */
export default function ChatStack() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.surface }, headerTintColor: colors.text }}>
      <Stack.Screen name="ChatList" component={ConversationsListScreen} options={{ title: 'Chat' }} />
      <Stack.Screen name="ChatThread" component={ChatThreadScreen} options={{ title: 'Chat' }} />
    </Stack.Navigator>
  );
}
