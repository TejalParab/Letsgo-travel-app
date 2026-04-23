import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { colors } from '../theme/colors';
import { Activity } from '../types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

interface ActivityCardProps {
  activity: Activity;
  onPress: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onPress,
  onSwipeLeft,
  onSwipeRight,
}) => {
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        translateX.setValue(gestureState.dx);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -SWIPE_THRESHOLD && onSwipeLeft) {
          Animated.timing(translateX, {
            toValue: -SCREEN_WIDTH,
            duration: 200,
            useNativeDriver: true,
          }).start(onSwipeLeft);
        } else if (gestureState.dx > SWIPE_THRESHOLD && onSwipeRight) {
          Animated.timing(translateX, {
            toValue: SCREEN_WIDTH,
            duration: 200,
            useNativeDriver: true,
          }).start(onSwipeRight);
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const categoryEmojis: Record<string, string> = {
    food: '🍜',
    nature: '🌿',
    culture: '🏛️',
    shopping: '🛍️',
    nightlife: '🌙',
  };

  const leftActionOpacity = translateX.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const rightActionOpacity = translateX.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.wrapper}>
      {/* Left action (remove) */}
      <Animated.View style={[styles.actionLeft, { opacity: leftActionOpacity }]}>
        <Text style={styles.actionText}>❌ Remove</Text>
      </Animated.View>

      {/* Right action (keep) */}
      <Animated.View style={[styles.actionRight, { opacity: rightActionOpacity }]}>
        <Text style={styles.actionText}>✓ Keep</Text>
      </Animated.View>

      <Animated.View
        style={[styles.container, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          style={styles.touchable}
          onPress={onPress}
          activeOpacity={0.9}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{categoryEmojis[activity.category]}</Text>
          </View>
          
          <View style={styles.content}>
            <Text style={styles.title}>{activity.title}</Text>
            <Text style={styles.description} numberOfLines={1}>
              {activity.description}
            </Text>
          </View>

          <View style={styles.timeContainer}>
            <Text style={styles.time}>{activity.time}</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 10,
    position: 'relative',
  },
  actionLeft: {
    position: 'absolute',
    right: 20,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  actionRight: {
    position: 'absolute',
    left: 20,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  touchable: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 22,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  timeContainer: {
    backgroundColor: colors.surfaceAlt,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  time: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});

export default ActivityCard;

