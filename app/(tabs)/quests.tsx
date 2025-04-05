import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trophy } from 'lucide-react-native';

export default function QuestsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Active Quests</Text>
          <View style={styles.statsContainer}>
            <Trophy color="#22C55E" size={24} />
            <Text style={styles.statsText}>5 Quests Completed</Text>
          </View>
        </View>

        <View style={styles.questList}>
          <View style={styles.questCard}>
            <View style={styles.questHeader}>
              <Text style={styles.questTitle}>Plant 100 Trees</Text>
              <Text style={styles.questPoints}>+500 Points</Text>
            </View>
            <Text style={styles.questDescription}>
              Help combat climate change by planting trees in your community
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '45%' }]} />
            </View>
            <Text style={styles.progressText}>45/100 Trees Planted</Text>
          </View>

          <View style={styles.questCard}>
            <View style={styles.questHeader}>
              <Text style={styles.questTitle}>Teach 50 Students</Text>
              <Text style={styles.questPoints}>+300 Points</Text>
            </View>
            <Text style={styles.questDescription}>
              Share your knowledge and help students learn new skills
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '60%' }]} />
            </View>
            <Text style={styles.progressText}>30/50 Students Taught</Text>
          </View>

          <View style={styles.questCard}>
            <View style={styles.questHeader}>
              <Text style={styles.questTitle}>Clean Beach Challenge</Text>
              <Text style={styles.questPoints}>+200 Points</Text>
            </View>
            <Text style={styles.questDescription}>
              Remove plastic waste from local beaches and protect marine life
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '25%' }]} />
            </View>
            <Text style={styles.progressText}>25/100 kg Collected</Text>
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
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  statsText: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 8,
  },
  questList: {
    padding: 20,
  },
  questCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  questHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  questTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  questPoints: {
    fontSize: 16,
    color: '#22C55E',
    fontWeight: '600',
  },
  questDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22C55E',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
});