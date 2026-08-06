import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, List, Switch, Divider } from 'react-native-paper';
import { useAppTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/useAuth';
import { colors, spacing } from '../../theme/theme';

export default function SettingsScreen({ navigation }) {
  const { isDark, toggleTheme } = useAppTheme();
  const { logout } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <List.Section>
        <List.Item
          title="Dark mode"
          left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
          right={() => <Switch value={isDark} onValueChange={toggleTheme} />}
        />
        <Divider />
        <List.Item title="About" left={(props) => <List.Icon {...props} icon="information-outline" />} onPress={() => navigation.navigate('About')} />
        <List.Item title="Support" left={(props) => <List.Icon {...props} icon="lifebuoy" />} onPress={() => navigation.navigate('Support')} />
        <List.Item title="Privacy Policy" left={(props) => <List.Icon {...props} icon="shield-lock-outline" />} onPress={() => navigation.navigate('Privacy')} />
        <List.Item title="Terms of Service" left={(props) => <List.Icon {...props} icon="file-document-outline" />} onPress={() => navigation.navigate('Terms')} />
        <Divider />
        <List.Item
          title="Log out"
          titleStyle={{ color: colors.error }}
          left={(props) => <List.Icon {...props} icon="logout" color={colors.error} />}
          onPress={logout}
        />
      </List.Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: colors.background } });
