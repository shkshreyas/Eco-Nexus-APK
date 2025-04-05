import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ForestEnergyMatrix from '@/components/forest/ForestEnergyMatrix';

export default function ForestScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ForestEnergyMatrix />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
}); 