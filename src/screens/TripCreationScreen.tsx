import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { colors } from '../theme/colors';
import { useTripStore } from '../store/tripStore';
import { Budget, TravelStyle, Interest } from '../types';

const BUDGET_OPTIONS: { value: Budget; label: string; emoji: string }[] = [
  { value: 'low', label: 'Budget', emoji: '💰' },
  { value: 'medium', label: 'Comfort', emoji: '💎' },
  { value: 'high', label: 'Luxury', emoji: '👑' },
];

const STYLE_OPTIONS: { value: TravelStyle; label: string; emoji: string }[] = [
  { value: 'relaxed', label: 'Relaxed', emoji: '🧘' },
  { value: 'balanced', label: 'Balanced', emoji: '⚖️' },
  { value: 'packed', label: 'Packed', emoji: '🚀' },
];

const INTEREST_OPTIONS: { value: Interest; label: string; emoji: string }[] = [
  { value: 'food', label: 'Food', emoji: '🍜' },
  { value: 'nature', label: 'Nature', emoji: '🌿' },
  { value: 'culture', label: 'Culture', emoji: '🏛️' },
  { value: 'shopping', label: 'Shopping', emoji: '🛍️' },
  { value: 'nightlife', label: 'Nightlife', emoji: '🌙' },
];

const TripCreationScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { createTrip, setActiveTrip } = useTripStore();

  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState(route.params?.prefilledDestination || '');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000));
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [budget, setBudget] = useState<Budget>('medium');
  const [travelStyle, setTravelStyle] = useState<TravelStyle>('balanced');
  const [interests, setInterests] = useState<Interest[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const toggleInterest = (interest: Interest) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else if (interests.length < 3) {
      setInterests([...interests, interest]);
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleCreate = async () => {
    if (interests.length === 0) return;
    
    setIsCreating(true);
    try {
      const trip = await createTrip({
        destination,
        startDate,
        endDate,
        budget,
        travelStyle,
        interests,
      });
      setActiveTrip(trip.id);
      navigation.navigate('Trip');
    } catch (error) {
      console.error('Failed to create trip:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const isStep1Valid = destination.trim().length > 0;
  const isStep2Valid = true;
  const isStep3Valid = interests.length > 0;

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Where are you going?</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputIcon}>📍</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter destination"
          placeholderTextColor={colors.textLight}
          value={destination}
          onChangeText={setDestination}
          autoFocus
        />
      </View>

      <View style={styles.dateSection}>
        <Text style={styles.dateLabel}>When?</Text>
        
        <View style={styles.dateRow}>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowStartPicker(true)}
          >
            <Text style={styles.dateLabelSmall}>From</Text>
            <Text style={styles.dateValue}>{format(startDate, 'MMM d, yyyy')}</Text>
          </TouchableOpacity>

          <View style={styles.dateArrow}>
            <Text>→</Text>
          </View>

          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowEndPicker(true)}
          >
            <Text style={styles.dateLabelSmall}>To</Text>
            <Text style={styles.dateValue}>{format(endDate, 'MMM d, yyyy')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          minimumDate={new Date()}
          onChange={(_, date) => {
            setShowStartPicker(Platform.OS === 'ios');
            if (date) {
              setStartDate(date);
              if (date > endDate) {
                setEndDate(new Date(date.getTime() + 24 * 60 * 60 * 1000));
              }
            }
          }}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          minimumDate={startDate}
          onChange={(_, date) => {
            setShowEndPicker(Platform.OS === 'ios');
            if (date) setEndDate(date);
          }}
        />
      )}
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>How do you travel?</Text>

      <View style={styles.optionSection}>
        <Text style={styles.optionLabel}>Budget</Text>
        <View style={styles.optionRow}>
          {BUDGET_OPTIONS.map(option => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionButton,
                budget === option.value && styles.optionButtonActive,
              ]}
              onPress={() => setBudget(option.value)}
            >
              <Text style={styles.optionEmoji}>{option.emoji}</Text>
              <Text style={[
                styles.optionText,
                budget === option.value && styles.optionTextActive,
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.optionSection}>
        <Text style={styles.optionLabel}>Style</Text>
        <View style={styles.optionRow}>
          {STYLE_OPTIONS.map(option => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionButton,
                travelStyle === option.value && styles.optionButtonActive,
              ]}
              onPress={() => setTravelStyle(option.value)}
            >
              <Text style={styles.optionEmoji}>{option.emoji}</Text>
              <Text style={[
                styles.optionText,
                travelStyle === option.value && styles.optionTextActive,
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>What interests you?</Text>
      <Text style={styles.stepSubtitle}>
        Select up to 3 • {interests.length}/3 selected
      </Text>

      <View style={styles.interestGrid}>
        {INTEREST_OPTIONS.map(option => {
          const isSelected = interests.includes(option.value);
          const isDisabled = !isSelected && interests.length >= 3;
          
          return (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.interestButton,
                isSelected && styles.interestButtonActive,
                isDisabled && styles.interestButtonDisabled,
              ]}
              onPress={() => toggleInterest(option.value)}
              disabled={isDisabled}
            >
              <Text style={styles.interestEmoji}>{option.emoji}</Text>
              <Text style={[
                styles.interestText,
                isSelected && styles.interestTextActive,
                isDisabled && styles.interestTextDisabled,
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          {[1, 2, 3].map(i => (
            <View
              key={i}
              style={[
                styles.progressDot,
                i <= step && styles.progressDotActive,
              ]}
            />
          ))}
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        {step < 3 ? (
          <TouchableOpacity
            style={[
              styles.nextButton,
              !((step === 1 && isStep1Valid) || (step === 2 && isStep2Valid)) &&
                styles.nextButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={!((step === 1 && isStep1Valid) || (step === 2 && isStep2Valid))}
          >
            <Text style={styles.nextButtonText}>Continue</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.createButton,
              (!isStep3Valid || isCreating) && styles.createButtonDisabled,
            ]}
            onPress={handleCreate}
            disabled={!isStep3Valid || isCreating}
          >
            <Text style={styles.createButtonText}>
              {isCreating ? 'Creating...' : 'Create My Trip'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: colors.text,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  progressDotActive: {
    backgroundColor: colors.primary,
    width: 24,
  },
  placeholder: {
    width: 44,
  },
  content: {
    flex: 1,
  },
  stepContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 17,
    color: colors.text,
  },
  dateSection: {
    marginTop: 32,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateLabelSmall: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  dateArrow: {
    paddingHorizontal: 16,
  },
  optionSection: {
    marginBottom: 32,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  optionButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: 20,
    borderWidth: 2,
    borderColor: colors.border,
  },
  optionButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight + '10',
  },
  optionEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  optionTextActive: {
    color: colors.primary,
  },
  interestGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  interestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 100,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: colors.border,
  },
  interestButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight + '15',
  },
  interestButtonDisabled: {
    opacity: 0.4,
  },
  interestEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  interestText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  interestTextActive: {
    color: colors.primary,
  },
  interestTextDisabled: {
    color: colors.textLight,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: colors.background,
  },
  nextButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: colors.border,
  },
  nextButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  createButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  createButtonDisabled: {
    backgroundColor: colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  createButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default TripCreationScreen;

