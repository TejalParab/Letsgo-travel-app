import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { Mood } from '../types';

interface ChangeMoodSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (mood: Mood) => void;
}

const MOOD_OPTIONS: { value: Mood; label: string; emoji: string; description: string }[] = [
  {
    value: 'easy',
    label: 'Take it easy',
    emoji: '🧘',
    description: 'Fewer activities, more relaxation',
  },
  {
    value: 'explore',
    label: 'Explore more',
    emoji: '🚀',
    description: 'Pack in more sights and experiences',
  },
  {
    value: 'food',
    label: 'Food focus',
    emoji: '🍜',
    description: 'Center the day around great meals',
  },
  {
    value: 'night',
    label: 'Night vibe',
    emoji: '🌙',
    description: 'Evening activities and nightlife',
  },
];

const ChangeMoodSheet: React.FC<ChangeMoodSheetProps> = ({
  visible,
  onClose,
  onSelect,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.handle} />
        
        <Text style={styles.title}>How are you feeling?</Text>
        <Text style={styles.subtitle}>We'll adjust your remaining activities</Text>

        <View style={styles.options}>
          {MOOD_OPTIONS.map(option => (
            <TouchableOpacity
              key={option.value}
              style={styles.optionButton}
              onPress={() => onSelect(option.value)}
              activeOpacity={0.7}
            >
              <Text style={styles.optionEmoji}>{option.emoji}</Text>
              <View style={styles.optionContent}>
                <Text style={styles.optionLabel}>{option.label}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 24,
  },
  options: {
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderRadius: 16,
    padding: 16,
  },
  optionEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  optionDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
});

export default ChangeMoodSheet;

