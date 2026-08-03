import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import styles from '../styles/CompanyListScreens.styles';

export default function HiredCandidatesScreen() {
  // Mock — replace with real hired-candidate records once the backend is wired up.
  const hired = [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Hired Candidates</Text>
      </View>

      {hired.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>No hires yet</Text>
          <Text style={styles.emptySubtitle}>
            Candidates you hire from their profile will show up here, along with when you hired
            them and their contact details.
          </Text>
        </View>
      ) : null}
    </ScrollView>
  );
}
