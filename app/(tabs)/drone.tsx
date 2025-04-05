import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DroneReconInterface from '@/components/drone/DroneReconInterface';

export default function DroneScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <DroneReconInterface />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
}); 