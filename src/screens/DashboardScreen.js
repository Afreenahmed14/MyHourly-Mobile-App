import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Modal, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Card from '../components/Card';
import SideDrawer from '../components/SideDrawer';
import { useProfile } from '../context/ProfileContext';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';
import styles from '../styles/DashboardScreen.styles';

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

export default function DashboardScreen({ navigation }) {
  const { profile, updateProfile, isComplete } = useProfile();
  const { isLoggedIn, role, logout } = useAuth();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [chargeModalVisible, setChargeModalVisible] = useState(false);
  const [chargeInput, setChargeInput] = useState('');

  const handleDashboardPress = () => {
    if (!profile.chargePerHour) {
      setChargeModalVisible(true);
    }
  };

  const handleSaveCharge = () => {
    if (chargeInput.trim()) {
      updateProfile({ chargePerHour: chargeInput.trim() });
    }
    setChargeModalVisible(false);
  };

  const handleSkipCharge = () => {
    setChargeModalVisible(false);
  };

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

      <SideDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        navigation={navigation}
        activeRoute="Overview"
        onDashboardPress={handleDashboardPress}
      />

      <View style={styles.headerRow}>
        <Text style={styles.title}>Welcome Back</Text>
        <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('EditProfile')}>
          <Ionicons name="create-outline" size={16} color={colors.white} />
          <Text style={styles.editBtnText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.authStatusRow}
        onPress={() => (isLoggedIn ? logout() : navigation.navigate('LoginRole'))}
      >
        <Ionicons
          name={isLoggedIn ? 'checkmark-circle' : 'log-in-outline'}
          size={14}
          color={isLoggedIn ? colors.success : colors.textMuted}
        />
        <Text style={styles.authStatusText}>
          {isLoggedIn ? `Logged in as ${role === 'company' ? 'a company' : 'an engineer'} · Log out` : 'Not logged in · Log in'}
        </Text>
      </TouchableOpacity>

      {!isComplete && (
        <View style={styles.alert}>
          <Text style={styles.alertText}>
            <Text style={{ fontWeight: '700' }}>Your profile is incomplete. </Text>
            Complete your headline, about, and skills so companies can find you in search.
          </Text>
        </View>
      )}

      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <Text style={styles.statLabel}>₹ Your Charges Per Hour</Text>
          <Text style={styles.statValue}>₹{profile.chargePerHour || 0}</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statLabel}>★ Rating</Text>
          <StarRow rating={profile.rating} />
          <Text style={styles.statValue}>
            {profile.rating.toFixed(1)} <Text style={styles.statSub}>({profile.reviewCount} reviews)</Text>
          </Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statLabel}>👁 Visibility</Text>
          <Text style={styles.statValue}>{profile.visibility.startsWith('Public') ? 'Public' : 'Private'}</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statLabel}>Verification</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>unverified</Text>
          </View>
        </Card>
      </View>

      <Card>
        <Text style={styles.sectionTitle}>Profile Summary</Text>
        <Text style={styles.summaryText}>
          {profile.headline ? profile.headline : 'No headline yet — add one so companies know what you do.'}
        </Text>
      </Card>

      <TouchableOpacity style={styles.viewProfileBtn} onPress={() => navigation.navigate('ViewProfile')}>
        <Text style={styles.viewProfileText}>View Public Profile</Text>
        <Ionicons name="arrow-forward" size={16} color={colors.primary} />
      </TouchableOpacity>
      </ScrollView>

      <Modal visible={chargeModalVisible} transparent animationType="fade" onRequestClose={handleSkipCharge}>
        <View style={styles.modalBackdrop}>
          <Pressable style={styles.modalBackdropPress} onPress={handleSkipCharge} />
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Set your charges per hour</Text>
              <TouchableOpacity onPress={handleSkipCharge}>
                <Ionicons name="close" size={22} color={colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalBody}>
              You signed up without setting an your charges per hour. This is the rate companies will pay you once
              they hire you on an hourly pass, so let's get it set before you show up in search.
            </Text>

            <Text style={styles.modalLabel}>your charges per hour (₹)</Text>
            <TextInput
              style={styles.modalInput}
              value={chargeInput}
              onChangeText={setChargeInput}
              keyboardType="numeric"
              placeholder="e.g. 500"
              placeholderTextColor={colors.textMuted}
            />

            <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSaveCharge}>
              <Text style={styles.modalSaveBtnText}>Save & Continue</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSkipCharge}>
              <Text style={styles.modalSkipText}>I'll do this later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
