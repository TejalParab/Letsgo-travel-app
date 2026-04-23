import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { useTripStore } from '../store/tripStore';
import ActivityCard from '../components/ActivityCard';
import ActivityDetailModal from '../components/ActivityDetailModal';
import ChangeMoodSheet from '../components/ChangeMoodSheet';
import ContextualSuggestion from '../components/ContextualSuggestion';
import QuickActionButton from '../components/QuickActionButton';
import { Activity, TimeOfDay } from '../types';

const ItineraryScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { activeTrip, removeActivity, changeMood } = useTripStore();
  
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [showMoodSheet, setShowMoodSheet] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(true);
  const [updateMessage, setUpdateMessage] = useState('');

  if (!activeTrip) {
    return (
      <View style={[styles.container, styles.emptyContainer, { paddingTop: insets.top }]}>
        <Text style={styles.emptyEmoji}>🗺️</Text>
        <Text style={styles.emptyText}>No active trip</Text>
        <Text style={styles.emptySubtext}>Start planning your next adventure</Text>
        <TouchableOpacity
          style={styles.emptyButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.emptyButtonText}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentDayItinerary = activeTrip.itinerary[selectedDay];

  const getActivitiesByTime = (timeOfDay: TimeOfDay) => {
    return currentDayItinerary?.activities.filter(a => a.timeOfDay === timeOfDay) || [];
  };

  const handleRemoveActivity = (activityId: string) => {
    removeActivity(selectedDay, activityId);
    showUpdateConfirmation('Activity removed');
  };

  const handleMoodChange = (mood: any) => {
    changeMood(selectedDay, mood);
    setShowMoodSheet(false);
    showUpdateConfirmation('Updated your plan');
  };

  const handleSkipDay = () => {
    Alert.alert(
      'Skip this day?',
      'All activities for today will be removed.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Skip',
          style: 'destructive',
          onPress: () => {
            currentDayItinerary.activities.forEach(a => {
              removeActivity(selectedDay, a.id);
            });
            showUpdateConfirmation('Day skipped');
          },
        },
      ]
    );
  };

  const handleHungry = () => {
    // Simulate adding a food activity
    showUpdateConfirmation('Added nearby restaurant');
  };

  const showUpdateConfirmation = (message: string) => {
    setUpdateMessage(message);
    setTimeout(() => setUpdateMessage(''), 2000);
  };

  const renderTimeSection = (title: string, emoji: string, timeOfDay: TimeOfDay) => {
    const activities = getActivitiesByTime(timeOfDay);
    
    return (
      <View style={styles.timeSection}>
        <View style={styles.timeSectionHeader}>
          <Text style={styles.timeSectionEmoji}>{emoji}</Text>
          <Text style={styles.timeSectionTitle}>{title}</Text>
        </View>
        
        {activities.length > 0 ? (
          activities.map(activity => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onPress={() => setSelectedActivity(activity)}
              onSwipeLeft={() => handleRemoveActivity(activity.id)}
            />
          ))
        ) : (
          <View style={styles.emptyTimeSlot}>
            <Text style={styles.emptyTimeSlotText}>Free time</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.tripName}>{activeTrip.destination}</Text>
          <Text style={styles.tripDates}>
            {currentDayItinerary?.date}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.mapButton}
          onPress={() => navigation.navigate('Map')}
        >
          <Text style={styles.mapButtonText}>🗺️</Text>
        </TouchableOpacity>
      </View>

      {/* Day Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.daySelector}
        contentContainerStyle={styles.daySelectorContent}
      >
        {activeTrip.itinerary.map((day, index) => (
          <TouchableOpacity
            key={day.day}
            style={[
              styles.dayChip,
              selectedDay === index && styles.dayChipActive,
            ]}
            onPress={() => setSelectedDay(index)}
          >
            <Text style={[
              styles.dayChipText,
              selectedDay === index && styles.dayChipTextActive,
            ]}>
              Day {day.day}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Itinerary Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {renderTimeSection('Morning', '🌅', 'morning')}
        {renderTimeSection('Afternoon', '☀️', 'afternoon')}
        {renderTimeSection('Evening', '🌙', 'evening')}
      </ScrollView>

      {/* Quick Actions */}
      <View style={[styles.quickActions, { paddingBottom: insets.bottom + 80 }]}>
        <QuickActionButton
          emoji="🎭"
          label="Mood"
          onPress={() => setShowMoodSheet(true)}
        />
        <QuickActionButton
          emoji="🍽️"
          label="Hungry"
          onPress={handleHungry}
        />
        <QuickActionButton
          emoji="⏭️"
          label="Skip"
          onPress={handleSkipDay}
        />
      </View>

      {/* Update Confirmation */}
      {updateMessage !== '' && (
        <View style={styles.updateConfirmation}>
          <Text style={styles.updateConfirmationText}>✓ {updateMessage}</Text>
        </View>
      )}

      {/* Contextual Suggestion */}
      {showSuggestion && (
        <ContextualSuggestion
          message="Cafe 5 mins away"
          onYes={() => {
            setShowSuggestion(false);
            showUpdateConfirmation('Added to itinerary');
          }}
          onSkip={() => setShowSuggestion(false)}
        />
      )}

      {/* Activity Detail Modal */}
      <ActivityDetailModal
        visible={selectedActivity !== null}
        activity={selectedActivity}
        onClose={() => setSelectedActivity(null)}
        dayIndex={selectedDay}
        interests={activeTrip.interests}
      />

      {/* Change Mood Sheet */}
      <ChangeMoodSheet
        visible={showMoodSheet}
        onClose={() => setShowMoodSheet(false)}
        onSelect={handleMoodChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  emptySubtext: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  tripName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  tripDates: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  mapButton: {
    width: 44,
    height: 44,
    backgroundColor: colors.surface,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  mapButtonText: {
    fontSize: 20,
  },
  daySelector: {
    maxHeight: 50,
  },
  daySelectorContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  dayChip: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dayChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  dayChipTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    marginTop: 16,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  timeSection: {
    marginBottom: 28,
  },
  timeSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeSectionEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  timeSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  emptyTimeSlot: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 12,
    paddingVertical: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  emptyTimeSlotText: {
    fontSize: 14,
    color: colors.textLight,
  },
  quickActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingTop: 16,
    paddingHorizontal: 20,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  updateConfirmation: {
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
    backgroundColor: colors.success,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 100,
  },
  updateConfirmationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ItineraryScreen;

