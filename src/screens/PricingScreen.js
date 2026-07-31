import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProfile } from '../context/ProfileContext';
import { colors } from '../theme';
import styles from '../styles/PricingScreen.styles';

const SECTIONS = [
  {
    key: 'candidate',
    title: 'Candidate',
    subtitle: 'Apply to jobs and get discovered by companies.',
    plans: [
      {
        name: 'Free',
        price: '₹0',
        period: '',
        features: ['Update your profile', 'Apply to 1 job per week', 'Receive 1 interview call every 2 weeks'],
        cta: 'Get Started Free',
      },
      {
        name: 'Monthly',
        price: '₹499',
        period: '/month',
        features: ['Unlimited profile edits', 'Apply to 5–6 jobs every 3 days', 'Receive 5–6 interview calls per week'],
        cta: 'Get Monthly',
      },
      {
        name: 'Yearly',
        price: '₹4999',
        period: '/year',
        features: [
          'Unlimited profile edits',
          'Unlimited job applications',
          'Receive 15–20 interview calls every 5 days',
          'Priority support',
        ],
        cta: 'Get Yearly',
        bestValue: true,
      },
    ],
  },
  {
    key: 'candidatePartners',
    title: 'Candidate + Project Partners',
    subtitle: 'Everything in Candidate, plus find partners for your own projects.',
    plans: [
      {
        name: 'Monthly',
        price: '₹799',
        period: '/month',
        features: [
          'Unlimited profile edits',
          'Apply to 5–6 jobs every 3 days',
          'Receive 5–6 interview calls per week',
          'Find up to 3 project partners per week',
        ],
        cta: 'Get Monthly',
      },
      {
        name: 'Yearly',
        price: '₹7999',
        period: '/year',
        features: [
          'Unlimited profile edits',
          'Unlimited job applications',
          'Receive 15–20 interview calls every 5 days',
          'Unlimited project partner matching',
          'Priority support',
        ],
        cta: 'Get Yearly',
        bestValue: true,
      },
    ],
  },
  {
    key: 'company',
    title: 'Company',
    subtitle: 'Post jobs and hire candidates.',
    plans: [
      {
        name: 'Free',
        price: '₹0',
        period: '',
        features: ['Post up to 3 jobs every 2 weeks', 'Browse engineer name, about & skills', 'Upgrade to view full profiles and hire'],
        cta: 'Get Started Free',
      },
      {
        name: 'Monthly',
        price: '₹1999',
        period: '/month',
        features: ['Post up to 10 jobs per week', 'Hire up to 20 candidates per week'],
        cta: 'Get Monthly',
      },
      {
        name: 'Yearly',
        price: '₹12999',
        period: '/year',
        features: ['Unlimited job posts', 'Unlimited hiring', 'Priority support'],
        cta: 'Get Yearly',
        bestValue: true,
      },
    ],
  },
];

// Tabs available inside the "Choose your plan" picker (matches the web reference — Company isn't tabbed there)
const PICKER_TABS = SECTIONS.filter((s) => s.key !== 'company');

function PlanCard({ plan, isCurrent, onPress }) {
  return (
    <View style={[styles.planCard, plan.bestValue && styles.planCardBest]}>
      {plan.bestValue && (
        <View style={styles.bestBadge}>
          <Text style={styles.bestBadgeText}>BEST VALUE</Text>
        </View>
      )}

      <Text style={styles.planName}>{plan.name}</Text>
      <View style={styles.priceRow}>
        <Text style={styles.price}>{plan.price}</Text>
        {plan.period ? <Text style={styles.period}>{plan.period}</Text> : null}
      </View>

      <View style={styles.featureList}>
        {plan.features.map((f) => (
          <View key={f} style={styles.featureRow}>
            <Ionicons name="checkmark" size={14} color={colors.success} style={styles.featureIcon} />
            <Text style={styles.featureText}>{f}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.ctaBtn, plan.bestValue && !isCurrent && styles.ctaBtnBest, isCurrent && styles.ctaBtnCurrent]}
        onPress={onPress}
        disabled={isCurrent}
      >
        <Text
          style={[
            styles.ctaBtnText,
            plan.bestValue && !isCurrent && styles.ctaBtnTextBest,
            isCurrent && styles.ctaBtnTextCurrent,
          ]}
        >
          {isCurrent ? 'Current Plan' : plan.cta}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function PlanPickerModal({ visible, initialTab, onClose }) {
  const { profile, updateProfile } = useProfile();
  const [activeTab, setActiveTab] = useState(initialTab || 'candidate');

  const section = PICKER_TABS.find((s) => s.key === activeTab) || PICKER_TABS[0];

  const handleSelectPlan = (plan) => {
    updateProfile({ plan: plan.name });
    onClose();
    Alert.alert('Plan updated', `You're now on the "${plan.name}" plan.`);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.pickerBackdrop}>
        <Pressable style={styles.pickerBackdropPress} onPress={onClose} />
        <View style={styles.pickerCard}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.pickerHeaderRow}>
              <Text style={styles.pickerTitle}>Choose your plan</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={22} color={colors.text} />
              </TouchableOpacity>
            </View>
            <Text style={styles.pickerSubtitle}>Pick a plan to apply for more jobs and get more interview calls.</Text>

            <View style={styles.pickerTabRow}>
              {PICKER_TABS.map((tab) => (
                <TouchableOpacity key={tab.key} onPress={() => setActiveTab(tab.key)} style={styles.pickerTabBtn}>
                  <Text style={[styles.pickerTabText, activeTab === tab.key && styles.pickerTabTextActive]}>
                    {tab.title}
                  </Text>
                  {activeTab === tab.key && <View style={styles.pickerTabUnderline} />}
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.pickerSectionSubtitle}>{section.subtitle}</Text>

            <View style={styles.planStack}>
              {section.plans.map((plan) => (
                <PlanCard
                  key={plan.name}
                  plan={plan}
                  isCurrent={profile.plan === plan.name}
                  onPress={() => handleSelectPlan(plan)}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default function PricingScreen() {
  const { profile } = useProfile();
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerTab, setPickerTab] = useState('candidate');

  const openPicker = (sectionKey) => {
    setPickerTab(sectionKey);
    setPickerVisible(true);
  };

  const handleCompanyPress = (plan) => {
    Alert.alert(plan.cta, `This would start the "${plan.name}" plan.`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>Simple, transparent pricing</Text>
      <Text style={styles.pageSubtitle}>
        Fill your profile for free. Upgrade any time to apply for more jobs, get more interview calls, find project
        partners, or post and hire more as a company.
      </Text>

      {SECTIONS.map((section) => (
        <View key={section.key} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={styles.sectionSubtitle}>{section.subtitle}</Text>

          <View style={styles.planStack}>
            {section.plans.map((plan) => {
              const isFreeCandidatePlan = plan.name === 'Free' && section.key !== 'company';
              return (
                <PlanCard
                  key={plan.name}
                  plan={plan}
                  isCurrent={isFreeCandidatePlan && profile.plan === 'Free'}
                  onPress={() => {
                    if (isFreeCandidatePlan) return; // Free tier is the default — nothing to choose
                    return section.key === 'company' ? handleCompanyPress(plan) : openPicker(section.key);
                  }}
                />
              );
            })}
          </View>
        </View>
      ))}

      {/* key forces the modal to re-init its active tab whenever a different section's CTA is tapped */}
      <PlanPickerModal key={pickerTab} visible={pickerVisible} initialTab={pickerTab} onClose={() => setPickerVisible(false)} />
    </ScrollView>
  );
}
