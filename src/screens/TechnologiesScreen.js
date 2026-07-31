import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import styles from '../styles/TechnologiesScreen.styles';

const GROUPS = [
  {
    title: 'Frontend',
    icon: 'phone-portrait-outline',
    skills: ['React', 'Next.js', 'TypeScript', 'Redux', 'Tailwind CSS'],
  },
  {
    title: 'Backend',
    icon: 'server-outline',
    skills: ['Node.js', 'Express', 'Python', 'Django', 'Java', 'Spring Boot'],
  },
  {
    title: 'Mobile',
    icon: 'phone-portrait-outline',
    skills: ['React Native', 'Flutter'],
  },
  {
    title: 'Data & Databases',
    icon: 'server-outline',
    skills: ['MongoDB', 'PostgreSQL', 'GraphQL'],
  },
  {
    title: 'Cloud & DevOps',
    icon: 'cloud-outline',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Firebase'],
  },
];

export default function TechnologiesScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>Technologies</Text>
      <Text style={styles.pageSubtitle}>
        Engineers on MyHourly work across these stacks — filter by any of these when you browse engineers or post a
        job.
      </Text>

      {GROUPS.map((group) => (
        <View key={group.title} style={styles.groupCard}>
          <View style={styles.groupHeaderRow}>
            <Ionicons name={group.icon} size={16} color={colors.primary} />
            <Text style={styles.groupTitle}>{group.title}</Text>
          </View>
          <View style={styles.chipRow}>
            {group.skills.map((skill) => (
              <View key={skill} style={styles.chip}>
                <Text style={styles.chipText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
