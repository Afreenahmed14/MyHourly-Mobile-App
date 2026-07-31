import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import styles from '../styles/HomeScreen.styles';

const STEPS = [
  {
    icon: 'search-outline',
    title: 'Search Engineers',
    desc: 'Filter by skill, rate, availability, location and more to find the right fit.',
  },
  {
    icon: 'eye-outline',
    title: 'View Profile',
    desc: 'Review portfolio, experience, ratings, and verified credentials.',
  },
  {
    icon: 'card-outline',
    title: 'Pay Platform',
    desc: 'A single, transparent unlock fee — no subscriptions, no hidden costs.',
  },
  {
    icon: 'call-outline',
    title: 'Contact Directly',
    desc: 'Get verified contact details instantly and take the conversation outside the platform.',
  },
];

const SKILL_ICONS = ['logo-react', 'logo-nodejs', 'logo-python', 'server-outline', 'cloud-outline', 'code-slash-outline'];

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.brandBar}>
          <View style={styles.brandLogoRow}>
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
          <TouchableOpacity onPress={() => navigation.navigate('LoginRole')}>
            <Text style={styles.loginLink}>Log In</Text>
          </TouchableOpacity>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={12} color={colors.success} />
            <Text style={styles.verifiedBadgeText}>Verified</Text>
          </View>

          <Text style={styles.heroTitle}>
            Hire Skilled Engineers{'\n'}
            <Text style={styles.heroTitleAccent}>On Hourly Basis</Text>
          </Text>

          <Text style={styles.heroSubtitle}>
            Search verified engineers, view their profiles, and unlock contact details instantly. No middlemen,
            no project management — just direct access.
          </Text>

          <View style={styles.heroBtnRow}>
            <TouchableOpacity style={styles.heroPrimaryBtn} onPress={() => navigation.navigate('BrowseEngineers')}>
              <Text style={styles.heroPrimaryBtnText}>Browse Engineers</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.heroSecondaryBtn}
              onPress={() => navigation.navigate('Register', { role: 'engineer' })}
            >
              <Text style={styles.heroSecondaryBtnText}>Join as an Engineer</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats bar */}
        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <View style={styles.statCircle}>
              <Text style={styles.statNumber}>59+</Text>
            </View>
            <Text style={styles.statLabel}>Verified{'\n'}Engineers</Text>
          </View>
          <View style={styles.statItem}>
            <View style={styles.statCircle}>
              <Text style={styles.statNumber}>2+</Text>
            </View>
            <Text style={styles.statLabel}>Hiring{'\n'}Companies</Text>
          </View>
          <View style={styles.statItem}>
            <View style={styles.statCircle}>
              <Ionicons name="add" size={18} color={colors.white} />
            </View>
            <Text style={styles.statLabel}>Contacts{'\n'}Unlocked</Text>
          </View>
        </View>

        {/* How it works */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          {STEPS.map((step, i) => (
            <View key={step.title} style={styles.stepCard}>
              <View style={styles.stepIconWrap}>
                <Ionicons name={step.icon} size={18} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepNumber}>STEP {i + 1}</Text>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDesc}>{step.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Every skill, organized like a tree */}
        <View style={styles.skillsSection}>
          <View style={styles.skillsIconRow}>
            {SKILL_ICONS.map((icon) => (
              <View key={icon} style={styles.skillsIconWrap}>
                <Ionicons name={icon} size={15} color="rgba(255,255,255,0.85)" />
              </View>
            ))}
          </View>
          <Text style={styles.skillsTitle}>Every Skill, Organized Like a Tree</Text>
          <Text style={styles.skillsSubtitle}>
            From React to Kubernetes — explore our full technology tree and find engineers by exactly the stack
            you need.
          </Text>
          <TouchableOpacity style={styles.skillsLinkRow} onPress={() => navigation.navigate('BrowseEngineers')}>
            <Text style={styles.skillsLinkText}>Explore Technologies</Text>
            <Ionicons name="arrow-forward" size={14} color="#93C5FD" />
          </TouchableOpacity>
        </View>

        {/* Are you an engineer? */}
        <View style={styles.section}>
          <View style={styles.ctaCard}>
            <Text style={styles.ctaTitle}>Are you an engineer?</Text>
            <View style={styles.ctaBullet}>
              <Ionicons name="checkmark-circle" size={16} color={colors.success} />
              <Text style={styles.ctaBulletText}>No project management overhead — you own the engagement</Text>
            </View>
            <View style={styles.ctaBullet}>
              <Ionicons name="checkmark-circle" size={16} color={colors.success} />
              <Text style={styles.ctaBulletText}>Verified engineer profiles with ratings and reviews</Text>
            </View>
            <View style={styles.ctaBullet}>
              <Ionicons name="checkmark-circle" size={16} color={colors.success} />
              <Text style={styles.ctaBulletText}>Pay only for the contacts you actually unlock</Text>
            </View>
            <View style={styles.ctaBullet}>
              <Ionicons name="checkmark-circle" size={16} color={colors.success} />
              <Text style={styles.ctaBulletText}>Transparent, one-time pricing per unlock</Text>
            </View>
            <TouchableOpacity
              style={styles.ctaBtnOutline}
              onPress={() => navigation.navigate('Register', { role: 'engineer' })}
            >
              <Text style={styles.ctaBtnOutlineText}>Create Your Profile</Text>
            </TouchableOpacity>
          </View>

          {/* Are you hiring? */}
          <View style={styles.ctaCard}>
            <Text style={styles.ctaTitle}>Are you hiring?</Text>
            <Text style={{ fontSize: 13, color: colors.textMuted, lineHeight: 19, marginBottom: 4 }}>
              Browse verified engineer profiles, filter by exactly the skills you need, and unlock contact
              details the moment you find a fit.
            </Text>
            <TouchableOpacity style={styles.ctaBtn} onPress={() => navigation.navigate('BrowseEngineers')}>
              <Text style={styles.ctaBtnText}>Start Browsing</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
