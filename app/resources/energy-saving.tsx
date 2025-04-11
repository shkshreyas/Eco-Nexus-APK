import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Zap, ChevronLeft, ExternalLink, LightbulbIcon, Home, ThermometerIcon, Refrigerator, Tv } from 'lucide-react-native';
import { useTheme } from '@/context/theme';

export default function EnergySavingTips() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  
  const openCalculator = () => {
    router.push('/resources/carbon-calculator');
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: colors.accent }]}>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: colors.elevated }]}
          onPress={() => router.push('/resources')}
        >
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Energy Saving Tips</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={[styles.heroSection, { backgroundColor: colors.accent }]}>
          <View style={styles.iconContainer}>
            <Zap size={40} color="#FFFFFF" />
          </View>
          <Text style={styles.heroTitle}>Save Energy & Money</Text>
          <Text style={styles.heroSubtitle}>
            Simple changes that can significantly reduce your electricity bills and environmental impact
          </Text>
        </View>
        
        <View style={[styles.statsContainer, { backgroundColor: colors.card }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.accent }]}>30%</Text>
            <Text style={[styles.statLabel, { color: colors.secondaryText }]}>Average savings possible in a typical home</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#E5E7EB' }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.accent }]}>$840</Text>
            <Text style={[styles.statLabel, { color: colors.secondaryText }]}>Annual savings potential for the average household</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <LightbulbIcon size={20} color="#F59E0B" />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Lighting</Text>
          </View>
          
          <View style={[styles.tipCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.tipTitle, { color: colors.text }]}>Switch to LED Bulbs</Text>
            <Text style={[styles.tipDescription, { color: colors.secondaryText }]}>
              LED bulbs use up to 90% less energy than incandescent bulbs and last up to 25 times longer.
            </Text>
            <View style={[styles.savingsIndicator, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.2)' : '#FEF3C7' }]}>
              <Text style={styles.savingsText}>Savings: $$$</Text>
            </View>
          </View>
          
          <View style={[styles.tipCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.tipTitle, { color: colors.text }]}>Use Natural Light</Text>
            <Text style={[styles.tipDescription, { color: colors.secondaryText }]}>
              Open curtains during the day to use natural light instead of artificial lighting. Consider adding skylights in dark areas.
            </Text>
            <View style={[styles.savingsIndicator, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.2)' : '#FEF3C7' }]}>
              <Text style={styles.savingsText}>Savings: $$</Text>
            </View>
          </View>
          
          <View style={[styles.tipCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.tipTitle, { color: colors.text }]}>Install Motion Sensors</Text>
            <Text style={[styles.tipDescription, { color: colors.secondaryText }]}>
              Motion sensors automatically turn lights off when rooms are not in use, eliminating wasted energy.
            </Text>
            <View style={[styles.savingsIndicator, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.2)' : '#FEF3C7' }]}>
              <Text style={styles.savingsText}>Savings: $$</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThermometerIcon size={20} color="#EF4444" />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Heating & Cooling</Text>
          </View>
          
          <View style={[styles.tipCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.tipTitle, { color: colors.text }]}>Adjust Your Thermostat</Text>
            <Text style={[styles.tipDescription, { color: colors.secondaryText }]}>
              Setting your thermostat 7-10°F higher in summer and lower in winter for 8 hours a day can save up to 10% on heating and cooling costs.
            </Text>
            <View style={[styles.savingsIndicator, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.2)' : '#FEF3C7' }]}>
              <Text style={styles.savingsText}>Savings: $$$</Text>
            </View>
          </View>
          
          <View style={[styles.tipCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.tipTitle, { color: colors.text }]}>Seal Air Leaks</Text>
            <Text style={[styles.tipDescription, { color: colors.secondaryText }]}>
              Check windows, doors, and ductwork for air leaks. Use weatherstripping, caulk, or foam sealant to fix leaks.
            </Text>
            <View style={[styles.savingsIndicator, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.2)' : '#FEF3C7' }]}>
              <Text style={styles.savingsText}>Savings: $$$</Text>
            </View>
          </View>
          
          <View style={[styles.tipCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.tipTitle, { color: colors.text }]}>Maintain HVAC Systems</Text>
            <Text style={[styles.tipDescription, { color: colors.secondaryText }]}>
              Regularly replace air filters and schedule annual maintenance for your heating and cooling systems to ensure they operate efficiently.
            </Text>
            <View style={[styles.savingsIndicator, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.2)' : '#FEF3C7' }]}>
              <Text style={styles.savingsText}>Savings: $$</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Home size={20} color="#8B5CF6" />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Appliances & Electronics</Text>
          </View>
          
          <View style={[styles.tipCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.tipTitle, { color: colors.text }]}>Use Smart Power Strips</Text>
            <Text style={[styles.tipDescription, { color: colors.secondaryText }]}>
              Smart power strips eliminate phantom energy drain by shutting off power to devices when they're not in use.
            </Text>
            <View style={[styles.savingsIndicator, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.2)' : '#FEF3C7' }]}>
              <Text style={styles.savingsText}>Savings: $</Text>
            </View>
          </View>
          
          <View style={[styles.tipCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.tipTitle, { color: colors.text }]}>Wash Clothes in Cold Water</Text>
            <Text style={[styles.tipDescription, { color: colors.secondaryText }]}>
              Using cold water for laundry can save up to $60 per year and is just as effective for most loads.
            </Text>
            <View style={[styles.savingsIndicator, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.2)' : '#FEF3C7' }]}>
              <Text style={styles.savingsText}>Savings: $</Text>
            </View>
          </View>
          
          <View style={[styles.tipCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.tipTitle, { color: colors.text }]}>Choose ENERGY STAR® Appliances</Text>
            <Text style={[styles.tipDescription, { color: colors.secondaryText }]}>
              ENERGY STAR certified appliances use 10-50% less energy than standard models. Look for the label when replacing old appliances.
            </Text>
            <View style={[styles.savingsIndicator, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.2)' : '#FEF3C7' }]}>
              <Text style={styles.savingsText}>Savings: $$$</Text>
            </View>
          </View>
        </View>
        
        <View style={[styles.calculatorPromo, { 
          backgroundColor: isDark ? colors.elevated : '#E5E7EB',
          borderColor: colors.border 
        }]}>
          <Text style={[styles.calculatorPromoTitle, { color: colors.text }]}>Calculate Your Carbon Footprint</Text>
          <Text style={[styles.calculatorPromoText, { color: colors.secondaryText }]}>
            See how your energy choices impact the environment and find personalized ways to reduce your carbon footprint.
          </Text>
          <TouchableOpacity 
            style={[styles.calculatorButton, { backgroundColor: colors.primary }]}
            onPress={openCalculator}
          >
            <Text style={styles.calculatorButtonText}>Open Carbon Calculator</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.resourceLink}
          onPress={() => router.push('/(tabs)/resources')}
        >
          <Text style={[styles.resourceLinkText, { color: colors.primary }]}>View All Sustainability Resources</Text>
          <ExternalLink size={16} color={colors.primary} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statLabel: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    marginHorizontal: 16,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  tipCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  tipDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  savingsIndicator: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  savingsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#B45309',
  },
  calculatorPromo: {
    margin: 16,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
  },
  calculatorPromoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  calculatorPromoText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  calculatorButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  calculatorButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  resourceLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginVertical: 16,
  },
  resourceLinkText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
}); 