import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { notificationApi } from '../api/notificationApi';
import { useAuth } from './useAuth';
import { registerForPushNotificationsAsync } from '../services/pushNotifications';
import { navigate } from '../navigation/navigationRef';

export const NotificationContext = createContext(null);

/**
 * Native port of frontend/src/context/NotificationContext.jsx. Polls
 * unread count periodically so the tab-bar badge stays fresh without
 * requiring a push-notification round trip for every read.
 *
 * Also owns real mobile OS push notifications: registers this device's
 * Expo push token with the backend on login, refreshes the in-app list
 * when a push arrives while the app is open, and deep-links into the
 * Notifications tab when the user taps a push from the OS tray.
 */
const POLL_INTERVAL_MS = 60 * 1000;

export function NotificationProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const fetchRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    setLoading(true);
    try {
      const res = await notificationApi.getMine();
      setNotifications(res.data.data.notifications);
      setUnreadCount(res.data.data.unreadCount);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  fetchRef.current = fetchNotifications;

  useEffect(() => {
    fetchNotifications();
    if (!isAuthenticated) return undefined;
    const interval = setInterval(fetchNotifications, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchNotifications, isAuthenticated]);

  // Register this device for real push notifications once logged in.
  useEffect(() => {
    if (!isAuthenticated) return;
    (async () => {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        try {
          await notificationApi.registerPushToken(token);
        } catch {
          // Non-fatal — in-app notifications still work without push.
        }
      }
    })();
  }, [isAuthenticated]);

  // While the app is open: a push arriving refreshes the in-app list so
  // the bell badge stays in sync without waiting for the next poll.
  // On tap (app backgrounded/killed or foregrounded): jump straight to
  // the Notifications tab, same destination either way.
  useEffect(() => {
    const receivedSub = Notifications.addNotificationReceivedListener(() => {
      fetchRef.current?.();
    });
    const responseSub = Notifications.addNotificationResponseReceivedListener(() => {
      navigate('NotificationsTab');
    });
    return () => {
      receivedSub.remove();
      responseSub.remove();
    };
  }, []);

  const markAsRead = async (id) => {
    await notificationApi.markAsRead(id);
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  const markAllAsRead = async () => {
    await notificationApi.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const removeNotification = async (id) => {
    await notificationApi.remove(id);
    setNotifications((prev) => prev.filter((n) => n._id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, loading, refresh: fetchNotifications, markAsRead, markAllAsRead, removeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
