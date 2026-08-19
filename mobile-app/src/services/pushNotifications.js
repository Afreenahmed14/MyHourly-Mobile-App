import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

// Controls how a notification is presented while the app is open in the
// foreground — without this, foreground pushes are silently swallowed.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Requests OS notification permission (if not already granted) and
 * returns this device's Expo push token, or null if permission was
 * denied or this is a simulator/emulator (push tokens require a real
 * device).
 */
export async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    console.log('Push notifications require a physical device (not a simulator/emulator).');
    return null;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#4F46E5',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    console.log('Notification permission was not granted.');
    return null;
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
  if (!projectId) {
    // Push tokens are scoped to an EAS project. In plain Expo Go this can
    // be missing until `app.json`'s extra.eas.projectId is set up via
    // `eas init` — the in-app notification list still works either way.
    console.log('No EAS projectId configured — skipping push token registration.');
    return null;
  }

  try {
    const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
    return token;
  } catch (err) {
    console.log('Failed to get Expo push token:', err.message);
    return null;
  }
}
