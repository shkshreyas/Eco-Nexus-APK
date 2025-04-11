import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/theme';
import { Info } from 'lucide-react-native';

export default function DroneScreen() {
  const { colors, isDark } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.header, { backgroundColor: colors.card }]}>
          <View style={styles.headerContent}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Drone Recon System
            </Text>
            <View style={styles.betaTag}>
              <Text style={styles.betaText}>PROTOTYPE</Text>
            </View>
          </View>
          <Text
            style={[styles.headerSubtitle, { color: colors.secondaryText }]}
          >
            Environmental Monitoring System
          </Text>
        </View>

        <View style={styles.droneBanner}>
          <Image
            source={require('@/assets/images/deforestation-default.jpg')}
            style={styles.droneImage}
            resizeMode="cover"
          />
          <View
            style={[
              styles.droneStatus,
              {
                backgroundColor: isDark
                  ? 'rgba(0,0,0,0.7)'
                  : 'rgba(255,255,255,0.8)',
              },
            ]}
          >
            <Text style={[styles.droneStatusText, { color: colors.primary }]}>
              EcoNexus Forestry Drone
            </Text>
            <View style={styles.statusIndicator}>
              <View
                style={[styles.statusDot, { backgroundColor: '#10B981' }]}
              />
              <Text style={[styles.statusText, { color: colors.text }]}>
                Prototype Ready
              </Text>
            </View>
          </View>
        </View>

        <View
          style={[styles.prototypeContainer, { backgroundColor: colors.card }]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            About the Prototype
          </Text>
          <Text
            style={[styles.descriptionText, { color: colors.secondaryText }]}
          >
            The EcoNexus Forestry Drone is designed for environmental
            monitoring and conservation efforts. This prototype demonstrates the
            interface for a drone system that will be used to monitor forests,
            track deforestation, and support sustainable development
            initiatives.
          </Text>

          <View
            style={[
              styles.featureCard,
              { backgroundColor: isDark ? colors.elevated : '#F9FAFB' },
            ]}
          >
            <Text style={[styles.featureTitle, { color: colors.text }]}>
              Key Features
            </Text>
            <View style={styles.featureItem}>
              <View
                style={[
                  styles.featureBullet,
                  { backgroundColor: colors.primary },
                ]}
              />
              <Text
                style={[styles.featureText, { color: colors.secondaryText }]}
              >
                High-resolution aerial imagery for forest monitoring
              </Text>
            </View>
            <View style={styles.featureItem}>
              <View
                style={[
                  styles.featureBullet,
                  { backgroundColor: colors.primary },
                ]}
              />
              <Text
                style={[styles.featureText, { color: colors.secondaryText }]}
              >
                Automated flight paths for consistent data collection
              </Text>
            </View>
            <View style={styles.featureItem}>
              <View
                style={[
                  styles.featureBullet,
                  { backgroundColor: colors.primary },
                ]}
              />
              <Text
                style={[styles.featureText, { color: colors.secondaryText }]}
              >
                AI-powered detection of logging and land use changes
              </Text>
            </View>
            <View style={styles.featureItem}>
              <View
                style={[
                  styles.featureBullet,
                  { backgroundColor: colors.primary },
                ]}
              />
              <Text
                style={[styles.featureText, { color: colors.secondaryText }]}
              >
                Weather-resistant design for reliable operation
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.prototypeNoteContainer,
              { backgroundColor: isDark ? colors.elevated : '#F3F4F6' },
            ]}
          >
            <Info size={20} color={colors.primary} />
            <Text style={[styles.prototypeNote, { color: colors.text }]}>
              This is a prototype demonstration of the EcoNexus Drone Recon
              System. Actual functionality will be implemented in future
              releases.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 24,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  betaTag: {
    backgroundColor: '#FCD34D',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  betaText: {
    color: '#92400E',
    fontSize: 10,
    fontWeight: 'bold',
  },
  droneBanner: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  droneImage: {
    width: '100%',
    height: '100%',
  },
  droneStatus: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  droneStatusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
  },
  prototypeContainer: {
    margin: 16,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  featureCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  featureBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
    marginRight: 10,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  prototypeNoteContainer: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    alignItems: 'flex-start',
  },
  prototypeNote: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
});
