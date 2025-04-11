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
import { useTheme } from '@/context/theme';
import { BarChart } from 'react-native-chart-kit';
import { fetchEnergyReadings } from '@/lib/supabase';
import { ArrowLeft, Calendar, TrendingDown, TrendingUp, Clock, Zap } from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;

export default function EnergyDetailsScreen() {
  const { user } = useAuth();
  const { colors, isDark } = useTheme();
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
        color: (opacity = 1) => 'rgba(65, 105, 225, ' + opacity + ')',
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

  // Add animated CO2 counter simulation
  const [animatedCO2, setAnimatedCO2] = useState(statistics.co2Saved);
  
  useEffect(() => {
    // Simulate animated CO2 counter
    let direction = 1;
    const interval = setInterval(() => {
      setAnimatedCO2(prev => {
        const newValue = prev + (0.1 * direction);
        if (newValue >= statistics.co2Saved + 2) direction = -1;
        if (newValue <= statistics.co2Saved - 2) direction = 1;
        return parseFloat(newValue.toFixed(1));
      });
    }, 2000);
    
    return () => clearInterval(interval);
  }, [statistics.co2Saved]);

  useEffect(() => {
    loadEnergyData();
  }, [period]);

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      if (!loading && period === 'day') {
        // Add slight random variations to create "live" effect for day view
        const updatedData = {
          ...hourlyData,
          datasets: [{
            ...hourlyData.datasets[0],
            data: hourlyData.datasets[0].data.map(value => 
              Math.max(1, value + (Math.random() > 0.5 ? 1 : -1) * Math.random() * 2)
            )
          }]
        };
        setHourlyData(updatedData);
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [loading, period, hourlyData]);

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
      <View style={[styles.breakdownContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.breakdownTitle, { color: colors.text }]}>Usage Breakdown</Text>
        <View style={styles.breakdownChart}>
          {usageBreakdown.map((item, index) => (
            <View key={index} style={styles.breakdownItem}>
              <View style={styles.breakdownBarContainer}>
                <View 
                  style={[
                    styles.breakdownBar, 
                    { 
                      height: (item.percentage / 100) * 140,
                      backgroundColor: item.color 
                    }
                  ]} 
                />
              </View>
              <Text style={[styles.breakdownPercentage, { color: colors.text }]}>{item.percentage}%</Text>
              <Text style={[styles.breakdownCategory, { color: colors.secondaryText }]}>{item.category}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const getBarColor = (value: number, maxValue: number) => {
    const percentage = value / maxValue;
    
    if (percentage > 0.7) return '#EF4444'; // Red for high usage
    if (percentage > 0.4) return '#F59E0B'; // Orange for medium usage
    return '#22C55E'; // Green for low usage
  };

  if (!user) {
    router.replace('/auth');
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: isDark ? colors.elevated : 'transparent' }]}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Energy Tracker</Text>
          <View style={{ width: 24 }} /> {/* Empty view for balance */}
        </View>

        <View style={[styles.periodSelector, { backgroundColor: colors.card }]}>
          <TouchableOpacity
            style={[
              styles.periodButton, 
              period === 'day' && [
                styles.activePeriod, 
                { backgroundColor: colors.primary }
              ]
            ]}
            onPress={() => setPeriod('day')}
          >
            <Text 
              style={[
                styles.periodButtonText, 
                { color: colors.secondaryText },
                period === 'day' && { color: 'white' }
              ]}
            >
              Day
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.periodButton, 
              period === 'week' && [
                styles.activePeriod, 
                { backgroundColor: colors.primary }
              ]
            ]}
            onPress={() => setPeriod('week')}
          >
            <Text 
              style={[
                styles.periodButtonText, 
                { color: colors.secondaryText },
                period === 'week' && { color: 'white' }
              ]}
            >
              Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.periodButton, 
              period === 'month' && [
                styles.activePeriod, 
                { backgroundColor: colors.primary }
              ]
            ]}
            onPress={() => setPeriod('month')}
          >
            <Text 
              style={[
                styles.periodButtonText, 
                { color: colors.secondaryText },
                period === 'month' && { color: 'white' }
              ]}
            >
              Month
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.chartCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>
            Energy Consumption ({period === 'day' ? 'Hourly' : period === 'week' ? 'Daily' : 'Weekly'})
          </Text>
          
          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
          ) : (
            <View style={styles.customChartContainer}>
              <View style={styles.customYAxis}>
                <Text style={[styles.axisLabel, { color: colors.secondaryText }]}>100 kWh</Text>
                <Text style={[styles.axisLabel, { color: colors.secondaryText }]}>75 kWh</Text>
                <Text style={[styles.axisLabel, { color: colors.secondaryText }]}>50 kWh</Text>
                <Text style={[styles.axisLabel, { color: colors.secondaryText }]}>25 kWh</Text>
                <Text style={[styles.axisLabel, { color: colors.secondaryText }]}>0 kWh</Text>
              </View>
              
              <View style={styles.barsContainer}>
                {energyData.labels.map((label, index) => {
                  const value = energyData.datasets[0].data[index];
                  const maxValue = Math.max(...energyData.datasets[0].data);
                  const heightPercentage = (value / maxValue) * 100;
                  
                  return (
                    <View key={index} style={styles.barColumn}>
                      <View style={styles.barAndValue}>
                        <Text style={[styles.valueLabel, { color: colors.text }]}>
                          {value}
                        </Text>
                        <View style={styles.barBackground}>
                          <View 
                            style={[
                              styles.barFill, 
                              { 
                                height: heightPercentage,
                                backgroundColor: getBarColor(value, maxValue),
                              }
                            ]} 
                          >
                            {period === 'day' && (
                              <View style={styles.liveIndicator} />
                            )}
                          </View>
                        </View>
                      </View>
                      <Text style={[styles.barLabel, { color: colors.secondaryText }]}>{label}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </View>

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <View style={[styles.statIconContainer, { backgroundColor: isDark ? 'rgba(34, 197, 94, 0.2)' : '#DCFCE7' }]}>
              <Calendar size={20} color="#22C55E" />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{statistics.averageDaily} kWh</Text>
            <Text style={[styles.statLabel, { color: colors.secondaryText }]}>Avg. Daily</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <View style={[styles.statIconContainer, { backgroundColor: isDark ? 'rgba(34, 197, 94, 0.2)' : '#DCFCE7' }]}>
              <Zap size={20} color="#22C55E" />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{statistics.totalMonthly} kWh</Text>
            <Text style={[styles.statLabel, { color: colors.secondaryText }]}>Monthly Total</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <View style={[styles.statIconContainer, { backgroundColor: isDark ? 'rgba(34, 197, 94, 0.2)' : '#DCFCE7' }]}>
              <Clock size={20} color="#22C55E" />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{statistics.peakTime}</Text>
            <Text style={[styles.statLabel, { color: colors.secondaryText }]}>Peak Usage</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <View style={[styles.statIconContainer, { backgroundColor: isDark ? 'rgba(34, 197, 94, 0.2)' : '#DCFCE7' }]}>
              {statistics.trend < 0 ? (
                <TrendingDown size={20} color="#22C55E" />
              ) : (
                <TrendingUp size={20} color="#EF4444" />
              )}
            </View>
            <Text 
              style={[
                styles.statValue, 
                { color: statistics.trend < 0 ? '#22C55E' : '#EF4444' },
                { color: colors.text }
              ]}
            >
              {statistics.trend}%
            </Text>
            <Text style={[styles.statLabel, { color: colors.secondaryText }]}>vs. Last Period</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Hourly Consumption</Text>
        <View style={[styles.chartCard, { backgroundColor: colors.card }]}>
          <View style={styles.hourlyChartContainer}>
            <View style={styles.hourlyChartHeader}>
              <Text style={[styles.hourlyChartTitle, { color: colors.text }]}>Live Power Usage</Text>
              <View style={styles.liveIndicatorContainer}>
                <View style={styles.liveDot} />
                <Text style={[styles.liveText, { color: colors.secondaryText }]}>Live</Text>
              </View>
            </View>
            
            <View style={styles.hourlyChartBody}>
              {hourlyData.datasets[0].data.map((value, index) => {
                const maxValue = Math.max(...hourlyData.datasets[0].data);
                const heightPercentage = (value / maxValue) * 100;
                return (
                  <View key={index} style={styles.hourlyBarColumn}>
                    <View style={styles.hourlyBarContainer}>
                      <Text style={[styles.hourlyValueLabel, { color: colors.text }]}>
                        {Math.round(value)} kWh
                      </Text>
                      <View style={[styles.hourlyBarBg, { backgroundColor: isDark ? 'rgba(75, 85, 99, 0.2)' : '#F3F4F6' }]}>
                        <View 
                          style={[
                            styles.hourlyBarFill, 
                            { 
                              height: heightPercentage,
                              backgroundColor: '#3B82F6',
                            }
                          ]} 
                        >
                          <View style={styles.pulsingDot} />
                        </View>
                      </View>
                      <Text style={[styles.hourlyTimeLabel, { color: colors.secondaryText }]}>
                        {hourlyData.labels[index]}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {renderBreakdownChart()}

        <View style={[styles.insightsCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.insightsTitle, { color: colors.text }]}>Insights & Recommendations</Text>
          
          <View style={styles.insightItem}>
            <View style={[styles.insightDot, { backgroundColor: '#22C55E' }]} />
            <Text style={[styles.insightText, { color: colors.secondaryText }]}>
              Your energy usage is 8% lower than last week. Great progress!
            </Text>
          </View>
          
          <View style={styles.insightItem}>
            <View style={[styles.insightDot, { backgroundColor: '#F59E0B' }]} />
            <Text style={[styles.insightText, { color: colors.secondaryText }]}>
              Your peak usage is between 6-8 PM. Consider shifting some activities to off-peak hours.
            </Text>
          </View>
          
          <View style={styles.insightItem}>
            <View style={[styles.insightDot, { backgroundColor: '#3B82F6' }]} />
            <Text style={[styles.insightText, { color: colors.secondaryText }]}>
              Heating accounts for 35% of your energy usage. Consider lowering your thermostat by 1-2 degrees.
            </Text>
          </View>
          
          <View style={[styles.carbonSaved, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : '#ECFDF5' }]}>
            <Text style={[styles.carbonSavedText, { color: isDark ? '#34D399' : '#065F46' }]}>
              🌿 Your energy savings this month have reduced CO2 emissions by <Text style={styles.carbonValue}>{animatedCO2}</Text> kg!
            </Text>
            <View style={styles.carbonGraph}>
              <View style={styles.carbonBarContainer}>
                <View style={[styles.carbonBar, { width: Math.min(100, (animatedCO2 / 150) * 100) }]} />
              </View>
              <View style={styles.carbonLabels}>
                <Text style={[styles.carbonLabel, { color: isDark ? '#34D399' : '#065F46' }]}>0</Text>
                <Text style={[styles.carbonLabel, { color: isDark ? '#34D399' : '#065F46' }]}>75</Text>
                <Text style={[styles.carbonLabel, { color: isDark ? '#34D399' : '#065F46' }]}>150 kg</Text>
              </View>
            </View>
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
    borderRadius: 10,
    padding: 16,
    marginTop: 8,
  },
  carbonSavedText: {
    fontSize: 14,
    color: '#065F46',
    marginBottom: 12,
  },
  carbonValue: {
    fontWeight: 'bold',
  },
  carbonGraph: {
    marginTop: 8,
  },
  carbonBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  carbonBar: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  carbonLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  carbonLabel: {
    fontSize: 10,
    color: '#065F46',
  },
  hourlyChartContainer: {
    padding: 10,
  },
  hourlyChartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  hourlyChartTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  liveIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
    marginRight: 6,
  },
  liveText: {
    fontSize: 12,
    fontWeight: '500',
  },
  hourlyChartBody: {
    flexDirection: 'row',
    height: 180,
    justifyContent: 'space-around',
  },
  hourlyBarColumn: {
    flex: 1,
    alignItems: 'center',
  },
  hourlyBarContainer: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 40,
  },
  hourlyValueLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginBottom: 4,
  },
  hourlyBarBg: {
    width: 20,
    height: '80%',
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  hourlyBarFill: {
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  hourlyTimeLabel: {
    fontSize: 10,
    marginTop: 8,
  },
  pulsingDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    opacity: 0.7,
  },
  customChartContainer: {
    height: 220,
    marginVertical: 10,
    flexDirection: 'row',
  },
  customYAxis: {
    width: 50,
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 5,
    paddingVertical: 10,
  },
  axisLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
  barsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  barColumn: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
    flex: 1,
  },
  barAndValue: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  valueLabel: {
    fontSize: 10,
    marginBottom: 2,
    fontWeight: '500',
  },
  barBackground: {
    width: 16,
    height: '100%',
    backgroundColor: 'rgba(229, 231, 235, 0.3)',
    borderRadius: 4,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  barLabel: {
    fontSize: 10,
    marginTop: 6,
    textAlign: 'center',
  },
  liveIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
    opacity: 0.8,
  },
}); 