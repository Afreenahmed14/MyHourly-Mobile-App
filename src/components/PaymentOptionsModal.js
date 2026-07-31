import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import styles from '../styles/PaymentOptionsModal.styles';

const METHODS = [
  { key: 'UPI', label: 'UPI', icon: 'qr-code-outline' },
  { key: 'Cards', label: 'Cards', icon: 'card-outline' },
  { key: 'EMI', label: 'EMI', icon: 'calendar-outline' },
  { key: 'Netbanking', label: 'Netbanking', icon: 'business-outline' },
  { key: 'Wallet', label: 'Wallet', icon: 'wallet-outline' },
  { key: 'PayLater', label: 'Pay Later', icon: 'time-outline' },
];

const SUGGESTED_BANKS = [
  { name: 'State Bank of India' },
  { name: 'HDFC Bank' },
  { name: 'ICICI Bank' },
  { name: 'Axis Bank' },
  { name: 'Bank of Baroda \u2013 Retail Banking', subtitle: 'For individuals' },
];
const ALL_BANKS = [{ name: 'Airtel Payments Bank' }, { name: 'Kotak Mahindra Bank' }, { name: 'Yes Bank' }];
const WALLET_OPTIONS = [
  { name: 'Mobikwik' },
  { name: 'Airtel Payments Bank' },
  { name: 'Ola Money (Postpaid + Wallet)' },
  { name: 'PayZapp' },
];
const PAY_LATER_OPTIONS = [
  { name: 'LazyPay' },
  { name: 'ICICI' },
  { name: 'ePayLater' },
  { name: 'Kotak Mahindra Bank' },
  { name: 'Amazon Pay Later' },
  { name: 'RazorpayX Postpaid' },
];

