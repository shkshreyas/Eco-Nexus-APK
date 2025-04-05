import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EnergyFlowSimulator from '@/components/energy/EnergyFlowSimulator';

export default function EnergyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <EnergyFlowSimulator />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
}); 