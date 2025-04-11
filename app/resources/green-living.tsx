import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Leaf, ChevronLeft, ExternalLink } from 'lucide-react-native';
import { useTheme } from '@/context/theme';

export default function GreenLivingGuide() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/resources')}
        >
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Green Living Guide</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={[styles.heroSection, { backgroundColor: colors.primary }]}>
          <View style={styles.iconContainer}>
            <Leaf size={40} color="#FFFFFF" />
          </View>
          <Text style={styles.heroTitle}>Sustainable Living Practices</Text>
          <Text style={styles.heroSubtitle}>
            Simple ways to reduce your environmental footprint and live more sustainably
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Home Energy Efficiency</Text>
          
          <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>Switch to LED Lighting</Text>
            <Text style={[styles.infoDescription, { color: colors.secondaryText }]}>
              LED bulbs use up to 80% less energy than traditional incandescent bulbs and last up to 25 times longer.
            </Text>
            <View style={[styles.tipBox, { 
              backgroundColor: isDark ? 'rgba(34, 197, 94, 0.2)' : '#ECFDF5',
              borderLeftColor: colors.primary
            }]}>
              <Text style={[styles.tipText, { 
                color: isDark ? colors.primary : '#065F46'
              }]}>
                TIP: Replace your most frequently used light fixtures with ENERGY STAR-rated LEDs for the biggest savings.
              </Text>
            </View>
          </View>
          
          <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>Smart Thermostats</Text>
            <Text style={[styles.infoDescription, { color: colors.secondaryText }]}>
              Installing a smart thermostat can reduce your heating and cooling costs by automatically adjusting temperatures when you're away or asleep.
            </Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Waste Reduction</Text>
          
          <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>Reduce Single-Use Plastics</Text>
            <Text style={[styles.infoDescription, { color: colors.secondaryText }]}>
              Replace disposable items with reusable alternatives: cloth shopping bags, stainless steel water bottles, reusable food containers, and beeswax wraps.
            </Text>
          </View>
          
          <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>Composting Basics</Text>
            <Text style={[styles.infoDescription, { color: colors.secondaryText }]}>
              Up to 30% of household waste can be composted. Start a compost bin for food scraps and yard waste to create nutrient-rich soil for your garden.
            </Text>
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1592218723352-c3b5b0145b20?q=80&w=2070' }} 
                style={styles.image} 
                resizeMode="cover"
              />
              <Text style={[styles.imageCaption, { color: colors.secondaryText }]}>Simple home composting setup</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Water Conservation</Text>
          
          <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>Low-Flow Fixtures</Text>
            <Text style={[styles.infoDescription, { color: colors.secondaryText }]}>
              Install low-flow showerheads and faucet aerators to reduce water usage by up to 60% without sacrificing performance.
            </Text>
          </View>
          
          <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>Rainwater Harvesting</Text>
            <Text style={[styles.infoDescription, { color: colors.secondaryText }]}>
              Collect rainwater in barrels for watering plants and gardens. This reduces water bills and helps preserve local water supplies.
            </Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Eco-Friendly Shopping</Text>
          
          <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>Buy Local</Text>
            <Text style={[styles.infoDescription, { color: colors.secondaryText }]}>
              Support local farmers markets and businesses to reduce transportation emissions and strengthen your local economy.
            </Text>
          </View>
          
          <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>Choose Sustainable Products</Text>
            <Text style={[styles.infoDescription, { color: colors.secondaryText }]}>
              Look for eco-labels like ENERGY STAR, WaterSense, FSC certified wood, and USDA Organic when shopping.
            </Text>
          </View>
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
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  tipBox: {
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
  },
  imageContainer: {
    marginTop: 12,
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  imageCaption: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
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