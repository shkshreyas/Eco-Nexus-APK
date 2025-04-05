import React, { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '@/context/auth';

// Route guard component to handle protected routes
function RootLayoutNav() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      const inAuthGroup = segments[0] === 'auth';

      if (!user && !inAuthGroup) {
        // Redirect to auth if not logged in and not in auth group
        router.replace('/auth');
      } else if (user && inAuthGroup) {
        // Redirect to home if logged in and in auth group
        router.replace('/');
      }
    }
  }, [user, loading, segments]);

  return <Slot />;
}

export default function Layout() {
  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <RootLayoutNav />
    </AuthProvider>
  );
}
