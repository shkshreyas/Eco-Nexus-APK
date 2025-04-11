import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Settings, ChevronLeft, AlertCircle, Leaf } from 'lucide-react-native';
import { useTheme } from '@/context/theme';
import Slider from '@react-native-community/slider';

export default function CarbonCalculator() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  
  // State for form inputs
  const [electricity, setElectricity] = useState('');
  const [naturalGas, setNaturalGas] = useState('');
  const [carMiles, setCarMiles] = useState('');
  const [flights, setFlights] = useState('');
  const [meatConsumption, setMeatConsumption] = useState(3); // Scale of 1-5
  const [recycling, setRecycling] = useState(3); // Scale of 1-5
  
  // State for result
  const [showResults, setShowResults] = useState(false);
  const [carbonFootprint, setCarbonFootprint] = useState(0);
  const [categories, setCategories] = useState({
    energy: 0,
    transport: 0,
    food: 0,
    waste: 0,
  });
  
  const calculateFootprint = () => {
    // Simple calculation logic
    const energyFootprint = (Number(electricity) || 0) * 0.85 + (Number(naturalGas) || 0) * 0.5;
    const transportFootprint = (Number(carMiles) || 0) * 0.4 + (Number(flights) || 0) * 1100;
    const foodFootprint = meatConsumption * 500;
    const wasteFootprint = (6 - recycling) * 300; // Inverse scale (less recycling = more footprint)
    
    const total = energyFootprint + transportFootprint + foodFootprint + wasteFootprint;
    
    setCarbonFootprint(Math.round(total));
    setCategories({
      energy: Math.round(energyFootprint),
      transport: Math.round(transportFootprint),
      food: Math.round(foodFootprint),
      waste: Math.round(wasteFootprint),
    });
    
    setShowResults(true);
  };
  
  const resetCalculator = () => {
    setElectricity('');
    setNaturalGas('');
    setCarMiles('');
    setFlights('');
    setMeatConsumption(3);
    setRecycling(3);
    setShowResults(false);
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: isDark ? colors.settingsIconBackground : 'transparent' }]}
          onPress={() => router.push('/resources')}
        >
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Carbon Footprint Calculator</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {!showResults ? (
          <>
            <View style={[styles.introSection, { backgroundColor: colors.primary }]}>
              <View style={styles.iconContainer}>
                <Settings size={40} color="#FFFFFF" />
              </View>
              <Text style={styles.introTitle}>Measure Your Impact</Text>
              <Text style={styles.introText}>
                Enter your information below to estimate your annual carbon footprint in kilograms of CO₂ equivalent.
              </Text>
            </View>
            
            <View style={styles.formSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Home Energy Use</Text>
              
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.secondaryText }]}>Monthly Electricity Usage (kWh)</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: colors.card, 
                    color: colors.text,
                    borderColor: colors.border
                  }]}
                  value={electricity}
                  onChangeText={setElectricity}
                  placeholder="e.g., 900"
                  placeholderTextColor={colors.secondaryText}
                  keyboardType="number-pad"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.secondaryText }]}>Monthly Natural Gas (therms)</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: colors.card, 
                    color: colors.text,
                    borderColor: colors.border
                  }]}
                  value={naturalGas}
                  onChangeText={setNaturalGas}
                  placeholder="e.g., 50"
                  placeholderTextColor={colors.secondaryText}
                  keyboardType="number-pad"
                />
              </View>
              
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Transportation</Text>
              
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.secondaryText }]}>Weekly Car Miles</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: colors.card, 
                    color: colors.text,
                    borderColor: colors.border
                  }]}
                  value={carMiles}
                  onChangeText={setCarMiles}
                  placeholder="e.g., 150"
                  placeholderTextColor={colors.secondaryText}
                  keyboardType="number-pad"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.secondaryText }]}>Flights Per Year (round trips)</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: colors.card, 
                    color: colors.text,
                    borderColor: colors.border
                  }]}
                  value={flights}
                  onChangeText={setFlights}
                  placeholder="e.g., 2"
                  placeholderTextColor={colors.secondaryText}
                  keyboardType="number-pad"
                />
              </View>
              
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Food & Waste</Text>
              
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.secondaryText }]}>Meat Consumption</Text>
                <View style={styles.sliderLabels}>
                  <Text style={{ color: colors.secondaryText }}>Plant-based</Text>
                  <Text style={{ marginLeft: 'auto', color: colors.secondaryText }}>Heavy meat eater</Text>
                </View>
                <Slider
                  style={styles.slider}
                  minimumValue={1}
                  maximumValue={5}
                  step={1}
                  value={meatConsumption}
                  onValueChange={setMeatConsumption}
                  minimumTrackTintColor={colors.primary}
                  maximumTrackTintColor={isDark ? colors.border : "#D1D5DB"}
                  thumbTintColor={colors.primary}
                />
                <Text style={[styles.sliderValue, { color: colors.text }]}>{
                  meatConsumption === 1 ? 'Plant-based diet' :
                  meatConsumption === 2 ? 'Occasional meat' :
                  meatConsumption === 3 ? 'Moderate meat consumption' :
                  meatConsumption === 4 ? 'Regular meat eater' :
                  'Heavy meat consumption'
                }</Text>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.secondaryText }]}>Recycling Habits</Text>
                <View style={styles.sliderLabels}>
                  <Text style={{ color: colors.secondaryText }}>Never recycle</Text>
                  <Text style={{ marginLeft: 'auto', color: colors.secondaryText }}>Always recycle</Text>
                </View>
                <Slider
                  style={styles.slider}
                  minimumValue={1}
                  maximumValue={5}
                  step={1}
                  value={recycling}
                  onValueChange={setRecycling}
                  minimumTrackTintColor={colors.primary}
                  maximumTrackTintColor={isDark ? colors.border : "#D1D5DB"}
                  thumbTintColor={colors.primary}
                />
                <Text style={[styles.sliderValue, { color: colors.text }]}>{
                  recycling === 1 ? 'Never recycle' :
                  recycling === 2 ? 'Rarely recycle' :
                  recycling === 3 ? 'Sometimes recycle' :
                  recycling === 4 ? 'Often recycle' :
                  'Always recycle and compost'
                }</Text>
              </View>
              
              <TouchableOpacity 
                style={[styles.calculateButton, { backgroundColor: colors.primary }]}
                onPress={calculateFootprint}
              >
                <Text style={styles.calculateButtonText}>Calculate Footprint</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <View style={styles.resultsSection}>
              <View style={styles.resultHeader}>
                <Leaf size={28} color={colors.primary} />
                <Text style={[styles.resultTitle, { color: colors.text }]}>Your Carbon Footprint</Text>
              </View>
              
              <View style={styles.footprintValue}>
                <Text style={[styles.footprintNumber, { color: colors.primary }]}>{carbonFootprint}</Text>
                <Text style={[styles.footprintUnit, { color: colors.secondaryText }]}>kg CO₂e/year</Text>
              </View>
              
              <Text style={[styles.comparisonText, { color: colors.secondaryText }]}>
                {carbonFootprint < 6000 ? 
                  'Great job! Your footprint is lower than 80% of people.' :
                  carbonFootprint < 10000 ?
                  'Your footprint is around average. There are still ways to improve!' :
                  'Your footprint is higher than average. Consider the suggestions below to reduce it.'}
              </Text>
              
              <View style={[styles.categoriesContainer, { backgroundColor: colors.card }]}>
                <Text style={[styles.categoriesTitle, { color: colors.text }]}>Breakdown by Category</Text>
                
                <View style={styles.categoryRow}>
                  <View style={styles.categoryLabel}>
                    <View style={[styles.categoryDot, {backgroundColor: '#3B82F6'}]} />
                    <Text style={[styles.categoryText, { color: colors.secondaryText }]}>Home Energy</Text>
                  </View>
                  <Text style={[styles.categoryValue, { color: colors.text }]}>{categories.energy} kg</Text>
                </View>
                
                <View style={styles.categoryRow}>
                  <View style={styles.categoryLabel}>
                    <View style={[styles.categoryDot, {backgroundColor: '#F59E0B'}]} />
                    <Text style={[styles.categoryText, { color: colors.secondaryText }]}>Transportation</Text>
                  </View>
                  <Text style={[styles.categoryValue, { color: colors.text }]}>{categories.transport} kg</Text>
                </View>
                
                <View style={styles.categoryRow}>
                  <View style={styles.categoryLabel}>
                    <View style={[styles.categoryDot, {backgroundColor: '#EF4444'}]} />
                    <Text style={[styles.categoryText, { color: colors.secondaryText }]}>Food Choices</Text>
                  </View>
                  <Text style={[styles.categoryValue, { color: colors.text }]}>{categories.food} kg</Text>
                </View>
                
                <View style={styles.categoryRow}>
                  <View style={styles.categoryLabel}>
                    <View style={[styles.categoryDot, {backgroundColor: '#8B5CF6'}]} />
                    <Text style={[styles.categoryText, { color: colors.secondaryText }]}>Waste & Recycling</Text>
                  </View>
                  <Text style={[styles.categoryValue, { color: colors.text }]}>{categories.waste} kg</Text>
                </View>
              </View>
              
              <View style={[styles.suggestionsContainer, { backgroundColor: colors.card }]}>
                <Text style={[styles.suggestionsTitle, { color: colors.text }]}>How to Reduce Your Footprint</Text>
                
                {categories.energy > 2000 && (
                  <View style={styles.suggestionItem}>
                    <AlertCircle size={16} color="#3B82F6" />
                    <Text style={[styles.suggestionText, { color: colors.secondaryText }]}>Switch to LED bulbs and energy-efficient appliances</Text>
                  </View>
                )}
                
                {categories.transport > 3000 && (
                  <View style={styles.suggestionItem}>
                    <AlertCircle size={16} color="#F59E0B" />
                    <Text style={[styles.suggestionText, { color: colors.secondaryText }]}>Consider carpooling, public transit, or a more fuel-efficient vehicle</Text>
                  </View>
                )}
                
                {categories.food > 1500 && (
                  <View style={styles.suggestionItem}>
                    <AlertCircle size={16} color="#EF4444" />
                    <Text style={[styles.suggestionText, { color: colors.secondaryText }]}>Try meat-free days and buy local, seasonal food</Text>
                  </View>
                )}
                
                {categories.waste > 1000 && (
                  <View style={styles.suggestionItem}>
                    <AlertCircle size={16} color="#8B5CF6" />
                    <Text style={[styles.suggestionText, { color: colors.secondaryText }]}>Improve recycling habits and reduce single-use plastics</Text>
                  </View>
                )}
              </View>
              
              <TouchableOpacity 
                style={[styles.resetButton, { backgroundColor: isDark ? colors.elevated : '#E5E7EB' }]}
                onPress={resetCalculator}
              >
                <Text style={[styles.resetButtonText, { color: colors.text }]}>Recalculate</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.resourcesButton, { backgroundColor: colors.primary }]}
                onPress={() => router.push('/resources/energy-saving')}
              >
                <Text style={styles.resourcesButtonText}>View Energy Saving Tips</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        
        <TouchableOpacity 
          style={styles.resourceLink}
          onPress={() => router.push('/(tabs)/resources')}
        >
          <Text style={[styles.resourceLinkText, { color: colors.primary }]}>View All Sustainability Resources</Text>
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
  introSection: {
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
  introTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  introText: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 22,
  },
  formSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    fontSize: 16,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    fontSize: 12,
  },
  slider: {
    height: 40,
  },
  sliderValue: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 14,
  },
  calculateButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  calculateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsSection: {
    padding: 16,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  footprintValue: {
    alignItems: 'center',
    marginBottom: 24,
  },
  footprintNumber: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  footprintUnit: {
    fontSize: 16,
  },
  comparisonText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  categoriesContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 16,
  },
  categoryValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  suggestionsContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  suggestionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  suggestionText: {
    fontSize: 16,
    marginLeft: 8,
    flex: 1,
  },
  resetButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  resourcesButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  resourcesButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resourceLink: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  resourceLinkText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 