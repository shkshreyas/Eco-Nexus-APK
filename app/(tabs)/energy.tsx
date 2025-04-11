import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/theme';
import { BarChart3, Zap, Leaf, TrendingDown, Info } from 'lucide-react-native';

export default function EnergyScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Energy Monitoring</Text>
          <Text style={[styles.headerSubtitle, { color: colors.secondaryText }]}>
            View and manage your energy consumption
          </Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.card, { backgroundColor: colors.card }]}
          onPress={() => router.push('/energy-details')}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#22C55E' }]}>
            <Zap size={24} color="#FFFFFF" />
          </View>
          <View style={styles.cardContent}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Energy Tracker</Text>
            <Text style={[styles.cardDescription, { color: colors.secondaryText }]}>
              View detailed energy consumption statistics and charts
            </Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.card, { backgroundColor: colors.card }]}
          onPress={() => router.push('/resources/energy-saving')}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#F59E0B' }]}>
            <TrendingDown size={24} color="#FFFFFF" />
          </View>
          <View style={styles.cardContent}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Energy Saving Tips</Text>
            <Text style={[styles.cardDescription, { color: colors.secondaryText }]}>
              Discover ways to reduce your energy consumption and save money
            </Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.card, { backgroundColor: colors.card }]}
          onPress={() => router.push('/resources/carbon-calculator')}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#3B82F6' }]}>
            <BarChart3 size={24} color="#FFFFFF" />
          </View>
          <View style={styles.cardContent}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Carbon Footprint</Text>
            <Text style={[styles.cardDescription, { color: colors.secondaryText }]}>
              Calculate and track your carbon footprint over time
            </Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.card, { backgroundColor: colors.card }]}
          onPress={() => router.push('/resources/green-living')}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#22C55E' }]}>
            <Leaf size={24} color="#FFFFFF" />
          </View>
          <View style={styles.cardContent}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Green Living</Text>
            <Text style={[styles.cardDescription, { color: colors.secondaryText }]}>
              Sustainable living tips and practices for a greener lifestyle
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 60,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  card: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
}); 