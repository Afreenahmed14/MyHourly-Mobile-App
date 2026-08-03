import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import styles from '../styles/CompanyListScreens.styles';

export default function BookmarkedScreen() {
  // Mock — replace with real bookmarked engineers once the backend is wired up.
  const bookmarks = [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Bookmarked Engineers</Text>
      </View>

      {bookmarks.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>No bookmarks yet</Text>
          <Text style={styles.emptySubtitle}>
            Bookmark engineers while browsing to save them here for later.
          </Text>
        </View>
      ) : null}
    </ScrollView>
  );
}
