import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Trip, TripCreationData, Activity, Mood } from '../types';
import { generateItinerary, regenerateForMood } from '../utils/itineraryGenerator';

interface TripStore {
  trips: Trip[];
  activeTrip: Trip | null;
  isLoading: boolean;
  lastSynced: Date | null;
  
  loadTrips: () => Promise<void>;
  createTrip: (data: TripCreationData) => Promise<Trip>;
  setActiveTrip: (tripId: string) => void;
  removeActivity: (dayIndex: number, activityId: string) => void;
  replaceActivity: (dayIndex: number, activityId: string, newActivity: Activity) => void;
  changeMood: (dayIndex: number, mood: Mood) => void;
  addActivity: (dayIndex: number, activity: Activity) => void;
  syncTrips: () => Promise<void>;
}

export const useTripStore = create<TripStore>((set, get) => ({
  trips: [],
  activeTrip: null,
  isLoading: false,
  lastSynced: null,

  loadTrips: async () => {
    set({ isLoading: true });
    try {
      const stored = await AsyncStorage.getItem('trips');
      if (stored) {
        const trips = JSON.parse(stored);
        const activeTrip = trips.find((t: Trip) => t.isActive) || null;
        set({ trips, activeTrip, lastSynced: new Date() });
      }
    } catch (error) {
      console.error('Failed to load trips:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  createTrip: async (data: TripCreationData) => {
    const itinerary = generateItinerary(data);
    
    const newTrip: Trip = {
      id: Date.now().toString(),
      destination: data.destination,
      startDate: data.startDate.toISOString(),
      endDate: data.endDate.toISOString(),
      budget: data.budget,
      travelStyle: data.travelStyle,
      interests: data.interests,
      itinerary,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    const { trips } = get();
    const updatedTrips = trips.map(t => ({ ...t, isActive: false }));
    updatedTrips.unshift(newTrip);

    await AsyncStorage.setItem('trips', JSON.stringify(updatedTrips));
    set({ trips: updatedTrips, activeTrip: newTrip });

    return newTrip;
  },

  setActiveTrip: (tripId: string) => {
    const { trips } = get();
    const updatedTrips = trips.map(t => ({
      ...t,
      isActive: t.id === tripId,
    }));
    const activeTrip = updatedTrips.find(t => t.id === tripId) || null;
    
    AsyncStorage.setItem('trips', JSON.stringify(updatedTrips));
    set({ trips: updatedTrips, activeTrip });
  },

  removeActivity: (dayIndex: number, activityId: string) => {
    const { activeTrip, trips } = get();
    if (!activeTrip) return;

    const updatedItinerary = [...activeTrip.itinerary];
    updatedItinerary[dayIndex] = {
      ...updatedItinerary[dayIndex],
      activities: updatedItinerary[dayIndex].activities.filter(a => a.id !== activityId),
    };

    const updatedTrip = { ...activeTrip, itinerary: updatedItinerary };
    const updatedTrips = trips.map(t => t.id === activeTrip.id ? updatedTrip : t);

    AsyncStorage.setItem('trips', JSON.stringify(updatedTrips));
    set({ activeTrip: updatedTrip, trips: updatedTrips });
  },

  replaceActivity: (dayIndex: number, activityId: string, newActivity: Activity) => {
    const { activeTrip, trips } = get();
    if (!activeTrip) return;

    const updatedItinerary = [...activeTrip.itinerary];
    updatedItinerary[dayIndex] = {
      ...updatedItinerary[dayIndex],
      activities: updatedItinerary[dayIndex].activities.map(a => 
        a.id === activityId ? newActivity : a
      ),
    };

    const updatedTrip = { ...activeTrip, itinerary: updatedItinerary };
    const updatedTrips = trips.map(t => t.id === activeTrip.id ? updatedTrip : t);

    AsyncStorage.setItem('trips', JSON.stringify(updatedTrips));
    set({ activeTrip: updatedTrip, trips: updatedTrips });
  },

  changeMood: (dayIndex: number, mood: Mood) => {
    const { activeTrip, trips } = get();
    if (!activeTrip) return;

    const updatedItinerary = [...activeTrip.itinerary];
    const newActivities = regenerateForMood(
      updatedItinerary[dayIndex].activities,
      mood,
      activeTrip.interests
    );
    
    updatedItinerary[dayIndex] = {
      ...updatedItinerary[dayIndex],
      activities: newActivities,
    };

    const updatedTrip = { ...activeTrip, itinerary: updatedItinerary };
    const updatedTrips = trips.map(t => t.id === activeTrip.id ? updatedTrip : t);

    AsyncStorage.setItem('trips', JSON.stringify(updatedTrips));
    set({ activeTrip: updatedTrip, trips: updatedTrips });
  },

  addActivity: (dayIndex: number, activity: Activity) => {
    const { activeTrip, trips } = get();
    if (!activeTrip) return;

    const updatedItinerary = [...activeTrip.itinerary];
    updatedItinerary[dayIndex] = {
      ...updatedItinerary[dayIndex],
      activities: [...updatedItinerary[dayIndex].activities, activity],
    };

    const updatedTrip = { ...activeTrip, itinerary: updatedItinerary };
    const updatedTrips = trips.map(t => t.id === activeTrip.id ? updatedTrip : t);

    AsyncStorage.setItem('trips', JSON.stringify(updatedTrips));
    set({ activeTrip: updatedTrip, trips: updatedTrips });
  },

  syncTrips: async () => {
    const { trips } = get();
    await AsyncStorage.setItem('trips', JSON.stringify(trips));
    set({ lastSynced: new Date() });
  },
}));

