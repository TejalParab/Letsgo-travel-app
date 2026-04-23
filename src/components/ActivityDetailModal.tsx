import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { Activity, Interest } from '../types';
import { useTripStore } from '../store/tripStore';
import { getAlternativeActivities } from '../utils/itineraryGenerator';

interface ActivityDetailModalProps {
  visible: boolean;
  activity: Activity | null;
  onClose: () => void;
  dayIndex: number;
  interests: Interest[];
}

const ActivityDetailModal: React.FC<ActivityDetailModalProps> = ({
  visible,
  activity,
  onClose,
  dayIndex,
  interests,
}) => {
  const insets = useSafeAreaInsets();
  const { removeActivity, replaceActivity } = useTripStore();
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [alternatives, setAlternatives] = useState<Activity[]>([]);

  if (!activity) return null;

  const handleRemove = () => {
    removeActivity(dayIndex, activity.id);
    onClose();
  };

  const handleReplace = () => {
    const alts = getAlternativeActivities(activity, interests);
    setAlternatives(alts);
    setShowAlternatives(true);
  };

  const handleSelectAlternative = (newActivity: Activity) => {
    replaceActivity(dayIndex, activity.id, newActivity);
    setShowAlternatives(false);
    onClose();
  };

  const handleNavigate = () => {
    // In a real app, this would open maps
    onClose();
  };

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

        {!showAlternatives ? (
          <>
            <View style={styles.header}>
              <Text style={styles.title}>{activity.title}</Text>
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaIcon}>⭐</Text>
                  <Text style={styles.metaText}>{activity.rating.toFixed(1)}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaIcon}>📍</Text>
                  <Text style={styles.metaText}>{activity.distance}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.description}>{activity.description}</Text>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionButton} onPress={handleReplace}>
                <Text style={styles.actionIcon}>🔄</Text>
                <Text style={styles.actionText}>Replace</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.actionButtonDanger]}
                onPress={handleRemove}
              >
                <Text style={styles.actionIcon}>🗑️</Text>
                <Text style={styles.actionTextDanger}>Remove</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.actionButtonPrimary]}
                onPress={handleNavigate}
              >
                <Text style={styles.actionIcon}>🧭</Text>
                <Text style={styles.actionTextPrimary}>Navigate</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => setShowAlternatives(false)}>
                <Text style={styles.backButton}>← Back</Text>
              </TouchableOpacity>
              <Text style={styles.alternativesTitle}>Choose alternative</Text>
            </View>

            <ScrollView style={styles.alternativesList}>
              {alternatives.map(alt => (
                <TouchableOpacity
                  key={alt.id}
                  style={styles.alternativeCard}
                  onPress={() => handleSelectAlternative(alt)}
                >
                  <View style={styles.alternativeContent}>
                    <Text style={styles.alternativeTitle}>{alt.title}</Text>
                    <Text style={styles.alternativeDescription}>
                      {alt.description}
                    </Text>
                    <View style={styles.alternativeMeta}>
                      <Text style={styles.alternativeMetaText}>
                        ⭐ {alt.rating.toFixed(1)}
                      </Text>
                      <Text style={styles.alternativeMetaText}>
                        📍 {alt.distance}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.alternativeArrow}>→</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}
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
    maxHeight: '70%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  metaText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: colors.surfaceAlt,
  },
  actionButtonDanger: {
    backgroundColor: colors.error + '10',
  },
  actionButtonPrimary: {
    backgroundColor: colors.primary,
  },
  actionIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  actionTextDanger: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.error,
  },
  actionTextPrimary: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  backButton: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: 8,
  },
  alternativesTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  alternativesList: {
    marginTop: 16,
  },
  alternativeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  alternativeContent: {
    flex: 1,
  },
  alternativeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  alternativeDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  alternativeMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  alternativeMetaText: {
    fontSize: 12,
    color: colors.textLight,
  },
  alternativeArrow: {
    fontSize: 20,
    color: colors.textLight,
    marginLeft: 12,
  },
});

export default ActivityDetailModal;

