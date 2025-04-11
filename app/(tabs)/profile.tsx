import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Award, Calendar, MapPin } from 'lucide-react-native';
import { useAuth } from '@/context/auth';
import { useState, useEffect } from 'react';

export default function ProfileScreen() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState('User');

  useEffect(() => {
    // Extract name from email if no user metadata exists
    // Format: user's name is the part before @ in the email
    if (user?.email) {
      const emailName = user.email.split('@')[0];
      // Capitalize first letter of each word
      const formattedName = emailName
        .split(/[._-]/)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(' ');
      setDisplayName(formattedName);
    }
  }, [user]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330' }}
            style={styles.profileImage}
          />
          <Text style={styles.name}>{displayName}</Text>
          <View style={styles.locationContainer}>
            <MapPin size={16} color="#6B7280" />
            <Text style={styles.location}>San Francisco, CA</Text>
          </View>
          <Text style={styles.bio}>
            Passionate about environmental conservation and community development. 
            Together we can make a difference! 🌱
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>2,450</Text>
            <Text style={styles.statLabel}>Green Points</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>28</Text>
            <Text style={styles.statLabel}>Quests</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>156</Text>
            <Text style={styles.statLabel}>Impact</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Badges</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgeScroll}>
            <View style={styles.badge}>
              <Award size={32} color="#22C55E" />
              <Text style={styles.badgeTitle}>Tree Planter</Text>
            </View>
            <View style={styles.badge}>
              <Award size={32} color="#22C55E" />
              <Text style={styles.badgeTitle}>Beach Cleaner</Text>
            </View>
            <View style={styles.badge}>
              <Award size={32} color="#22C55E" />
              <Text style={styles.badgeTitle}>Eco Warrior</Text>
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <Calendar size={20} color="#6B7280" />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Planted 5 trees at Central Park</Text>
              <Text style={styles.activityTime}>2 days ago</Text>
            </View>
          </View>
          <View style={styles.activityCard}>
            <Calendar size={20} color="#6B7280" />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Completed Beach Cleanup Quest</Text>
              <Text style={styles.activityTime}>5 days ago</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  location: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 4,
  },
  bio: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  badgeScroll: {
    flexDirection: 'row',
  },
  badge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginRight: 12,
    width: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  badgeTitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activityContent: {
    marginLeft: 12,
  },
  activityTitle: {
    fontSize: 16,
    color: '#111827',
  },
  activityTime: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
});