import React, { useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Pressable, Animated, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCompanyProfile } from '../context/CompanyProfileContext';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';
import styles, { DRAWER_WIDTH } from '../styles/SideDrawer.styles';

const NAV_ITEMS = [
  { key: 'CompanyDashboard', label: 'Overview', icon: 'grid-outline' },
  { key: 'BrowseEngineers', label: 'Browse Engineers', icon: 'search-outline' },
  { key: 'MyJobs', label: 'My Jobs', icon: 'briefcase-outline' },
  { key: 'CompanyProfile', label: 'Company Profile', icon: 'business-outline' },
  { key: 'Subscription', label: 'Subscription', icon: 'card-outline' },
  { key: 'Bookmarked', label: 'Bookmarked', icon: 'bookmark-outline' },
  { key: 'HiredCandidates', label: 'Hired Candidates', icon: 'checkmark-done-outline' },
  { key: 'Notifications', label: 'Notifications', icon: 'notifications-outline' },
];

export default function CompanySideDrawer({ visible, onClose, navigation, activeRoute = 'CompanyDashboard' }) {
  const { companyProfile } = useCompanyProfile();
  const { logout } = useAuth();
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: visible ? 0 : -DRAWER_WIDTH,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: visible ? 1 : 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible]);

  const goTo = (item) => {
    onClose();
    navigation.navigate(item.key);
  };

  const handleLogout = () => {
    onClose();
    logout();
    navigation.popToTop();
  };

  const initials = companyProfile.companyName ? companyProfile.companyName.slice(0, 2).toUpperCase() : 'CO';

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      <Animated.View style={[styles.panel, { transform: [{ translateX }] }]}>
        <View style={styles.headerRow}>
          <Image
            source={require('../../assets/brand/logo-icon.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.userRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View>
            <Text style={styles.userName}>{companyProfile.companyName || 'Your Company'}</Text>
            <Text style={styles.userRole}>Company</Text>
            <TouchableOpacity onPress={() => goTo({ key: 'CompanyProfile' })}>
              <Text style={styles.viewProfileLink}>View Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider} />

        <ScrollView style={styles.navList}>
          {NAV_ITEMS.map((item) => {
            const isActive = item.key === activeRoute;
            return (
              <TouchableOpacity
                key={item.key}
                style={[styles.navItem, isActive && styles.navItemActive]}
                onPress={() => goTo(item)}
              >
                <Ionicons name={item.icon} size={18} color={isActive ? colors.white : colors.text} />
                <Text style={[styles.navItemText, isActive && styles.navItemTextActive]}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.navItem} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={18} color={colors.danger} />
            <Text style={[styles.navItemText, styles.logoutText]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
}
