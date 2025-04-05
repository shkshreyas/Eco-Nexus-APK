import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { useAuth } from '@/context/auth';
import { useRouter } from 'expo-router';
import { BarChart } from 'react-native-chart-kit';
import { Leaf, MessageCircle, ThumbsUp, Home, BarChart3, Settings, LogOut } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

const screenWidth = Dimensions.get('window').width;

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [energyData, setEnergyData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [30, 45, 28, 80, 99, 43, 50],
      },
    ],
  });
  const [tips, setTips] = useState([
    {
      id: 1,
      title: 'Reduce Standby Power',
      description: 'Unplug devices or use power strips to reduce standby power consumption.',
      likes: 24,
      comments: 7,
    },
    {
      id: 2,
      title: 'Use LED Lighting',
      description: 'Replace traditional bulbs with LED lights to save up to 80% energy.',
      likes: 42,
      comments: 13,
    },
    {
      id: 3,
      title: 'Optimize Heating & Cooling',
      description: 'Set your thermostat 2 degrees lower in winter and higher in summer.',
      likes: 18,
      comments: 5,
    },
  ]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      try {
        // Fetch energy readings data from Supabase
        const { data: energyReadings, error: energyError } = await supabase
          .from('energy_readings')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(7);

        if (energyError) throw energyError;

        if (energyReadings && energyReadings.length > 0) {
          const labels = energyReadings.map(reading => {
            const date = new Date(reading.timestamp);
            return date.toLocaleDateString('en-US', { weekday: 'short' });
          });
          
          const data = energyReadings.map(reading => reading.value);
          
          setEnergyData({
            labels,
            datasets: [{ data }],
          });
        }
      } catch (dbError) {
        // If the table doesn't exist, we'll use the mock data already set in state
        console.log('Using mock energy data:', dbError);
      }

      try {
        // Fetch alerts
        const { data: alertsData, error: alertsError } = await supabase
          .from('alerts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (alertsError) throw alertsError;
        
        if (alertsData) {
          setAlerts(alertsData);
        }
      } catch (dbError) {
        // If the table doesn't exist, we'll keep the empty alerts array
        console.log('Using mock alerts data:', dbError);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserData();
  };

  const handleLike = (tipId) => {
    setTips(prevTips => 
      prevTips.map(tip => 
        tip.id === tipId ? { ...tip, likes: tip.likes + 1 } : tip
      )
    );
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#22C55E" style={styles.loader} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#22C55E']}
          />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user.email.split('@')[0]}</Text>
            <Text style={styles.subGreeting}>Dashboard Overview</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileIcon}
            onPress={() => router.push('/profile')}
          >
            <Text style={styles.profileInitial}>{user.email[0].toUpperCase()}</Text>
          </TouchableOpacity>
        </View>

        {/* Energy Usage Tracker */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Energy Usage Tracker</Text>
            <TouchableOpacity 
              style={styles.viewMoreButton}
              onPress={() => router.push('/energy-details')}
            >
              <Text style={styles.viewMoreText}>View More</Text>
            </TouchableOpacity>
          </View>
          
          {loading ? (
            <ActivityIndicator size="large" color="#22C55E" style={styles.loader} />
          ) : (
            <>
              <Text style={styles.chartTitle}>Weekly Energy Consumption (kWh)</Text>
              <BarChart
                data={energyData}
                width={screenWidth - 50}
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
              <View style={styles.energySummary}>
                <View style={styles.energyMetric}>
                  <Text style={styles.energyValue}>375</Text>
                  <Text style={styles.energyLabel}>kWh Total</Text>
                </View>
                <View style={styles.energyMetric}>
                  <Text style={styles.energyValue}>54</Text>
                  <Text style={styles.energyLabel}>kWh Avg</Text>
                </View>
                <View style={styles.energyMetric}>
                  <Text style={styles.energyTrend}>-12%</Text>
                  <Text style={styles.energyLabel}>vs. Last Week</Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Sustainability Tips */}
        <Text style={styles.sectionTitle}>Sustainability Tips</Text>
        {tips.map(tip => (
          <View key={tip.id} style={styles.tipCard}>
            <Text style={styles.tipTitle}>{tip.title}</Text>
            <Text style={styles.tipDescription}>{tip.description}</Text>
            <View style={styles.tipActions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleLike(tip.id)}
              >
                <ThumbsUp size={18} color="#22C55E" />
                <Text style={styles.actionText}>{tip.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <MessageCircle size={18} color="#22C55E" />
                <Text style={styles.actionText}>{tip.comments}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Recent Alerts */}
        <Text style={styles.sectionTitle}>Recent Alerts</Text>
        {alerts.length > 0 ? (
          alerts.map((alert, index) => (
            <View key={index} style={styles.alertCard}>
              <View style={[styles.alertIndicator, 
                { backgroundColor: alert.severity === 'high' ? '#EF4444' : 
                  alert.severity === 'medium' ? '#F59E0B' : '#22C55E' }]} />
              <View style={styles.alertContent}>
                <Text style={styles.alertTitle}>{alert.title}</Text>
                <Text style={styles.alertDescription}>{alert.description}</Text>
                <Text style={styles.alertTime}>
                  {new Date(alert.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No recent alerts</Text>
          </View>
        )}
        
        {/* Resources Section */}
        <Text style={styles.sectionTitle}>Sustainable Development Resources</Text>
        <View style={styles.resourcesContainer}>
          <TouchableOpacity style={styles.resourceCard}>
            <View style={[styles.resourceIcon, { backgroundColor: '#E0F2FE' }]}>
              <Leaf size={24} color="#0EA5E9" />
            </View>
            <Text style={styles.resourceTitle}>Green Living Guide</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.resourceCard}>
            <View style={[styles.resourceIcon, { backgroundColor: '#FEF3C7' }]}>
              <BarChart3 size={24} color="#F59E0B" />
            </View>
            <Text style={styles.resourceTitle}>Energy Saving Tips</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.resourceCard}>
            <View style={[styles.resourceIcon, { backgroundColor: '#DCFCE7' }]}>
              <Settings size={24} color="#22C55E" />
            </View>
            <Text style={styles.resourceTitle}>Carbon Calculator</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Home size={24} color="#22C55E" />
          <Text style={[styles.navText, styles.activeNavText]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/energy-details')}
        >
          <BarChart3 size={24} color="#94A3B8" />
          <Text style={styles.navText}>Energy</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/resources')}
        >
          <Leaf size={24} color="#94A3B8" />
          <Text style={styles.navText}>Resources</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/profile')}
        >
          <Settings size={24} color="#94A3B8" />
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 80, // Space for bottom nav
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  subGreeting: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  profileIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  viewMoreButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  viewMoreText: {
    color: '#22C55E',
    fontSize: 14,
    fontWeight: '500',
  },
  loader: {
    marginVertical: 40,
  },
  chartTitle: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 8,
    textAlign: 'center',
  },
  energySummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  energyMetric: {
    alignItems: 'center',
  },
  energyValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  energyTrend: {
    fontSize: 20,
    fontWeight: '700',
    color: '#22C55E',
  },
  energyLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    marginTop: 8,
  },
  tipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  tipDescription: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 12,
  },
  tipActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    marginLeft: 6,
    color: '#6B7280',
    fontSize: 14,
  },
  alertCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 1,
    flexDirection: 'row',
  },
  alertIndicator: {
    width: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  alertDescription: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
  },
  alertTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
  },
  resourcesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  resourceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '31%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 1,
  },
  resourceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  resourceTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#111827',
    textAlign: 'center',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
  activeNavText: {
    color: '#22C55E',
    fontWeight: '500',
  },
}); 