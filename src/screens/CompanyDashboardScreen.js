import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Card from '../components/Card';
import CompanySideDrawer from '../components/CompanySideDrawer';
import { useCompanyProfile } from '../context/CompanyProfileContext';
import { colors } from '../theme';
import styles from '../styles/CompanyDashboardScreen.styles';

function StarRow({ rating }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <View style={styles.starRow}>
      {stars.map((s) => (
        <Ionicons
          key={s}
          name={s <= Math.round(rating) ? 'star' : 'star-outline'}
          size={14}
          color={colors.star}
          style={styles.starIcon}
        />
      ))}
    </View>
  );
}

export default function CompanyDashboardScreen({ navigation }) {
  const { companyProfile } = useCompanyProfile();
  const [drawerVisible, setDrawerVisible] = useState(false);

  // Mock values — replace with real data once the backend is wired up.
  const bookmarkedCount = 0;
  const rating = 4.0;
  const reviewCount = 0;

  const displayName = companyProfile.companyName || 'xyz';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.brandBar}>
          <View style={styles.brandLogoRow}>
            <TouchableOpacity onPress={() => setDrawerVisible(true)} style={styles.hamburgerBtn}>
              <Ionicons name="menu" size={24} color={colors.text} />
            </TouchableOpacity>
            <Image
              source={require('../../assets/brand/logo-icon.png')}
              style={styles.brandLogoImage}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.brandName}>MyHourly</Text>
              <Text style={styles.brandTagline}>HIRE. WORK. EARN. BY THE HOUR.</Text>
            </View>
          </View>
        </View>

        <CompanySideDrawer
          visible={drawerVisible}
          onClose={() => setDrawerVisible(false)}
          navigation={navigation}
          activeRoute="CompanyDashboard"
        />

        <View style={styles.headerRow}>
          <Text style={styles.title}>Welcome, {displayName}</Text>
          <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('CompanyProfile')}>
            <Ionicons name="create-outline" size={16} color={colors.white} />
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>🔖 Bookmarked</Text>
            <Text style={styles.statValue}>{bookmarkedCount}</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>★ Rating</Text>
            <StarRow rating={rating} />
            <Text style={styles.statValue}>
              {rating.toFixed(1)} <Text style={styles.statSub}>({reviewCount} reviews)</Text>
            </Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Verification</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Unverified</Text>
            </View>
          </Card>
        </View>

        <Card>
          <Text style={styles.sectionTitle}>Ready to find your next engineer?</Text>
          <Text style={styles.summaryText}>
            Search and filter verified engineers by skill, rate, and availability.
          </Text>
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => navigation.navigate('BrowseEngineers')}
          >
            <Text style={styles.ctaBtnText}>Browse Engineers</Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
