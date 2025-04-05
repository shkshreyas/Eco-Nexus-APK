import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Recycle } from 'lucide-react-native';
import { Database } from '@/types/supabase';

type EwasteItem = Database['public']['Tables']['ewaste_items']['Row'];

export default function EwasteScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>E-Waste QR Tracking</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.menuContainer}>
          <View style={styles.heroSection}>
            <Recycle size={48} color="#22C55E" />
            <Text style={styles.heroTitle}>E-Waste Recycling</Text>
            <Text style={styles.heroSubtitle}>
              Help reduce electronic waste by properly recycling your devices
            </Text>
          </View>

          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>Your Impact</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>Items Recycled</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>600</Text>
                <Text style={styles.statLabel}>Points Earned</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>8.5kg</Text>
                <Text style={styles.statLabel}>Waste Saved</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>How It Works</Text>
            <Text style={styles.infoStep}>1. Register your e-waste items</Text>
            <Text style={styles.infoStep}>2. Print or save the QR code</Text>
            <Text style={styles.infoStep}>3. Attach QR code to the item</Text>
            <Text style={styles.infoStep}>4. Bring to recycling center</Text>
            <Text style={styles.infoStep}>5. Scan QR code when recycling</Text>
            <Text style={styles.infoStep}>6. Earn green points!</Text>
          </View>
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  menuContainer: {
    flex: 1,
    padding: 16,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginTop: 12,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
  },
  statsCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#22C55E',
  },
  statLabel: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#065F46',
    marginBottom: 12,
  },
  infoStep: {
    fontSize: 14,
    color: '#065F46',
    marginBottom: 8,
    paddingLeft: 8,
  },
});