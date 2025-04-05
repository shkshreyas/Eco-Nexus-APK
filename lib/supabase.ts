import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

// These would typically come from environment variables
// For a real app, use a proper .env solution like react-native-dotenv
const supabaseUrl = 'https://anueydhidrzfpdoxfijb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFudWV5ZGhpZHJ6ZnBkb3hmaWpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NDExMDYsImV4cCI6MjA1OTQxNzEwNn0.l1FsMgR0ReBC8Qnmi7BckI0mMOaVdFy-WnwfaAf_xts';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Helper functions for common Supabase operations

/**
 * Fetches the current user's profile data
 */
export const fetchUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return { data: null, error };
  }
};

/**
 * Updates the current user's profile
 */
export const updateUserProfile = async (userId: string, updates: any) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { data: null, error };
  }
};

/**
 * Fetches energy readings data for charts
 */
export const fetchEnergyReadings = async (
  period: 'day' | 'week' | 'month' = 'week',
  limit: number = 7
) => {
  try {
    // Calculate the date range based on the period
    const now = new Date();
    let startDate;
    
    switch (period) {
      case 'day':
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      default:
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
    }

    const { data, error } = await supabase
      .from('energy_readings')
      .select('*')
      .gte('timestamp', startDate.toISOString())
      .lte('timestamp', now.toISOString())
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching energy readings:', error);
    return { data: null, error };
  }
};

/**
 * Fetches alerts
 */
export const fetchAlerts = async (limit: number = 5) => {
  try {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return { data: null, error };
  }
};