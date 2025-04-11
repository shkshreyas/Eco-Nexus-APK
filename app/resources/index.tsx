import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Book,
  ExternalLink,
  Globe,
  FileText,
  Video,
  Award,
  Leaf,
  BarChart3,
  Settings,
  ArrowLeft,
} from 'lucide-react-native';
import { useTheme } from '@/context/theme';

export default function ResourcesIndex() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  useEffect(() => {
    const backAction = () => {
      router.push('/');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [router]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={[
              styles.backButton,
              {
                backgroundColor: isDark
                  ? colors.settingsIconBackground
                  : 'transparent',
              },
            ]}
            onPress={() => router.push('/')}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              Environmental Resources
            </Text>
            <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
              Discover information, guides and tools to support your
              environmental actions
            </Text>
          </View>
        </View>

        {/* Our Custom Resources */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            EcoNexus Guides
          </Text>

          <TouchableOpacity
            style={[styles.resourceCard, { backgroundColor: colors.card }]}
            onPress={() => router.push('/resources/green-living')}
          >
            <View
              style={[
                styles.resourceIconContainer,
                { backgroundColor: '#22C55E' },
              ]}
            >
              <Leaf size={24} color="#FFFFFF" />
            </View>
            <View style={styles.resourceContent}>
              <Text style={[styles.resourceTitle, { color: colors.text }]}>
                Green Living Guide
              </Text>
              <Text
                style={[
                  styles.resourceDescription,
                  { color: colors.secondaryText },
                ]}
              >
                Practical tips for living more sustainably and reducing your
                environmental footprint.
              </Text>
              <View style={styles.resourceMeta}>
                <Text
                  style={[
                    styles.resourceMetaText,
                    { color: colors.secondaryText },
                  ]}
                >
                  EcoNexus Guide
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.resourceCard, { backgroundColor: colors.card }]}
            onPress={() => router.push('/resources/energy-saving')}
          >
            <View
              style={[
                styles.resourceIconContainer,
                { backgroundColor: '#F59E0B' },
              ]}
            >
              <BarChart3 size={24} color="#FFFFFF" />
            </View>
            <View style={styles.resourceContent}>
              <Text style={[styles.resourceTitle, { color: colors.text }]}>
                Energy Saving Tips
              </Text>
              <Text
                style={[
                  styles.resourceDescription,
                  { color: colors.secondaryText },
                ]}
              >
                Simple ways to reduce your energy consumption and save money on
                utility bills.
              </Text>
              <View style={styles.resourceMeta}>
                <Text
                  style={[
                    styles.resourceMetaText,
                    { color: colors.secondaryText },
                  ]}
                >
                  EcoNexus Guide
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.resourceCard, { backgroundColor: colors.card }]}
            onPress={() => router.push('/resources/carbon-calculator')}
          >
            <View
              style={[
                styles.resourceIconContainer,
                { backgroundColor: '#22C55E' },
              ]}
            >
              <Settings size={24} color="#FFFFFF" />
            </View>
            <View style={styles.resourceContent}>
              <Text style={[styles.resourceTitle, { color: colors.text }]}>
                Carbon Footprint Calculator
              </Text>
              <Text
                style={[
                  styles.resourceDescription,
                  { color: colors.secondaryText },
                ]}
              >
                Calculate your personal carbon footprint and get personalized
                recommendations.
              </Text>
              <View style={styles.resourceMeta}>
                <Text
                  style={[
                    styles.resourceMetaText,
                    { color: colors.secondaryText },
                  ]}
                >
                  Interactive Tool
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Learning Materials
          </Text>

          <TouchableOpacity
            style={[styles.resourceCard, { backgroundColor: colors.card }]}
            onPress={() =>
              Linking.openURL('https://www.un.org/sustainabledevelopment/')
            }
          >
            <View
              style={[
                styles.resourceIconContainer,
                { backgroundColor: isDark ? '#1D4ED8' : '#2563EB' },
              ]}
            >
              <Globe size={24} color="#FFFFFF" />
            </View>
            <View style={styles.resourceContent}>
              <Text style={[styles.resourceTitle, { color: colors.text }]}>
                UN Sustainable Development Goals
              </Text>
              <Text
                style={[
                  styles.resourceDescription,
                  { color: colors.secondaryText },
                ]}
              >
                Learn about the 17 Sustainable Development Goals from the United
                Nations.
              </Text>
              <View style={styles.resourceMeta}>
                <ExternalLink size={14} color={colors.secondaryText} />
                <Text
                  style={[
                    styles.resourceMetaText,
                    { color: colors.secondaryText },
                  ]}
                >
                  un.org
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.resourceCard, { backgroundColor: colors.card }]}
            onPress={() =>
              Linking.openURL(
                'https://education.nationalgeographic.org/resource/conservation/'
              )
            }
          >
            <View
              style={[
                styles.resourceIconContainer,
                { backgroundColor: '#0EA5E9' },
              ]}
            >
              <Book size={24} color="#FFFFFF" />
            </View>
            <View style={styles.resourceContent}>
              <Text style={[styles.resourceTitle, { color: colors.text }]}>
                Conservation Guide
              </Text>
              <Text
                style={[
                  styles.resourceDescription,
                  { color: colors.secondaryText },
                ]}
              >
                Comprehensive guide on conservation practices and principles.
              </Text>
              <View style={styles.resourceMeta}>
                <ExternalLink size={14} color={colors.secondaryText} />
                <Text
                  style={[
                    styles.resourceMetaText,
                    { color: colors.secondaryText },
                  ]}
                >
                  nationalgeographic.org
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Videos & Documentaries
          </Text>

          <TouchableOpacity
            style={[styles.resourceCard, { backgroundColor: colors.card }]}
            onPress={() =>
              Linking.openURL('https://www.youtube.com/watch?v=0Puv0Pss33M')
            }
          >
            <View
              style={[
                styles.resourceIconContainer,
                { backgroundColor: '#EF4444' },
              ]}
            >
              <Video size={24} color="#FFFFFF" />
            </View>
            <View style={styles.resourceContent}>
              <Text style={[styles.resourceTitle, { color: colors.text }]}>
                Climate Change Explained
              </Text>
              <Text
                style={[
                  styles.resourceDescription,
                  { color: colors.secondaryText },
                ]}
              >
                An educational video explaining the science behind climate
                change.
              </Text>
              <View style={styles.resourceMeta}>
                <ExternalLink size={14} color={colors.secondaryText} />
                <Text
                  style={[
                    styles.resourceMetaText,
                    { color: colors.secondaryText },
                  ]}
                >
                  youtube.com
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.resourceCard, { backgroundColor: colors.card }]}
            onPress={() =>
              Linking.openURL(
                'https://www.documentaryarea.tv/category/environment/'
              )
            }
          >
            <View
              style={[
                styles.resourceIconContainer,
                { backgroundColor: '#8B5CF6' },
              ]}
            >
              <Video size={24} color="#FFFFFF" />
            </View>
            <View style={styles.resourceContent}>
              <Text style={[styles.resourceTitle, { color: colors.text }]}>
                Environmental Documentaries
              </Text>
              <Text
                style={[
                  styles.resourceDescription,
                  { color: colors.secondaryText },
                ]}
              >
                Collection of insightful documentaries about environmental
                issues.
              </Text>
              <View style={styles.resourceMeta}>
                <ExternalLink size={14} color={colors.secondaryText} />
                <Text
                  style={[
                    styles.resourceMetaText,
                    { color: colors.secondaryText },
                  ]}
                >
                  documentaryarea.tv
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Tools & Calculators
          </Text>

          <TouchableOpacity
            style={[styles.resourceCard, { backgroundColor: colors.card }]}
            onPress={() =>
              Linking.openURL('https://www.footprintcalculator.org/')
            }
          >
            <View
              style={[
                styles.resourceIconContainer,
                { backgroundColor: '#F59E0B' },
              ]}
            >
              <FileText size={24} color="#FFFFFF" />
            </View>
            <View style={styles.resourceContent}>
              <Text style={[styles.resourceTitle, { color: colors.text }]}>
                Ecological Footprint Calculator
              </Text>
              <Text
                style={[
                  styles.resourceDescription,
                  { color: colors.secondaryText },
                ]}
              >
                Calculate your personal impact on the environment and learn how
                to reduce it.
              </Text>
              <View style={styles.resourceMeta}>
                <ExternalLink size={14} color={colors.secondaryText} />
                <Text
                  style={[
                    styles.resourceMetaText,
                    { color: colors.secondaryText },
                  ]}
                >
                  footprintcalculator.org
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.resourceCard, { backgroundColor: colors.card }]}
            onPress={() =>
              Linking.openURL(
                'https://www.epa.gov/watersense/watersense-calculator'
              )
            }
          >
            <View
              style={[
                styles.resourceIconContainer,
                { backgroundColor: '#3B82F6' },
              ]}
            >
              <FileText size={24} color="#FFFFFF" />
            </View>
            <View style={styles.resourceContent}>
              <Text style={[styles.resourceTitle, { color: colors.text }]}>
                Water Usage Calculator
              </Text>
              <Text
                style={[
                  styles.resourceDescription,
                  { color: colors.secondaryText },
                ]}
              >
                Calculate your water usage and find ways to conserve this
                precious resource.
              </Text>
              <View style={styles.resourceMeta}>
                <ExternalLink size={14} color={colors.secondaryText} />
                <Text
                  style={[
                    styles.resourceMetaText,
                    { color: colors.secondaryText },
                  ]}
                >
                  epa.gov
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Organizations & Certifications
          </Text>

          <TouchableOpacity
            style={[styles.resourceCard, { backgroundColor: colors.card }]}
            onPress={() => Linking.openURL('https://www.worldwildlife.org/')}
          >
            <View
              style={[
                styles.resourceIconContainer,
                { backgroundColor: '#22C55E' },
              ]}
            >
              <Award size={24} color="#FFFFFF" />
            </View>
            <View style={styles.resourceContent}>
              <Text style={[styles.resourceTitle, { color: colors.text }]}>
                World Wildlife Fund
              </Text>
              <Text
                style={[
                  styles.resourceDescription,
                  { color: colors.secondaryText },
                ]}
              >
                Leading organization in wildlife conservation and endangered
                species protection.
              </Text>
              <View style={styles.resourceMeta}>
                <ExternalLink size={14} color={colors.secondaryText} />
                <Text
                  style={[
                    styles.resourceMetaText,
                    { color: colors.secondaryText },
                  ]}
                >
                  worldwildlife.org
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.resourceCard, { backgroundColor: colors.card }]}
            onPress={() => Linking.openURL('https://www.energystar.gov/')}
          >
            <View
              style={[
                styles.resourceIconContainer,
                { backgroundColor: '#3B82F6' },
              ]}
            >
              <Award size={24} color="#FFFFFF" />
            </View>
            <View style={styles.resourceContent}>
              <Text style={[styles.resourceTitle, { color: colors.text }]}>
                ENERGY STAR
              </Text>
              <Text
                style={[
                  styles.resourceDescription,
                  { color: colors.secondaryText },
                ]}
              >
                Government-backed symbol for energy efficiency, helping save
                money and protect the environment.
              </Text>
              <View style={styles.resourceMeta}>
                <ExternalLink size={14} color={colors.secondaryText} />
                <Text
                  style={[
                    styles.resourceMetaText,
                    { color: colors.secondaryText },
                  ]}
                >
                  energystar.gov
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 4,
  },
  header: {
    padding: 16,
    paddingTop: 8,
    marginBottom: 16,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  resourceCard: {
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
  resourceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  resourceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resourceMetaText: {
    fontSize: 12,
    marginLeft: 4,
  },
});
