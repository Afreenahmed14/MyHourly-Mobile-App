import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCompanyProfile } from '../context/CompanyProfileContext';
import { INDUSTRIES, COUNTRIES } from '../data/options';
import { colors } from '../theme';
import styles from '../styles/CompanyProfileScreen.styles';

function PickerSheet({ visible, title, options, selected, onSelect, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.sheetOverlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView>
            {options.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={styles.optionRow}
                onPress={() => {
                  onSelect(opt);
                  onClose();
                }}
              >
                <Text style={styles.optionText}>
                  {opt} {selected === opt ? '✓' : ''}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default function CompanyProfileScreen({ navigation }) {
  const { companyProfile, updateCompanyProfile } = useCompanyProfile();
  const [form, setForm] = useState(companyProfile);
  const [industrySheetVisible, setIndustrySheetVisible] = useState(false);
  const [countrySheetVisible, setCountrySheetVisible] = useState(false);

  const set = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    updateCompanyProfile(form);
    Alert.alert('Saved', 'Your company profile has been updated.');
  };

  const initials = form.companyName ? form.companyName.slice(0, 2).toUpperCase() : 'XY';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Company Profile</Text>

      <View style={styles.logoRow}>
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>{initials}</Text>
        </View>
        <TouchableOpacity
          style={styles.changeLogoBtn}
          onPress={() => Alert.alert('Change Logo', 'This would open an image picker later.')}
        >
          <Ionicons name="cloud-upload-outline" size={16} color={colors.text} />
          <Text style={styles.changeLogoText}>Change Logo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Company Name</Text>
        <TextInput
          style={styles.input}
          value={form.companyName}
          onChangeText={set('companyName')}
          placeholder="e.g. xyz"
          placeholderTextColor={colors.textMuted}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Website</Text>
        <TextInput
          style={styles.input}
          value={form.website}
          onChangeText={set('website')}
          placeholder="https://..."
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          keyboardType="url"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Industry</Text>
        <TouchableOpacity style={styles.selectRow} onPress={() => setIndustrySheetVisible(true)}>
          <Text style={[styles.selectText, !form.industry && styles.selectPlaceholder]}>
            {form.industry || 'Select an industry...'}
          </Text>
          <Ionicons name="chevron-down" size={16} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={form.description}
          onChangeText={set('description')}
          placeholder="Tell engineers about your company..."
          placeholderTextColor={colors.textMuted}
          multiline
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>GST Number</Text>
        <TextInput
          style={styles.input}
          value={form.gstNumber}
          onChangeText={set('gstNumber')}
          placeholder="e.g. 29ABCDE1234F1Z5"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="characters"
        />
      </View>

      <View style={styles.fieldRow}>
        <View style={styles.fieldHalf}>
          <Text style={styles.label}>Contact Person Name</Text>
          <TextInput
            style={styles.input}
            value={form.contactPersonName}
            onChangeText={set('contactPersonName')}
            placeholder="Full name"
            placeholderTextColor={colors.textMuted}
          />
        </View>
        <View style={styles.fieldHalf}>
          <Text style={styles.label}>Designation</Text>
          <TextInput
            style={styles.input}
            value={form.designation}
            onChangeText={set('designation')}
            placeholder="e.g. HR Manager"
            placeholderTextColor={colors.textMuted}
          />
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Contact Phone</Text>
        <TextInput
          style={styles.input}
          value={form.contactPhone}
          onChangeText={set('contactPhone')}
          placeholder="+91..."
          placeholderTextColor={colors.textMuted}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Company Phone Number</Text>
        <TextInput
          style={styles.input}
          value={form.companyPhoneNumber}
          onChangeText={set('companyPhoneNumber')}
          placeholder="+91..."
          placeholderTextColor={colors.textMuted}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Country</Text>
        <TouchableOpacity style={styles.selectRow} onPress={() => setCountrySheetVisible(true)}>
          <Text style={[styles.selectText, !form.country && styles.selectPlaceholder]}>
            {form.country || 'Select a country...'}
          </Text>
          <Ionicons name="chevron-down" size={16} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>Save Changes</Text>
      </TouchableOpacity>

      <PickerSheet
        visible={industrySheetVisible}
        title="Select Industry"
        options={INDUSTRIES}
        selected={form.industry}
        onSelect={set('industry')}
        onClose={() => setIndustrySheetVisible(false)}
      />
      <PickerSheet
        visible={countrySheetVisible}
        title="Select Country"
        options={COUNTRIES}
        selected={form.country}
        onSelect={set('country')}
        onClose={() => setCountrySheetVisible(false)}
      />
    </ScrollView>
  );
}
