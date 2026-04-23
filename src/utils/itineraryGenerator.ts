import { format, differenceInDays, addDays } from 'date-fns';
import { TripCreationData, DayItinerary, Activity, Interest, Mood, TimeOfDay } from '../types';

const ACTIVITY_TEMPLATES: Record<Interest, { titles: string[]; descriptions: string[] }> = {
  food: {
    titles: [
      'Local Street Food Tour',
      'Traditional Restaurant',
      'Cooking Class',
      'Night Food Market',
      'Cafe Hopping',
      'Seafood Dinner',
      'Rooftop Dining',
      'Breakfast Spot',
    ],
    descriptions: [
      'Experience authentic local flavors',
      'Taste the best dishes in town',
      'Learn to cook traditional recipes',
      'Explore vibrant night markets',
    ],
  },
  nature: {
    titles: [
      'Sunrise Hike',
      'Beach Day',
      'Waterfall Trek',
      'National Park Visit',
      'Botanical Garden',
      'Sunset Viewpoint',
      'River Cruise',
      'Mountain Trail',
    ],
    descriptions: [
      'Connect with nature',
      'Breathtaking natural beauty',
      'Perfect for photography',
      'Peaceful escape from the city',
    ],
  },
  culture: {
    titles: [
      'Historical Temple Visit',
      'Museum Tour',
      'Art Gallery',
      'Local Village Walk',
      'Traditional Dance Show',
      'Heritage Site',
      'Ancient Ruins',
      'Cultural Workshop',
    ],
    descriptions: [
      'Immerse in local history',
      'Discover ancient traditions',
      'Learn about local customs',
      'Experience living heritage',
    ],
  },
  shopping: {
    titles: [
      'Local Market Visit',
      'Artisan Workshop',
      'Night Bazaar',
      'Shopping District',
      'Souvenir Hunt',
      'Boutique Shopping',
      'Flea Market',
      'Craft Village',
    ],
    descriptions: [
      'Find unique souvenirs',
      'Support local artisans',
      'Best deals in town',
      'Authentic local products',
    ],
  },
  nightlife: {
    titles: [
      'Rooftop Bar',
      'Live Music Venue',
      'Beach Club',
      'Jazz Night',
      'Local Pub Crawl',
      'Cocktail Bar',
      'Night Market',
      'Sunset Lounge',
    ],
    descriptions: [
      'Enjoy the vibrant nightlife',
      'Dance the night away',
      'Perfect sunset views',
      'Meet fellow travelers',
    ],
  },
};

const TIME_SLOTS: Record<TimeOfDay, string[]> = {
  morning: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM'],
  afternoon: ['12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'],
  evening: ['5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'],
};

const generateActivity = (
  timeOfDay: TimeOfDay,
  interest: Interest,
  index: number
): Activity => {
  const templates = ACTIVITY_TEMPLATES[interest];
  const titleIndex = Math.floor(Math.random() * templates.titles.length);
  const descIndex = Math.floor(Math.random() * templates.descriptions.length);
  const timeSlots = TIME_SLOTS[timeOfDay];
  const timeIndex = Math.min(index, timeSlots.length - 1);

  return {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: templates.titles[titleIndex],
    time: timeSlots[timeIndex],
    description: templates.descriptions[descIndex],
    rating: 4 + Math.random(),
    distance: `${(Math.random() * 5 + 0.5).toFixed(1)} km`,
    timeOfDay,
    category: interest,
    latitude: 0,
    longitude: 0,
  };
};

const getActivitiesPerTimeSlot = (travelStyle: TripCreationData['travelStyle']): number => {
  switch (travelStyle) {
    case 'relaxed': return 1;
    case 'balanced': return 2;
    case 'packed': return 3;
    default: return 2;
  }
};

export const generateItinerary = (data: TripCreationData): DayItinerary[] => {
  const numDays = differenceInDays(data.endDate, data.startDate) + 1;
  const activitiesPerSlot = getActivitiesPerTimeSlot(data.travelStyle);
  const itinerary: DayItinerary[] = [];

  for (let day = 0; day < numDays; day++) {
    const dayDate = addDays(data.startDate, day);
    const activities: Activity[] = [];
    const timeSlots: TimeOfDay[] = ['morning', 'afternoon', 'evening'];

    timeSlots.forEach((timeOfDay, slotIndex) => {
      for (let i = 0; i < activitiesPerSlot; i++) {
        const interestIndex = (day + slotIndex + i) % data.interests.length;
        const interest = data.interests[interestIndex];
        activities.push(generateActivity(timeOfDay, interest, i));
      }
    });

    itinerary.push({
      day: day + 1,
      date: format(dayDate, 'EEE, MMM d'),
      activities,
    });
  }

  return itinerary;
};

export const regenerateForMood = (
  currentActivities: Activity[],
  mood: Mood,
  interests: Interest[]
): Activity[] => {
  const moodInterestMap: Record<Mood, Interest[]> = {
    easy: ['nature', 'culture'],
    explore: ['culture', 'nature', 'shopping'],
    food: ['food'],
    night: ['nightlife', 'food'],
  };

  const moodInterests = moodInterestMap[mood];
  const relevantInterests = interests.filter(i => moodInterests.includes(i));
  const activeInterests = relevantInterests.length > 0 ? relevantInterests : moodInterests;

  return currentActivities.map((activity, index) => {
    const interest = activeInterests[index % activeInterests.length];
    return generateActivity(activity.timeOfDay, interest, index);
  });
};

export const getAlternativeActivities = (
  currentActivity: Activity,
  interests: Interest[]
): Activity[] => {
  const alternatives: Activity[] = [];
  const relevantInterests = [...interests, currentActivity.category];
  
  for (let i = 0; i < 3; i++) {
    const interest = relevantInterests[i % relevantInterests.length];
    alternatives.push(generateActivity(currentActivity.timeOfDay, interest, i));
  }
  
  return alternatives;
};

