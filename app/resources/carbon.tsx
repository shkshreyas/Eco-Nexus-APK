import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function CarbonRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // Navigate to carbon-calculator page immediately
    router.push('/resources/carbon-calculator');
  }, []);
  
  // Return empty view while redirect happens
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 