import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/auth';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { fetchEnergyReadings } from '@/lib/supabase';
import { ArrowLeft, Calendar, TrendingDown, TrendingUp, Clock, Zap } from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;

export default function EnergyDetailsScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week');
  const [energyData, setEnergyData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [30, 45, 28, 80, 99, 43, 50],
      },
    ],
  });
  const [hourlyData, setHourlyData] = useState({
    labels: ['12am', '4am', '8am', '12pm', '4pm', '8pm'],
    datasets: [
      {
        data: [5, 10, 25, 35, 40, 30],
        color: (opacity = 1) => `rgba(65, 105, 225, ${opacity})`,
      },
    ],
  });
  const [usageBreakdown, setUsageBreakdown] = useState([
    { category: 'Lighting', percentage: 28, color: '#22C55E' },
    { category: 'Heating', percentage: 35, color: '#F59E0B' },
    { category: 'Appliances', percentage: 20, color: '#3B82F6' },
    { category: 'Other', percentage: 17, color: '#8B5CF6' },
  ]);
  const [statistics, setStatistics] = useState({
    averageDaily: 45,
    totalMonthly: 1350,
    peakTime: '6-8 PM',
    lowestTime: '2-4 AM',
    trend: -8,
    co2Saved: 120,
  });

  useEffect(() => {
    loadEnergyData();
  }, [period]);

  const loadEnergyData = async () => {
    setLoading(true);
    try {
      // Fetch energy readings from Supabase
      const { data, error } = await fetchEnergyReadings(period);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Process data for chart display
        const processedData = processChartData(data, period);
        setEnergyData(processedData);
        
        // In a real app, we would fetch and process hourly data as well
        // For now, we'll use the mock data
      }
    } catch (error) {
      console.error('Error loading energy data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (data: any[], periodType: 'day' | 'week' | 'month') => {
    // This is a simplified version of processing data
    // In a real app, this would be more complex based on the data structure
    
    let labels: string[] = [];
    let values: number[] = [];
    
    switch (periodType) {
      case 'day':
        // For a day, show hourly data
        labels = ['12am', '4am', '8am', '12pm', '4pm', '8pm'];
        values = [5, 10, 25, 35, 40, 30]; // Mock data
        break;
      case 'week':
        // For a week, show daily data
        labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        values = data.slice(0, 7).map(item => item.value).reverse();
        break;
      case 'month':
        // For a month, show weekly data
        labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        values = [320, 280, 300, 450]; // Mock data
        break;
    }
    
    return {
      labels,
      datasets: [{ data: values }],
    };
  };

  const renderBreakdownChart = () => {
    return (
      <View style={styles.breakdownContainer}>
        <Text style={styles.breakdownTitle}>Usage Breakdown</Text>
        <View style={styles.breakdownChart}>
          {usageBreakdown.map((item, index) => (
            <View key={index} style={styles.breakdownItem}>
              <View style={styles.breakdownBarContainer}>
                <View 
                  style={[
                    styles.breakdownBar, 
                    { 
                      height: `${item.percentage}%`, 
                      backgroundColor: item.color 
                    }
                  ]} 
                />
              </View>
              <Text style={styles.breakdownPercentage}>{item.percentage}%</Text>
              <Text style={styles.breakdownCategory}>{item.category}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  if (!user) {
    router.replace('/auth');
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Energy Tracker</Text>
          <View style={{ width: 24 }} /> {/* Empty view for balance */}
        </View>

        <View style={styles.periodSelector}>
          <TouchableOpacity
            style={[styles.periodButton, period === 'day' && styles.activePeriod]}
            onPress={() => setPeriod('day')}
          >
            <Text 
              style={[
                styles.periodButtonText, 
                period === 'day' && styles.activePeriodText
              ]}
            >
              Day
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodButton, period === 'week' && styles.activePeriod]}
            onPress={() => setPeriod('week')}
          >
            <Text 
              style={[
                styles.periodButtonText, 
                period === 'week' && styles.activePeriodText
              ]}
            >
              Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodButton, period === 'month' && styles.activePeriod]}
            onPress={() => setPeriod('month')}
          >
            <Text 
              style={[
                styles.periodButtonText, 
                period === 'month' && styles.activePeriodText
              ]}
            >
              Month
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>
            Energy Consumption ({period === 'day' ? 'Hourly' : period === 'week' ? 'Daily' : 'Weekly'})
          </Text>
          
          {loading ? (
            <ActivityIndicator size="large" color="#22C55E" style={styles.loader} />
          ) : (
            <BarChart
              data={energyData}
              width={screenWidth - 40}
              height={220}
              yAxisSuffix=" kWh"
              chartConfig={{
                backgroundColor: '#FFFFFF',
                backgroundGradientFrom: '#FFFFFF',
                backgroundGradientTo: '#FFFFFF',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(71, 85, 105, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                barPercentage: 0.7,
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          )}
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Calendar size={20} color="#22C55E" />
            </View>
            <Text style={styles.statValue}>{statistics.averageDaily} kWh</Text>
            <Text style={styles.statLabel}>Avg. Daily</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Zap size={20} color="#22C55E" />
            </View>
            <Text style={styles.statValue}>{statistics.totalMonthly} kWh</Text>
            <Text style={styles.statLabel}>Monthly Total</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Clock size={20} color="#22C55E" />
            </View>
            <Text style={styles.statValue}>{statistics.peakTime}</Text>
            <Text style={styles.statLabel}>Peak Usage</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              {statistics.trend < 0 ? (
                <TrendingDown size={20} color="#22C55E" />
              ) : (
                <TrendingUp size={20} color="#EF4444" />
              )}
            </View>
            <Text 
              style={[
                styles.statValue, 
                { color: statistics.trend < 0 ? '#22C55E' : '#EF4444' }
              ]}
            >
              {statistics.trend}%
            </Text>
            <Text style={styles.statLabel}>vs. Last Period</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Hourly Consumption</Text>
        <View style={styles.chartCard}>
          <LineChart
            data={hourlyData}
            width={screenWidth - 40}
            height={220}
            yAxisSuffix=" kWh"
            chartConfig={{
              backgroundColor: '#FFFFFF',
              backgroundGradientFrom: '#FFFFFF',
              backgroundGradientTo: '#FFFFFF',
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(71, 85, 105, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '5',
                strokeWidth: '2',
                stroke: '#3B82F6',
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>

        {renderBreakdownChart()}

        <View style={styles.insightsCard}>
          <Text style={styles.insightsTitle}>Insights & Recommendations</Text>
          
          <View style={styles.insightItem}>
            <View style={[styles.insightDot, { backgroundColor: '#22C55E' }]} />
            <Text style={styles.insightText}>
              Your energy usage is 8% lower than last week. Great progress!
            </Text>
          </View>
          
          <View style={styles.insightItem}>
            <View style={[styles.insightDot, { backgroundColor: '#F59E0B' }]} />
            <Text style={styles.insightText}>
              Your peak usage is between 6-8 PM. Consider shifting some activities to off-peak hours.
            </Text>
          </View>
          
          <View style={styles.insightItem}>
            <View style={[styles.insightDot, { backgroundColor: '#3B82F6' }]} />
            <Text style={styles.insightText}>
              Heating accounts for 35% of your energy usage. Consider lowering your thermostat by 1-2 degrees.
            </Text>
          </View>
          
          <View style={styles.carbonSaved}>
            <Text style={styles.carbonSavedText}>
              🌿 Your energy savings this month have reduced CO2 emissions by {statistics.co2Saved} kg!
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    marginBottom: 24,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activePeriod: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activePeriodText: {
    color: '#111827',
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  loader: {
    marginVertical: 60,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  breakdownContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  breakdownChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 200,
    alignItems: 'flex-end',
  },
  breakdownItem: {
    alignItems: 'center',
    width: '22%',
  },
  breakdownBarContainer: {
    height: 140,
    width: '50%',
    justifyContent: 'flex-end',
  },
  breakdownBar: {
    width: '100%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  breakdownPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginTop: 8,
  },
  breakdownCategory: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  insightsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  insightItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  insightDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginRight: 8,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  carbonSaved: {
    backgroundColor: '#ECFDF5',
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
  },
  carbonSavedText: {
    fontSize: 14,
    color: '#065F46',
    textAlign: 'center',
  },
}); 