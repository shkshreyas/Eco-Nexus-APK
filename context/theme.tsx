import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeModes = 'light' | 'dark' | 'system';

// Define color themes
type ThemeColors = {
  primary: string;
  secondary: string;
  background: string;
  card: string;
  text: string;
  secondaryText: string;
  accent: string;
  border: string;
  success: string;
  error: string;
  warning: string;
  info: string;
  inputBackground: string;
  statusBar: 'dark-content' | 'light-content';
  elevated: string;
  profileGradientStart: string;
  profileGradientEnd: string;
  tabBarBackground: string;
  avatarBackground: string;
  settingsIconBackground: string;
};

// Default light theme colors
const lightTheme: ThemeColors = {
  primary: '#22C55E',
  secondary: '#0EA5E9',
  background: '#F9FAFB',
  card: '#FFFFFF',
  text: '#111827',
  secondaryText: '#6B7280',
  accent: '#8B5CF6',
  border: '#E5E7EB',
  success: '#22C55E',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  inputBackground: '#FFFFFF',
  statusBar: 'dark-content',
  elevated: '#FFFFFF',
  profileGradientStart: '#22C55E',
  profileGradientEnd: '#059669',
  tabBarBackground: '#FFFFFF',
  avatarBackground: '#22C55E',
  settingsIconBackground: '#F3F4F6',
};

// Rich dark theme colors with more depth and elegance
const darkTheme: ThemeColors = {
  primary: '#10B981', // Slightly darker green for better contrast
  secondary: '#0284C7',
  background: '#111827', // Deep navy blue
  card: '#1F2937', // Slightly lighter than background
  text: '#F9FAFB',
  secondaryText: '#9CA3AF',
  accent: '#A78BFA', // Lighter purple for better visibility
  border: '#374151',
  success: '#10B981',
  error: '#F87171',
  warning: '#FBBF24',
  info: '#60A5FA',
  inputBackground: '#1F2937',
  statusBar: 'light-content',
  elevated: '#2D3748', // Elevated surfaces are slightly lighter
  profileGradientStart: '#065F46', // Dark teal
  profileGradientEnd: '#064E3B',
  tabBarBackground: '#1F2937',
  avatarBackground: '#059669',
  settingsIconBackground: '#2D3748',
};

interface ThemeContextData {
  mode: ThemeModes;
  colors: ThemeColors;
  isDark: boolean;
  setTheme: (mode: ThemeModes) => void;
}

const ThemeContext = createContext<ThemeContextData | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

const THEME_STORAGE_KEY = 'EcoNexus_theme_mode';

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeModes>('system');

  useEffect(() => {
    // Load saved theme preference
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (
          savedTheme &&
          (savedTheme === 'light' ||
            savedTheme === 'dark' ||
            savedTheme === 'system')
        ) {
          setMode(savedTheme as ThemeModes);
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      }
    };

    loadTheme();
  }, []);

  const setTheme = async (newMode: ThemeModes) => {
    setMode(newMode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  // Determine if we should use dark mode
  const isDark =
    mode === 'dark' || (mode === 'system' && systemColorScheme === 'dark');

  // Select the appropriate color theme
  const colors = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ mode, colors, isDark, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
