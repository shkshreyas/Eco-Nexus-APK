import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/auth';
import { Leaf, X } from 'lucide-react-native';
import { checkNetworkConnectivity } from '@/lib/network';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const { signIn, signUp, resetPassword } = useAuth();
  const router = useRouter();

  const handleAuth = async () => {
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // First check network connectivity
      const isConnected = await checkNetworkConnectivity();
      if (!isConnected) {
        throw new Error(
          'Network connection failed. Please check your internet connection and try again.'
        );
      }

      if (isLogin) {
        console.log('Attempting to sign in with:', email);
        const { error } = await signIn(email, password);
        if (error) {
          console.error('Sign in error:', error.message);
          throw error;
        }
        console.log('Sign in successful');
      } else {
        if (!name) {
          setError('Name is required');
          setLoading(false);
          return;
        }

        console.log('Attempting to sign up with:', email);
        const { error } = await signUp(email, password, name);
        if (error) {
          console.error('Sign up error:', error.message);
          throw error;
        }

        setIsLogin(true);
        setError(
          'Account created! Please check your email to confirm your account, then log in.'
        );
      }
    } catch (err) {
      console.error('Auth error:', err);

      // More specific error handling
      if (err instanceof Error) {
        if (err.message.includes('network') || err.message.includes('fetch')) {
          setError(
            'Network error. Please check your internet connection and try again.'
          );
        } else {
          setError(err.message);
        }
      } else {
        setError('An unknown error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!resetEmail) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Check network connectivity
      const isConnected = await checkNetworkConnectivity();
      if (!isConnected) {
        throw new Error(
          'Network connection failed. Please check your internet connection and try again.'
        );
      }

      const { error } = await resetPassword(resetEmail);
      if (error) {
        throw error;
      }

      setResetEmailSent(true);
    } catch (err) {
      console.error('Password reset error:', err);

      if (err instanceof Error) {
        Alert.alert('Error', err.message);
      } else {
        Alert.alert(
          'Error',
          'An unknown error occurred. Please try again later.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const openResetPasswordModal = () => {
    setResetEmail(email); // Pre-fill with the email if already entered
    setResetEmailSent(false);
    setShowResetModal(true);
  };

  const closeResetPasswordModal = () => {
    setShowResetModal(false);
    setResetEmailSent(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <View style={styles.logoBackground}>
            <Leaf size={40} color="#FFFFFF" />
          </View>
          <Text style={styles.appTitle}>EcoNexus 2.0</Text>
          <Text style={styles.appSubtitle}>Environmental Action Platform</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </Text>
          <Text style={styles.formSubtitle}>
            {isLogin
              ? 'Sign in to continue your sustainable journey'
              : 'Join our community of environmental champions'}
          </Text>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {!isLogin && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {isLogin && (
            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={openResetPasswordModal}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleAuth}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.actionButtonText}>
                {isLogin ? 'Sign In' : 'Create Account'}
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
            </Text>
            <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
              <Text style={styles.switchActionText}>
                {isLogin ? 'Sign Up' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.resourcesBox}>
          <Text style={styles.resourcesTitle}>
            Sustainable Development Resources
          </Text>
          <Text style={styles.resourcesText}>
            Explore our curated resources about sustainable living, renewable
            energy, conservation efforts, and how you can make a difference in
            your community.
          </Text>
          <TouchableOpacity style={styles.resourcesButton}>
            <Text style={styles.resourcesButtonText}>Explore Resources</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Forgot Password Modal */}
      <Modal
        visible={showResetModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeResetPasswordModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={closeResetPasswordModal}
            >
              <X size={24} color="#4B5563" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>
              {resetEmailSent ? 'Email Sent' : 'Reset Password'}
            </Text>

            {resetEmailSent ? (
              <View style={styles.successContainer}>
                <Text style={styles.successText}>
                  Password reset instructions have been sent to your email
                  address. Please check your inbox and follow the instructions
                  to reset your password.
                </Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={closeResetPasswordModal}
                >
                  <Text style={styles.modalButtonText}>Return to Login</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text style={styles.modalDescription}>
                  Enter your email address and we'll send you instructions to
                  reset your password.
                </Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Enter your email"
                  value={resetEmail}
                  onChangeText={setResetEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleForgotPassword}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.modalButtonText}>Send Reset Link</Text>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logoBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#22C55E',
    fontSize: 14,
    fontWeight: '500',
  },
  actionButton: {
    backgroundColor: '#22C55E',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchText: {
    color: '#6B7280',
    fontSize: 14,
    marginRight: 4,
  },
  switchActionText: {
    color: '#22C55E',
    fontSize: 14,
    fontWeight: '600',
  },
  resourcesBox: {
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
  },
  resourcesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#065F46',
    marginBottom: 8,
  },
  resourcesText: {
    fontSize: 14,
    color: '#047857',
    marginBottom: 16,
    lineHeight: 20,
  },
  resourcesButton: {
    backgroundColor: '#059669',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  resourcesButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  modalCloseButton: {
    alignSelf: 'flex-end',
    padding: 4,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalDescription: {
    color: '#6B7280',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#22C55E',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    width: '100%',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  successText: {
    color: '#065F46',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 24,
  },
});
