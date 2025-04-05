import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AIDeforestationAlert from '@/components/forest/AIDeforestationAlert';

export default function AlertsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <AIDeforestationAlert />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
}); 