import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/theme';

export default function StarRating({ rating = 0, size = 16 }) {
  const rounded = Math.round(rating * 2) / 2;
  return (
    <View style={{ flexDirection: 'row' }}>
      {[1, 2, 3, 4, 5].map((i) => {
        const icon = rounded >= i ? 'star' : rounded >= i - 0.5 ? 'star-half-full' : 'star-outline';
        return <MaterialCommunityIcons key={i} name={icon} size={size} color={colors.secondary} />;
      })}
    </View>
  );
}
