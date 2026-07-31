import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import styles from '../styles/ChipSelector.styles';

export default function ChipSelector({ label, options, selected, onChange, required, error }) {
  const [visible, setVisible] = useState(false);

  const toggle = (item) => {
    if (selected.includes(item)) {
      onChange(selected.filter((s) => s !== item));
    } else {
      onChange([...selected, item]);
    }
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>
        {label} {required ? <Text style={styles.required}>*</Text> : null}
      </Text>
      <TouchableOpacity style={styles.selectBox} onPress={() => setVisible(true)}>
        {selected.length === 0 ? (
          <Text style={styles.placeholder}>Select...</Text>
        ) : (
          <View style={styles.chipRow}>
            {selected.map((item) => (
              <View key={item} style={styles.chip}>
                <Text style={styles.chipText}>{item}</Text>
              </View>
            ))}
          </View>
        )}
        <Ionicons name="chevron-down" size={18} color={colors.textMuted} />
      </TouchableOpacity>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Modal visible={visible} animationType="slide" transparent onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.backdrop} onPress={() => setVisible(false)} />
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>{label}</Text>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Text style={styles.done}>Done</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={options}
            keyExtractor={(item) => item}
            renderItem={({ item }) => {
              const isSelected = selected.includes(item);
              return (
                <TouchableOpacity style={styles.optionRow} onPress={() => toggle(item)}>
                  <Text style={styles.optionText}>{item}</Text>
                  {isSelected ? (
                    <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                  ) : (
                    <Ionicons name="ellipse-outline" size={20} color={colors.border} />
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </Modal>
    </View>
  );
}
