import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { format, differenceInDays } from 'date-fns';
import { colors } from '../theme/colors';
import { Trip } from '../types';

interface TripCardProps {
  trip: Trip;
  onPress: () => void;
  isPast?: boolean;
}

const TripCard: React.FC<TripCardProps> = ({ trip, onPress, isPast }) => {
  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const duration = differenceInDays(endDate, startDate) + 1;

  const destinationEmojis: Record<string, string> = {
    'Goa': '🏖️',
    'Bali': '🌴',
    'Dubai': '🏙️',
    'Paris': '🗼',
    'Tokyo': '🗾',
    'Maldives': '🐚',
  };

  const emoji = destinationEmojis[trip.destination] || '✈️';

  return (
    <TouchableOpacity
      style={[styles.container, isPast && styles.containerPast]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.emojiContainer}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.destination, isPast && styles.destinationPast]}>
          {trip.destination}
        </Text>
        <Text style={styles.dates}>
          {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
        </Text>
      </View>

      <View style={styles.meta}>
        <Text style={styles.duration}>{duration} days</Text>
        {trip.isActive && (
          <View style={styles.activeBadge}>
            <Text style={styles.activeBadgeText}>Active</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  containerPast: {
    opacity: 0.6,
  },
  emojiContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  emoji: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  destination: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  destinationPast: {
    color: colors.textSecondary,
  },
  dates: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  meta: {
    alignItems: 'flex-end',
  },
  duration: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  activeBadge: {
    backgroundColor: colors.success + '20',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginTop: 6,
  },
  activeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.success,
  },
});

export default TripCard;

