import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import {
  Package,
  Lock,
  Info,
  MapPin,
  Battery,
  Wifi,
  AlarmClock,
} from 'lucide-react-native';
import { useTheme } from '@/context/theme';

export default function DroneReconInterface() {
  const { colors, isDark } = useTheme();
  const [selectedTab, setSelectedTab] = useState('dashboard');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Drone Recon System
          </Text>
          <View style={styles.betaTag}>
            <Text style={styles.betaText}>PROTOTYPE</Text>
          </View>
        </View>
        <Text style={[styles.headerSubtitle, { color: colors.secondaryText }]}>
          Environmental Monitoring System
        </Text>
      </View>

      <ScrollView style={styles.content}>
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

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedTab === 'dashboard' && [
                styles.selectedTab,
                { borderColor: colors.primary },
              ],
            ]}
            onPress={() => setSelectedTab('dashboard')}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === 'dashboard' && { color: colors.primary },
              ]}
            >
              Dashboard
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedTab === 'missions' && [
                styles.selectedTab,
                { borderColor: colors.primary },
              ],
            ]}
            onPress={() => setSelectedTab('missions')}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === 'missions' && { color: colors.primary },
              ]}
            >
              Missions
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedTab === 'maps' && [
                styles.selectedTab,
                { borderColor: colors.primary },
              ],
            ]}
            onPress={() => setSelectedTab('maps')}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === 'maps' && { color: colors.primary },
              ]}
            >
              Maps
            </Text>
          </TouchableOpacity>
        </View>

        {selectedTab === 'dashboard' && (
          <View style={styles.dashboardContainer}>
            <View
              style={[styles.statsContainer, { backgroundColor: colors.card }]}
            >
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Drone Status
              </Text>

              <View style={styles.statRow}>
                <View style={styles.statItem}>
                  <Battery size={20} color={colors.primary} />
                  <Text
                    style={[styles.statLabel, { color: colors.secondaryText }]}
                  >
                    Battery
                  </Text>
                  <Text style={[styles.statValue, { color: colors.text }]}>
                    92%
                  </Text>
                </View>

                <View style={styles.statItem}>
                  <Wifi size={20} color={colors.primary} />
                  <Text
                    style={[styles.statLabel, { color: colors.secondaryText }]}
                  >
                    Signal
                  </Text>
                  <Text style={[styles.statValue, { color: colors.text }]}>
                    Strong
                  </Text>
                </View>

                <View style={styles.statItem}>
                  <AlarmClock size={20} color={colors.primary} />
                  <Text
                    style={[styles.statLabel, { color: colors.secondaryText }]}
                  >
                    Flight Time
                  </Text>
                  <Text style={[styles.statValue, { color: colors.text }]}>
                    24 min
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={[styles.featureCard, { backgroundColor: colors.card }]}
            >
              <View style={styles.featureHeader}>
                <Text style={[styles.featureTitle, { color: colors.text }]}>
                  Automated Deforestation Detection
                </Text>
                <Lock size={18} color="#9CA3AF" />
              </View>
              <Text
                style={[
                  styles.featureDescription,
                  { color: colors.secondaryText },
                ]}
              >
                AI-powered analysis identifies illegal logging and forest
                degradation in real-time.
              </Text>
              <TouchableOpacity
                style={[
                  styles.featureButton,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text style={styles.featureButtonText}>Upgrade to Access</Text>
              </TouchableOpacity>
              <View style={styles.comingSoonBadge}>
                <Text style={styles.comingSoonText}>Coming Soon</Text>
              </View>
            </View>

            <View
              style={[styles.featureCard, { backgroundColor: colors.card }]}
            >
              <View style={styles.featureHeader}>
                <Text style={[styles.featureTitle, { color: colors.text }]}>
                  Wildfire Early Warning System
                </Text>
                <Lock size={18} color="#9CA3AF" />
              </View>
              <Text
                style={[
                  styles.featureDescription,
                  { color: colors.secondaryText },
                ]}
              >
                Thermal imaging detects hotspots before they develop into
                dangerous wildfires.
              </Text>
              <TouchableOpacity
                style={[
                  styles.featureButton,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text style={styles.featureButtonText}>Upgrade to Access</Text>
              </TouchableOpacity>
              <View style={styles.comingSoonBadge}>
                <Text style={styles.comingSoonText}>Coming Soon</Text>
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
        )}

        {selectedTab === 'missions' && (
          <View style={styles.missionContainer}>
            <View
              style={[styles.missionSection, { backgroundColor: colors.card }]}
            >
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Planned Missions
              </Text>
              <Text
                style={[styles.emptyStateText, { color: colors.secondaryText }]}
              >
                No missions scheduled for prototype version
              </Text>
              <TouchableOpacity
                style={[
                  styles.blockedButton,
                  {
                    backgroundColor: isDark
                      ? 'rgba(239, 68, 68, 0.2)'
                      : '#FEE2E2',
                  },
                ]}
              >
                <Lock size={16} color={isDark ? '#FCA5A5' : '#B91C1C'} />
                <Text
                  style={{
                    color: isDark ? '#FCA5A5' : '#B91C1C',
                    marginLeft: 8,
                  }}
                >
                  Prototype Only
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {selectedTab === 'maps' && (
          <View style={styles.mapsContainer}>
            <View
              style={[styles.mapPlaceholder, { backgroundColor: colors.card }]}
            >
              <MapPin size={40} color={colors.primary} />
              <Text style={[styles.mapPlaceholderText, { color: colors.text }]}>
                Mapping Interface
              </Text>
              <Text
                style={[
                  styles.mapPlaceholderSubtext,
                  { color: colors.secondaryText },
                ]}
              >
                Available in full release version
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  content: {
    flex: 1,
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
  tabsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginHorizontal: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  selectedTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  dashboardContainer: {
    padding: 16,
  },
  statsContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
  },
  featureCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  featureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flexWrap: 'wrap',
    flex: 1,
    marginRight: 8,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  featureButton: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  featureButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  comingSoonBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
  },
  comingSoonText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  missionContainer: {
    padding: 16,
  },
  missionSection: {
    borderRadius: 12,
    padding: 16,
  },
  emptyStateText: {
    textAlign: 'center',
    marginVertical: 24,
  },
  blockedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  mapsContainer: {
    padding: 16,
  },
  mapPlaceholder: {
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    marginTop: 4,
  },
  prototypeNoteContainer: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  prototypeNote: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
});
