import { createContext, useCallback, useEffect, useState } from 'react';
import { notificationApi } from '../api/notificationApi';
import { useAuth } from './useAuth';

export const NotificationContext = createContext(null);

/**
 * Native port of frontend/src/context/NotificationContext.jsx. Polls
 * unread count periodically so the tab-bar badge stays fresh without
 * requiring a push-notification round trip for every read.
 */
const POLL_INTERVAL_MS = 60 * 1000;

export function NotificationProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    fetchNotifications();
    if (!isAuthenticated) return undefined;
    const interval = setInterval(fetchNotifications, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchNotifications, isAuthenticated]);

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
