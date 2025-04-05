import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertTriangle, Info, Eye, EyeOff } from 'lucide-react-native';
import DisasterMap from '@/components/disaster/DisasterMap';

const DISASTER_TYPES = [
  { id: 'flood', name: 'Floods', color: '#3B82F6' },
  { id: 'fire', name: 'Wildfires', color: '#EF4444' },
  { id: 'earthquake', name: 'Earthquakes', color: '#B45309' },
  { id: 'hurricane', name: 'Hurricanes', color: '#8B5CF6' },
  { id: 'tornado', name: 'Tornados', color: '#10B981' },
];

export default function DisasterScreen() {
  const [showInfo, setShowInfo] = useState(false);
  const [filters, setFilters] = useState<Record<string, boolean>>(
    DISASTER_TYPES.reduce((acc, type) => ({ ...acc, [type.id]: true }), {})
  );

  const toggleFilter = (id: string) => {
    setFilters(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AR Disaster Simulation</Text>
        <TouchableOpacity 
          style={styles.infoButton}
          onPress={() => setShowInfo(!showInfo)}
        >
          {showInfo ? <EyeOff size={20} color="#4B5563" /> : <Eye size={20} color="#4B5563" />}
        </TouchableOpacity>
      </View>
      
      {showInfo && (
        <View style={styles.infoBox}>
          <Info size={20} color="#3B82F6" style={styles.infoIcon} />
          <Text style={styles.infoText}>
            This map shows real-time disaster data and simulations. Toggle filters to show/hide different disaster types.
            The intensity of the color indicates the severity of the disaster.
          </Text>
        </View>
      )}

      <View style={styles.filterContainer}>
        <Text style={styles.filterTitle}>Disaster Types:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {DISASTER_TYPES.map((type) => (
            <TouchableOpacity 
              key={type.id}
              style={[styles.filterItem, filters[type.id] ? { backgroundColor: type.color } : styles.filterItemInactive]}
              onPress={() => toggleFilter(type.id)}
            >
              <Text style={[styles.filterText, filters[type.id] ? styles.filterTextActive : {}]}>
                {type.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.mapContainer}>
        <DisasterMap />
      </View>

      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>Severity Legend:</Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: 'rgba(255, 0, 0, 0.3)' }]} />
            <Text style={styles.legendText}>Low</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: 'rgba(255, 0, 0, 0.5)' }]} />
            <Text style={styles.legendText}>Medium</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: 'rgba(255, 0, 0, 0.7)' }]} />
            <Text style={styles.legendText}>High</Text>
          </View>
        </View>
      </View>

      <View style={styles.alertContainer}>
        <AlertTriangle size={20} color="#EF4444" />
        <Text style={styles.alertText}>3 active disaster zones in your area</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  infoButton: {
    padding: 8,
  },
  infoBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    flexDirection: 'row',
  },
  infoIcon: {
    marginRight: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  filterItemInactive: {
    backgroundColor: '#F3F4F6',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  mapContainer: {
    flex: 1,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  legendContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  legendItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#4B5563',
  },
  alertContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  alertText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#B91C1C',
    fontWeight: '500',
  },
});