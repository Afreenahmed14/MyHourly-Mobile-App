import { View, StyleSheet } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { spacing } from '../theme/theme';

/**
 * Candidate / Company toggle used on Login and Register screens.
 * Admin is intentionally excluded — the web app has no public admin
 * registration and admin login isn't a self-serve mobile flow.
 */
export default function RoleToggle({ role, onChange }) {
  return (
    <View style={styles.wrap}>
      <SegmentedButtons
        value={role}
        onValueChange={onChange}
        buttons={[
          { value: 'candidate', label: 'Candidate' },
          { value: 'company', label: 'Company' },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.lg },
});
