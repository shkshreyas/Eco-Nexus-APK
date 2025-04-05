import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { TreeDeciduous, Zap } from 'lucide-react-native';
import { LineChart } from 'react-native-chart-kit';

type ForestData = Database['public']['Tables']['forest_data']['Row'];

type ForestEnergyMatrixProps = {
  regionFilter?: string;
};

export default function ForestEnergyMatrix({ regionFilter }: ForestEnergyMatrixProps) {
  const [forestData, setForestData] = useState<ForestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [energyImpact, setEnergyImpact] = useState(0);
  const [healthData, setHealthData] = useState<number[]>([]);
  const [regionLabels, setRegionLabels] = useState<string[]>([]);

  useEffect(() => {
    fetchForestData();

    // Set up real-time subscription
    const subscription = supabase
      .channel('forest_data_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'forest_data' }, 
        () => fetchForestData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [regionFilter]);

  const fetchForestData = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('forest_data')
        .select('*')
        .order('region_name', { ascending: true });

      if (regionFilter) {
        query = query.ilike('region_name', `%${regionFilter}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      setForestData(data || []);
      
      // Calculate energy impact
      if (data && data.length > 0) {
        const impact = data.reduce(
          (acc, tree) => acc + (tree.health / 100) * tree.co2_absorption,
          0
        );
        setEnergyImpact(impact);
        
        // Prepare chart data
        setHealthData(data.map(item => item.health));
        setRegionLabels(data.map(item => item.region_name.substring(0, 3)));
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching forest data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && forestData.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#22C55E" />
        <Text style={styles.loadingText}>Loading forest data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load forest data</Text>
        <Text style={styles.errorSubtext}>{error}</Text>
      </View>
    );
  }

  if (forestData.length === 0) {
    return (
      <View style={styles.noDataContainer}>
        <TreeDeciduous size={48} color="#9CA3AF" />
        <Text style={styles.noDataText}>No forest data available</Text>
        {regionFilter && (
          <Text style={styles.noDataSubtext}>Try removing the region filter</Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.energyImpactContainer}>
        <View style={styles.energyHeader}>
          <Zap size={24} color="#22C55E" />
          <Text style={styles.energyTitle}>Energy Impact</Text>
        </View>
        <Text style={styles.energyValue}>{energyImpact.toFixed(2)} kWh</Text>
        <Text style={styles.energySubtext}>Potential energy from forest CO₂ absorption</Text>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Forest Health by Region</Text>
        {healthData.length > 0 && (
          <LineChart
            data={{
              labels: regionLabels,
              datasets: [
                {
                  data: healthData,
                  color: () => '#22C55E',
                  strokeWidth: 2,
                },
                {
                  data: [0, 100], // This is to set the Y-axis scale
                  withDots: false,
                },
              ],
            }}
            width={Dimensions.get('window').width - 32}
            height={220}
            chartConfig={{
              backgroundColor: '#FFFFFF',
              backgroundGradientFrom: '#FFFFFF',
              backgroundGradientTo: '#FFFFFF',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(75, 85, 99, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#22C55E',
              },
            }}
            bezier
            style={styles.chart}
          />
        )}
      </View>

      <View style={styles.dataTable}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.regionColumn]}>Region</Text>
          <Text style={styles.tableHeaderText}>Health</Text>
          <Text style={styles.tableHeaderText}>CO₂ Absorption</Text>
          <Text style={styles.tableHeaderText}>Risk</Text>
        </View>
        {forestData.map((item) => (
          <View key={item.id} style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.regionColumn]} numberOfLines={1}>
              {item.region_name}
            </Text>
            <Text style={styles.tableCell}>{item.health.toFixed(1)}%</Text>
            <Text style={styles.tableCell}>{item.co2_absorption.toFixed(1)} kg</Text>
            <Text 
              style={[styles.tableCell, 
                item.deforestation_risk && item.deforestation_risk > 0.7 ? styles.highRisk : 
                item.deforestation_risk && item.deforestation_risk > 0.3 ? styles.mediumRisk : 
                styles.lowRisk
              ]}
            >
              {item.deforestation_risk ? (item.deforestation_risk * 100).toFixed(0) + '%' : 'N/A'}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#4B5563',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#EF4444',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#EF4444',
    textAlign: 'center',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noDataText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
  },
  noDataSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
  },
  energyImpactContainer: {
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  energyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  energyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#065F46',
    marginLeft: 8,
  },
  energyValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#047857',
    marginBottom: 4,
  },
  energySubtext: {
    fontSize: 14,
    color: '#065F46',
    textAlign: 'center',
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  chart: {
    borderRadius: 8,
  },
  dataTable: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
  },
  regionColumn: {
    flex: 1.5,
    textAlign: 'left',
  },
  highRisk: {
    color: '#EF4444',
    fontWeight: '600',
  },
  mediumRisk: {
    color: '#F59E0B',
    fontWeight: '600',
  },
  lowRisk: {
    color: '#10B981',
    fontWeight: '600',
  },
});