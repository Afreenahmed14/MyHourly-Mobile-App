import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import styles from '../styles/CompanyListScreens.styles';

export default function NotificationsScreen() {
  // Mock — replace with real notifications once the backend is wired up.
  const notifications = [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Notifications</Text>
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyWrap}>
          <View style={styles.emptyIconWrap}>
            <Ionicons name="notifications-outline" size={24} color={colors.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>You're all caught up</Text>
          <Text style={styles.emptySubtitle}>New applications and messages will show up here.</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}
