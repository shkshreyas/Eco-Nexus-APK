import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the shape of our auth context data
type AuthContextData = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    password: string,
    name?: string
  ) => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  isLoggedIn: boolean;
};

// Create the auth context with a default undefined value
const AuthContext = createContext<AuthContextData | undefined>(undefined);

// Session persistence keys
const SESSION_KEY = 'supabase.auth.token';

// Props for the AuthProvider component
type AuthProviderProps = {
  children: ReactNode;
};

// Create the AuthProvider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Set up the auth state listener when the component mounts
  useEffect(() => {
    console.log('Auth provider initializing...');

    // Check for stored session at startup
    const checkPersistedSession = async () => {
      try {
        const storedSession = await AsyncStorage.getItem(SESSION_KEY);
        console.log(
          'Stored session check:',
          storedSession ? 'Found' : 'Not found'
        );
      } catch (e) {
        console.error('Error checking stored session:', e);
      }
    };

    checkPersistedSession();

    // Test connectivity to Supabase when component mounts
    const testConnection = async () => {
      try {
        console.log('Testing connectivity to Supabase...');
        const { data, error } = await supabase
          .from('profiles')
          .select('count')
          .limit(1);
        if (error) {
          console.error('Supabase connection test failed:', error.message);
        } else {
          console.log('Supabase connection test successful');
        }
      } catch (error) {
        console.error('Exception during Supabase connection test:', error);
      }
    };

    testConnection();

    // Get the current session
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        console.log(
          'Initial session check:',
          session ? 'Authenticated' : 'Not authenticated'
        );
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error getting session:', error);
        setLoading(false);
      });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log(
        'Auth state changed:',
        _event,
        session ? 'Session exists' : 'No session'
      );
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Clean up the subscription when the component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting signIn with Supabase...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Supabase auth error:', error.message);
        return { error };
      }

      console.log('Sign in successful, user:', data.user?.id);

      // Additional logging for session persistence
      const sessionCheck = await supabase.auth.getSession();
      console.log(
        'Session after sign in:',
        sessionCheck.data.session ? 'Present' : 'Missing'
      );

      return { error: null };
    } catch (error) {
      console.error('Exception during sign in:', error);
      // Check for network errors
      if (error instanceof Error) {
        if (
          error.message.includes('fetch') ||
          error.message.includes('network')
        ) {
          return {
            error: new Error(
              'Network connection failed. Please check your internet connection and try again.'
            ),
          };
        }
      }
      return { error: error as Error };
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, name?: string) => {
    try {
      console.log('Attempting signUp with Supabase...');
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name || email.split('@')[0], // Use name if provided, otherwise use part before @ in email
          },
        },
      });

      if (error) {
        console.error('Supabase signup error:', error.message);
        return { error };
      }

      console.log('Sign up successful, user:', data.user?.id);

      // If signup was successful and we have user data and name, create a user profile
      if (data.user && name) {
        try {
          // Create or update profile in the profiles table
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              full_name: name,
              updated_at: new Date().toISOString(),
            });

          if (profileError) {
            console.error('Error creating profile:', profileError);
          } else {
            console.log('Profile created successfully');
          }
        } catch (profileError) {
          console.error('Exception creating profile:', profileError);
        }
      }

      return { error: null };
    } catch (error) {
      console.error('Exception during sign up:', error);
      // Check for network errors
      if (error instanceof Error) {
        if (
          error.message.includes('fetch') ||
          error.message.includes('network')
        ) {
          return {
            error: new Error(
              'Network connection failed. Please check your internet connection and try again.'
            ),
          };
        }
      }
      return { error: error as Error };
    }
  };

  // Reset password (forgot password)
  const resetPassword = async (email: string) => {
    try {
      console.log('Attempting to reset password for:', email);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'EcoNexus://reset-password',
      });

      if (error) {
        console.error('Password reset error:', error.message);
        return { error };
      }

      console.log('Password reset email sent successfully');
      return { error: null };
    } catch (error) {
      console.error('Exception during password reset:', error);
      // Check for network errors
      if (error instanceof Error) {
        if (
          error.message.includes('fetch') ||
          error.message.includes('network')
        ) {
          return {
            error: new Error(
              'Network connection failed. Please check your internet connection and try again.'
            ),
          };
        }
      }
      return { error: error as Error };
    }
  };

  // Sign out
  const signOut = async () => {
    console.log('Signing out...');
    try {
      await supabase.auth.signOut();
      console.log('Sign out successful');
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  // Determine if the user is logged in
  const isLoggedIn = user !== null;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        resetPassword,
        signOut,
        isLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
