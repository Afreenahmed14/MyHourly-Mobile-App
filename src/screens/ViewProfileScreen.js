import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../components/Card';
import { useProfile } from '../context/ProfileContext';
import { colors } from '../theme';
import styles from '../styles/ViewProfileScreen.styles';

function Stars({ rating }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Ionicons key={i} name={i <= Math.round(rating) ? 'star' : 'star-outline'} size={16} color={colors.star} />
    );
  }
  return <View style={{ flexDirection: 'row' }}>{stars}</View>;
}

export default function ViewProfileScreen({ route }) {
  const { profile } = useProfile();
  const engineer = route?.params?.engineer;

  // Normalize both "my own profile" and "a browsed engineer" into one shape.
  const display = engineer
    ? {
        name: engineer.name,
        subtitle: engineer.role,
        location: engineer.location,
        photoUri: null,
        about: `${engineer.role} based in ${engineer.location}.`,
        skills: engineer.skills,
        rate: engineer.rate,
        rating: engineer.rating,
        reviewCount: engineer.reviews,
      }
    : {
        name: profile.name,
        subtitle: null,
        location: null,
        photoUri: profile.photoUri,
        about: profile.about || 'No bio provided yet.',
        skills: [...profile.primarySkills, ...profile.secondarySkills],
        rate: profile.chargePerHour || 0,
        rating: profile.rating,
        reviewCount: profile.reviewCount,
      };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.headerCard}>
        <View style={styles.headerRow}>
          {display.photoUri ? (
            <Image source={{ uri: display.photoUri }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{display.name?.charAt(0) || 'S'}</Text>
            </View>
          )}
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.name}>{display.name}</Text>
            {display.subtitle ? <Text style={styles.bodyText}>{display.subtitle}</Text> : null}
            <View style={styles.ratingRow}>
              <Stars rating={display.rating} />
              <Text style={styles.ratingText}>
                {'  '}
                {display.rating.toFixed(1)} ({display.reviewCount} reviews)
              </Text>
            </View>
          </View>
          <View style={styles.rateBox}>
            <Text style={styles.rateValue}>₹{display.rate}</Text>
            <Text style={styles.rateUnit}>/hour</Text>
          </View>
        </View>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.bodyText}>{display.about}</Text>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Skills</Text>
        {display.skills.length === 0 ? (
          <Text style={styles.bodyText}>No skills added yet.</Text>
        ) : (
          <View style={styles.skillsWrap}>
            {display.skills.map((skill) => (
              <View key={skill} style={styles.skillChip}>
                <Text style={styles.skillChipText}>{skill}</Text>
              </View>
            ))}
          </View>
        )}
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Reviews ({display.reviewCount})</Text>
        <Text style={styles.bodyText}>{display.reviewCount === 0 ? 'No reviews yet.' : ''}</Text>
      </Card>
    </ScrollView>
  );
}
