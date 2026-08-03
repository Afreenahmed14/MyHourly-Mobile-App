import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useCompanyProfile } from '../context/CompanyProfileContext';
import styles from '../styles/SubscriptionScreen.styles';

export default function SubscriptionScreen({ navigation }) {
  const { companyProfile } = useCompanyProfile();

  // Mock plan usage — replace with real subscription data once the backend is wired up.
  const usage = {
    profileEdits: 'Unlimited',
    jobPostsUsed: 0,
    jobPostsLimit: 3,
    jobPostsPeriod: '14 days',
    hiresUsed: 0,
    hiresLimit: 0,
    hiresPeriod: '7 days',
  };

  const handleUpgrade = () => {
    Alert.alert('Upgrade plan', 'This would take you to the plans screen.', [
      { text: 'View Plans', onPress: () => navigation.navigate('Pricing') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Subscription</Text>

      <View style={styles.card}>
        <Text style={styles.planLabel}>Company</Text>
        <Text style={styles.planName}>{companyProfile.plan}</Text>

        <View style={styles.usageRow}>
          <View style={styles.usageCol}>
            <Text style={styles.usageLabel}>Profile edits</Text>
            <Text style={styles.usageValue}>{usage.profileEdits}</Text>
          </View>
          <View style={styles.usageCol}>
            <Text style={styles.usageLabel}>Job posts</Text>
            <Text style={styles.usageValue}>
              {usage.jobPostsUsed} / {usage.jobPostsLimit} used (per {usage.jobPostsPeriod})
            </Text>
          </View>
        </View>

        <View style={styles.usageRow}>
          <View style={styles.usageCol}>
            <Text style={styles.usageLabel}>Hires</Text>
            <Text style={styles.usageValue}>
              {usage.hiresUsed} / {usage.hiresLimit} used (per {usage.hiresPeriod})
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.upgradeBtn} onPress={handleUpgrade}>
          <Text style={styles.upgradeBtnText}>Upgrade plan</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
