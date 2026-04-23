import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { colors } from '../theme/colors';
import { useTripStore } from '../store/tripStore';

const { width, height } = Dimensions.get('window');

const MapScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { activeTrip } = useTripStore();

  // Generate mock coordinates for demo
  const generateMockCoordinates = (index: number) => ({
    latitude: 15.2993 + (index * 0.01),
    longitude: 74.124 + (index * 0.008),
  });

  const activities = activeTrip?.itinerary.flatMap((day, dayIndex) =>
    day.activities.map((activity, actIndex) => ({
      ...activity,
      ...generateMockCoordinates(dayIndex * 3 + actIndex),
    }))
  ) || [];

  const routeCoordinates = activities.map(a => ({
    latitude: a.latitude || 0,
    longitude: a.longitude || 0,
  }));

  const initialRegion = activities.length > 0 ? {
    latitude: activities[0].latitude || 15.2993,
    longitude: activities[0].longitude || 74.124,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  } : {
    latitude: 15.2993,
    longitude: 74.124,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {activities.map((activity, index) => (
          <Marker
            key={activity.id}
            coordinate={{
              latitude: activity.latitude || 0,
              longitude: activity.longitude || 0,
            }}
            title={activity.title}
            description={activity.time}
          >
            <View style={styles.markerContainer}>
              <View style={styles.marker}>
                <Text style={styles.markerText}>{index + 1}</Text>
              </View>
            </View>
          </Marker>
        ))}

        {routeCoordinates.length > 1 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor={colors.primary}
            strokeWidth={3}
            lineDashPattern={[10, 5]}
          />
        )}
      </MapView>

      {/* Back Button */}
      <TouchableOpacity
        style={[styles.backButton, { top: insets.top + 16 }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      {/* Trip Info Card */}
      <View style={[styles.infoCard, { bottom: insets.bottom + 100 }]}>
        <Text style={styles.infoTitle}>{activeTrip?.destination}</Text>
        <Text style={styles.infoSubtitle}>
          {activities.length} activities planned
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width,
    height,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    width: 44,
    height: 44,
    backgroundColor: colors.surface,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  backButtonText: {
    fontSize: 24,
    color: colors.text,
  },
  markerContainer: {
    alignItems: 'center',
  },
  marker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  markerText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  infoCard: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  infoSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
});

export default MapScreen;

