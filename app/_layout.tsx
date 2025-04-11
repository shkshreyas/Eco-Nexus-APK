import React, { useEffect, useState } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '@/context/auth';
import { View, Text, ActivityIndicator } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider, useTheme } from '@/context/theme';
import ChatbotModal from '@/components/ChatbotModal';

// Keep the splash screen visible until auth is ready
SplashScreen.preventAutoHideAsync().catch((err) =>
  console.warn('Error preventing splash screen auto hide:', err)
);

// Custom splash component for transition
function CustomSplash() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#22C55E',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text
        style={{
          fontSize: 32,
          fontWeight: 'bold',
          color: 'white',
          marginBottom: 20,
        }}
      >
        EcoNexus 2.0
      </Text>
      <ActivityIndicator size="large" color="white" />
    </View>
  );
}

// Dynamic status bar that changes with theme
function ThemedStatusBar() {
  const { colors } = useTheme();
  return <StatusBar style={colors.statusBar} />;
}

// Route guard component to handle protected routes
function RootLayoutNav() {
  const { user, loading, isLoggedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [splashVisible, setSplashVisible] = useState(true);
  const [initialNavigationComplete, setInitialNavigationComplete] =
    useState(false);

  // Use a separate effect for hiding the splash screen
  useEffect(() => {
    if (!loading) {
      const hideSplash = async () => {
        try {
          await SplashScreen.hideAsync();
          console.log('Splash screen hidden');
          // Small delay to ensure smooth transition
          setTimeout(() => setSplashVisible(false), 100);
        } catch (e) {
          console.warn('Error hiding splash screen:', e);
          setSplashVisible(false);
        }
      };

      hideSplash();
    }
  }, [loading]);

  // Use a separate effect for navigation logic
  useEffect(() => {
    // Only run navigation logic if auth is loaded and splash is no longer visible
    if (loading || splashVisible || initialNavigationComplete) return;

    const inAuthGroup = segments[0] === 'auth';
    console.log('Auth state:', { isLoggedIn, inAuthGroup, segments });

    if (!isLoggedIn && !inAuthGroup) {
      // If not logged in, go to auth
      console.log('Not logged in, redirecting to auth');
      router.replace('/auth');
    } else if (isLoggedIn && inAuthGroup) {
      // If logged in and on auth screen, go to home
      console.log('Logged in, redirecting to home');
      router.replace('/');
    }

    setInitialNavigationComplete(true);
  }, [
    isLoggedIn,
    loading,
    segments,
    splashVisible,
    initialNavigationComplete,
    router,
  ]);

  // Always render the Slot regardless of auth state
  // The navigation logic above will handle redirects as needed
  if (loading || splashVisible) {
    return <CustomSplash />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Slot />
      {isLoggedIn && <ChatbotModal />}
    </View>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ThemedStatusBar />
        <RootLayoutNav />
      </ThemeProvider>
    </AuthProvider>
  );
}
