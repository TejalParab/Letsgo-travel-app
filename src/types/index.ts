export type TravelStyle = 'relaxed' | 'balanced' | 'packed';
export type Budget = 'low' | 'medium' | 'high';
export type Interest = 'food' | 'nature' | 'culture' | 'shopping' | 'nightlife';
export type Mood = 'easy' | 'explore' | 'food' | 'night';
export type TimeOfDay = 'morning' | 'afternoon' | 'evening';

export interface Activity {
  id: string;
  title: string;
  time: string;
  description: string;
  rating: number;
  distance: string;
  timeOfDay: TimeOfDay;
  category: Interest;
  latitude?: number;
  longitude?: number;
}

export interface DayItinerary {
  day: number;
  date: string;
  activities: Activity[];
}

export interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: Budget;
  travelStyle: TravelStyle;
  interests: Interest[];
  itinerary: DayItinerary[];
  isActive: boolean;
  createdAt: string;
}

export interface TripCreationData {
  destination: string;
  startDate: Date;
  endDate: Date;
  budget: Budget;
  travelStyle: TravelStyle;
  interests: Interest[];
}

