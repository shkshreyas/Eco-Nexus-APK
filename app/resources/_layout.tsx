import { Stack } from 'expo-router';
import { useTheme } from '@/context/theme';

export default function ResourcesLayout() {
  const { colors } = useTheme();
  
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="green-living" />
      <Stack.Screen name="energy-saving" />
      <Stack.Screen name="carbon-calculator" />
      <Stack.Screen name="carbon" />
    </Stack>
  );
} 