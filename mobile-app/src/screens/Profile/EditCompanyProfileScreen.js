import { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, HelperText, Avatar, IconButton } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import { companyApi } from '../../api/companyApi';
import { colors, spacing } from '../../theme/theme';

/** Editable fields mirror backend companyController.js updateMyProfile allowedFields. */
export default function EditCompanyProfileScreen({ route, navigation }) {
  const { company } = route.params;
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [logo, setLogo] = useState(company.logo || null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      companyName: company.companyName || '',
      website: company.website || '',
      industry: company.industry || '',
      description: company.description || '',
      contactPerson: company.contactPerson || '',
    },
  });

  const pickLogo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (result.canceled) return;

    const asset = result.assets[0];
    const formData = new FormData();
    formData.append('logo', { uri: asset.uri, name: 'logo.jpg', type: 'image/jpeg' });

    setUploadingLogo(true);
    try {
      await companyApi.uploadLogo(formData);
      setLogo(asset.uri);
    } finally {
      setUploadingLogo(false);
    }
  };

  const onSubmit = async (values) => {
    setError('');
    setSubmitting(true);
    try {
      await companyApi.updateMyProfile(values);
      navigation.goBack();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.lg }}>
      <Text variant="headlineSmall" style={styles.title}>Edit company profile</Text>

      <View style={styles.avatarBlock}>
        <View>
          <Avatar.Image
            size={88}
            source={logo ? { uri: logo } : require('../../../assets/icon.png')}
          />
          <IconButton
            icon="camera"
            size={18}
            mode="contained"
            containerColor={colors.primary}
            iconColor="#fff"
            style={styles.cameraBtn}
            onPress={pickLogo}
            disabled={uploadingLogo}
          />
        </View>
      </View>

      {[
        ['companyName', 'Company name'],
        ['website', 'Website'],
        ['industry', 'Industry'],
        ['contactPerson', 'Contact person'],
      ].map(([field, label]) => (
        <Controller
          key={field}
          control={control}
          name={field}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput mode="outlined" label={label} onBlur={onBlur} onChangeText={onChange} value={value} style={styles.field} />
          )}
        />
      ))}

      <Controller control={control} name="description" render={({ field: { onChange, onBlur, value } }) => (
        <TextInput mode="outlined" label="Description" multiline numberOfLines={4} onBlur={onBlur} onChangeText={onChange} value={value} style={styles.field} />
      )} />

      {!!error && <HelperText type="error" visible>{error}</HelperText>}

      <Button mode="contained" onPress={handleSubmit(onSubmit)} loading={submitting} disabled={submitting} style={{ marginTop: spacing.lg }}>
        Save changes
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { color: colors.text, fontWeight: '700', marginBottom: spacing.lg },
  avatarBlock: { alignItems: 'center', marginBottom: spacing.lg },
  cameraBtn: { position: 'absolute', bottom: -6, right: -6, margin: 0 },
  field: { marginBottom: spacing.md, backgroundColor: colors.surface },
});
