import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PricingCard from './PricingCard';
import { PRICING_SECTIONS } from '../data/pricingPlans';
import { colors } from '../theme';
import styles from '../styles/ChoosePlanModal.styles';

// Sections that make sense to switch between in this modal (Company plans open payment directly).
const TABBABLE_KEYS = ['candidate', 'candidate-partners'];

export default function ChoosePlanModal({ visible, initialSectionKey, onClose, onChoosePlan }) {
  const [activeKey, setActiveKey] = useState(initialSectionKey || 'candidate');

  const tabs = PRICING_SECTIONS.filter((s) => TABBABLE_KEYS.includes(s.key));
  const activeSection = PRICING_SECTIONS.find((s) => s.key === activeKey) || tabs[0];

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>Choose your plan</Text>
              <Text style={styles.headerSubtitle}>Pick a plan to apply for more jobs and get more interview calls.</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {tabs.length > 1 && (
            <View style={styles.tabRow}>
              {tabs.map((tab) => {
                const active = tab.key === activeSection.key;
                return (
                  <TouchableOpacity
                    key={tab.key}
                    style={[styles.tabBtn, active && styles.tabBtnActive]}
                    onPress={() => setActiveKey(tab.key)}
                  >
                    <Text style={[styles.tabText, active && styles.tabTextActive]}>{tab.title}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          <Text style={styles.sectionSubtitle}>{activeSection.subtitle}</Text>

          <ScrollView contentContainerStyle={styles.scrollBody}>
            {activeSection.plans.map((plan) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                compact
                current={plan.label === 'Free'}
                onSelect={onChoosePlan}
              />
            ))}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