function OptionListRow({ item, onPress }) {
  return (
    <TouchableOpacity style={styles.optionRow} onPress={onPress}>
      <View style={styles.optionIcon}>
        <Ionicons name="business" size={14} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.optionLabel}>{item.name}</Text>
        {item.subtitle ? <Text style={styles.optionSubLabel}>{item.subtitle}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

export default function PaymentOptionsModal({ visible, plan, phone = '+91 89703 48708', onClose, onPaymentSuccess }) {
  const [method, setMethod] = useState('UPI');
  const [exitConfirmVisible, setExitConfirmVisible] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(false);

  if (!plan) return null;

  const handlePaymentSuccess = (methodLabel) => {
    Alert.alert('Payment successful', `You're now on the ${plan.label} plan (${plan.price}${plan.period}) \u2014 paid via ${methodLabel}.`, [
      { text: 'OK', onPress: () => onPaymentSuccess(plan) },
    ]);
  };

  const renderMethodContent = () => {
    switch (method) {
      case 'UPI':
        return (
          <View>
            <Text style={styles.methodTitle}>UPI QR</Text>
            <TouchableOpacity style={styles.qrBox} onPress={() => handlePaymentSuccess('UPI')}>
              <Ionicons name="qr-code" size={64} color={colors.textMuted} />
            </TouchableOpacity>
            <Text style={styles.qrHelperText}>Scan the QR code using any UPI app, or tap it to simulate payment.</Text>
          </View>
        );
      case 'Cards':
        return (
          <View>
            <Text style={styles.methodTitle}>Add a new card</Text>
            <TextInput
              style={styles.input}
              placeholder="Card Number"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
              value={cardNumber}
              onChangeText={setCardNumber}
            />
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, styles.inputHalf]}
                placeholder="MM / YY"
                placeholderTextColor={colors.textMuted}
                value={expiry}
                onChangeText={setExpiry}
              />
              <TextInput
                style={[styles.input, styles.inputHalf, { marginRight: 0 }]}
                placeholder="CVV"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                secureTextEntry
                value={cvv}
                onChangeText={setCvv}
              />
            </View>
            <TouchableOpacity style={styles.checkboxRow} onPress={() => setSaveCard((s) => !s)}>
              <Ionicons
                name={saveCard ? 'checkbox' : 'square-outline'}
                size={18}
                color={saveCard ? colors.primary : colors.textMuted}
              />
              <Text style={styles.checkboxText}>Save this card as per RBI guidelines</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.continueBtn} onPress={() => handlePaymentSuccess('Card')}>
              <Text style={styles.continueBtnText}>Continue</Text>
            </TouchableOpacity>
          </View>
        );
      case 'EMI':
        return (
          <View>
            <Text style={styles.methodTitle}>All Options</Text>
            <OptionListRow item={{ name: 'Cardless and Others' }} onPress={() => handlePaymentSuccess('EMI')} />
          </View>
        );
      case 'Netbanking':
        return (
          <View>
            <View style={styles.searchBox}>
              <Ionicons name="search" size={16} color={colors.textMuted} />
              <TextInput style={styles.searchInput} placeholder="Search for Banks" placeholderTextColor={colors.textMuted} />
            </View>
            <Text style={styles.listGroupLabel}>SUGGESTED BANKS</Text>
            {SUGGESTED_BANKS.map((bank) => (
              <OptionListRow key={bank.name} item={bank} onPress={() => handlePaymentSuccess(bank.name)} />
            ))}
            <Text style={styles.listGroupLabel}>ALL BANKS</Text>
            {ALL_BANKS.map((bank) => (
              <OptionListRow key={bank.name} item={bank} onPress={() => handlePaymentSuccess(bank.name)} />
            ))}
          </View>
        );
      case 'Wallet':
        return (
          <View>
            <Text style={styles.methodTitle}>All Wallet Options</Text>
            {WALLET_OPTIONS.map((w) => (
              <OptionListRow key={w.name} item={w} onPress={() => handlePaymentSuccess(w.name)} />
            ))}
          </View>
        );
      case 'PayLater':
        return (
          <View>
            <Text style={styles.methodTitle}>Pay Later</Text>
            {PAY_LATER_OPTIONS.map((p) => (
              <OptionListRow key={p.name} item={p} onPress={() => handlePaymentSuccess(p.name)} />
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={() => setExitConfirmVisible(true)}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.topBar}>
            <View style={styles.brandRow}>
              <View style={styles.brandBadge}>
                <Text style={styles.brandBadgeText}>H</Text>
              </View>
              <Text style={styles.brandName}>HourlyRecruit</Text>
            </View>
            <View style={styles.topBarRight}>
              <Text style={{ color: colors.textMuted, fontSize: 16 }}>Payment Options</Text>
              <TouchableOpacity style={styles.topBarIconBtn} onPress={() => setExitConfirmVisible(true)}>
                <Ionicons name="close" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.priceSummary}>
            <Text style={styles.priceSummaryLabel}>PRICE SUMMARY</Text>
            <Text style={styles.priceSummaryAmount}>{plan.price}</Text>
            <View style={styles.usingAsRow}>
              <Ionicons name="person-circle-outline" size={16} color={colors.white} />
              <Text style={styles.usingAsText}>Using as {phone}</Text>
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.methodTabsRow}>
            {METHODS.map((m) => {
              const active = m.key === method;
              return (
                <TouchableOpacity
                  key={m.key}
                  style={[styles.methodTab, active && styles.methodTabActive]}
                  onPress={() => setMethod(m.key)}
                >
                  <Text style={[styles.methodTabText, active && styles.methodTabTextActive]}>{m.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <ScrollView style={{ maxHeight: 380 }}>
            <View style={styles.methodContent}>{renderMethodContent()}</View>
          </ScrollView>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Secured by Razorpay (mock)</Text>
          </View>
        </View>

        {exitConfirmVisible && (
          <View style={styles.exitBackdrop}>
            <View style={styles.exitCard}>
              <View style={styles.exitIconWrap}>
                <Ionicons name="log-out-outline" size={26} color={colors.primary} />
              </View>
              <Text style={styles.exitTitle}>Are you sure you want to exit?</Text>
              <Text style={styles.exitSubtitle}>You will be taken back to the HourlyRecruit app.</Text>
              <TouchableOpacity style={styles.exitContinueBtn} onPress={() => setExitConfirmVisible(false)}>
                <Text style={styles.exitContinueBtnText}>Continue to payment</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.exitConfirmBtn}
                onPress={() => {
                  setExitConfirmVisible(false);
                  onClose();
                }}
              >
                <Text style={styles.exitConfirmBtnText}>Yes, exit</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}
