import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import styles from '../styles/PricingCard.styles';

export default function PricingCard({ plan, onSelect, current, compact }) {
  const highlight = Boolean(plan.highlight);

  return (
    <View style={[styles.card, highlight && styles.cardHighlight, current && styles.cardCurrent, compact && styles.cardCompact]}>
      <View style={styles.topRow}>
        <Text style={styles.label}>{plan.label}</Text>
        {highlight && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>BEST VALUE</Text>
          </View>
        )}
      </View>

      <View style={styles.priceRow}>
        <Text style={[styles.price, compact && styles.priceCompact]}>{plan.price}</Text>
        {plan.period ? <Text style={styles.period}>{plan.period}</Text> : null}
      </View>

      {plan.features.map((feature) => (
        <View key={feature} style={styles.featureRow}>
          <Ionicons name="checkmark" size={16} color={colors.success} />
          <Text style={styles.featureText}>{feature}</Text>
        </View>
      ))}

      <TouchableOpacity
        style={[styles.ctaBtn, highlight && !current && styles.ctaBtnHighlight, current && styles.ctaBtnCurrent]}
        onPress={() => !current && onSelect(plan)}
        disabled={current}
      >
        <Text
          style={[
            styles.ctaBtnText,
            highlight && !current && styles.ctaBtnTextHighlight,
            current && styles.ctaBtnTextCurrent,
          ]}
        >
          {current ? 'Current Plan' : plan.cta}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
