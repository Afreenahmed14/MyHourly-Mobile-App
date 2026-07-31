import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import styles from '../styles/Auth.styles';

export default function LoginRoleScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>How would you like to log in?</Text>
      <Text style={styles.subheading}>Choose the account type that's yours.</Text>

      <TouchableOpacity style={styles.roleCard} onPress={() => navigation.navigate('LoginForm', { role: 'engineer' })}>
        <View style={styles.roleIconWrap}>
          <Ionicons name="person-outline" size={22} color={colors.success} />
        </View>
        <Text style={styles.roleTitle}>I'm an Engineer</Text>
        <Text style={styles.roleSubtitle}>Log in to manage your profile and track unlocks.</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.roleCard} onPress={() => navigation.navigate('LoginForm', { role: 'company' })}>
        <View style={styles.roleIconWrap}>
          <Ionicons name="briefcase-outline" size={22} color={colors.primary} />
        </View>
        <Text style={styles.roleTitle}>I'm a Company</Text>
        <Text style={styles.roleSubtitle}>Log in to search engineers and manage payments.</Text>
      </TouchableOpacity>

      <View style={styles.footerLinkRow}>
        <Text style={styles.footerText}>New to HourlyRecruit? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.footerLink}>Create an account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
