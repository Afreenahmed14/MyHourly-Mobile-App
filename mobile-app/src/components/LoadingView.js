import { View, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { colors } from '../theme/theme';

export default function LoadingView() {
  return (
    <View style={styles.container}>
      <ActivityIndicator animating size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
});
