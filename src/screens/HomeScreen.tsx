import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { useTripStore } from '../store/tripStore';
import TripCard from '../components/TripCard';
import DestinationChip from '../components/DestinationChip';

const QUICK_DESTINATIONS = [
  { id: '1', name: 'Goa', emoji: '🏖️' },
  { id: '2', name: 'Bali', emoji: '🌴' },
  { id: '3', name: 'Dubai', emoji: '🏙️' },
  { id: '4', name: 'Paris', emoji: '🗼' },
  { id: '5', name: 'Tokyo', emoji: '🗾' },
  { id: '6', name: 'Maldives', emoji: '🐚' },
];

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { trips, loadTrips, setActiveTrip } = useTripStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadTrips();
  }, []);

  const handleStartNewTrip = (destination?: string) => {
    navigation.navigate('TripCreation', { prefilledDestination: destination });
  };

  const handleTripPress = (tripId: string) => {
    setActiveTrip(tripId);
    navigation.navigate('Trip');
  };

  const upcomingTrips = trips.filter(
    t => new Date(t.startDate) >= new Date()
  );
  const pastTrips = trips.filter(
    t => new Date(t.startDate) < new Date()
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Let's Go!!</Text>
          <Text style={styles.subtitle}>Where to next?</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search destination..."
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => handleStartNewTrip(searchQuery)}
          />
        </View>

        {/* Quick Destinations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick picks</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsContainer}
          >
            {QUICK_DESTINATIONS.map(dest => (
              <DestinationChip
                key={dest.id}
                name={dest.name}
                emoji={dest.emoji}
                onPress={() => handleStartNewTrip(dest.name)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Your Trips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Trips</Text>
          
          {upcomingTrips.length > 0 && (
            <View style={styles.tripSection}>
              <Text style={styles.tripSectionLabel}>Upcoming</Text>
              {upcomingTrips.map(trip => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onPress={() => handleTripPress(trip.id)}
                />
              ))}
            </View>
          )}

          {pastTrips.length > 0 && (
            <View style={styles.tripSection}>
              <Text style={styles.tripSectionLabel}>Past</Text>
              {pastTrips.map(trip => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onPress={() => handleTripPress(trip.id)}
                  isPast
                />
              ))}
            </View>
          )}

          {trips.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🌍</Text>
              <Text style={styles.emptyText}>No trips yet</Text>
              <Text style={styles.emptySubtext}>Start planning your adventure!</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Primary CTA */}
      <View style={[styles.ctaContainer, { paddingBottom: insets.bottom + 80 }]}>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => handleStartNewTrip()}
          activeOpacity={0.9}
        >
          <Text style={styles.ctaIcon}>✈️</Text>
          <Text style={styles.ctaText}>Start New Trip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  section: {
    marginTop: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  chipsContainer: {
    paddingHorizontal: 20,
    gap: 10,
  },
  tripSection: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  tripSectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  ctaContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: colors.background,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 18,
    borderRadius: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  ctaText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default HomeScreen;

