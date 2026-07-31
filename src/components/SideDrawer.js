import React, { useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Pressable, Animated, Modal, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProfile } from '../context/ProfileContext';
import { colors } from '../theme';
import styles, { DRAWER_WIDTH } from '../styles/SideDrawer.styles';

const NAV_ITEMS = [
  { key: 'BrowseEngineers', label: 'Browse Engineers', icon: 'search-outline' },
  { key: 'BrowseJobs', label: 'Browse Jobs', icon: 'document-text-outline' },
  { key: 'Technologies', label: 'Technologies', icon: 'code-slash-outline' },
  { key: 'Pricing', label: 'Pricing', icon: 'pricetag-outline' },
  { key: 'Overview', label: 'Dashboard', icon: 'grid-outline' },
];

export default function SideDrawer({ visible, onClose, navigation, activeRoute = 'Overview', onDashboardPress }) {
  const { profile } = useProfile();
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
    if (item.key === 'Overview') {
      onDashboardPress?.();
      return;
    }
    navigation.navigate(item.key);
  };

  const handleViewProfile = () => {
    onClose();
    navigation.navigate('ViewProfile');
  };

  const handleLogout = () => {
    onClose();
    Alert.alert('Log out', 'This would log you out of your MyHourly account.');
  };

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
          {profile.photoUri ? (
            <Image source={{ uri: profile.photoUri }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{profile.name?.charAt(0) || 'S'}</Text>
            </View>
          )}
          <View>
            <Text style={styles.userName}>{profile.name}</Text>
            <Text style={styles.userRole}>Candidate</Text>
            <TouchableOpacity onPress={handleViewProfile}>
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
