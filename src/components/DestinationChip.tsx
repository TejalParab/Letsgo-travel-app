import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

interface DestinationChipProps {
  name: string;
  emoji: string;
  onPress: () => void;
}

const DestinationChip: React.FC<DestinationChipProps> = ({ name, emoji, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.name}>{name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 100,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emoji: {
    fontSize: 18,
    marginRight: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
});

export default DestinationChip;

