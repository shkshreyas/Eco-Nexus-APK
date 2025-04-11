import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  ActivityIndicator,
  TextInput,
  Modal,
  Dimensions,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/auth';
import { useTheme } from '@/context/theme';
import { supabase, fetchUserProfile, updateUserProfile } from '@/lib/supabase';
import {
  ChevronRight,
  User,
  Bell,
  Moon,
  Shield,
  HelpCircle,
  LogOut,
  ArrowLeft,
  Mail,
  Calendar,
  Clock,
  CheckCircle,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { colors, isDark, mode, setTheme } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [dataSharing, setDataSharing] = useState(true);
  const [accountDetailsVisible, setAccountDetailsVisible] = useState(false);
  const [createdAt, setCreatedAt] = useState<Date | null>(null);
  const [loadError, setLoadError] = useState(false);

  // Set dark mode from profile or theme
  const [darkMode, setDarkMode] = useState(isDark);

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  // Update theme mode when dark mode toggle changes
  useEffect(() => {
    if (darkMode) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }, [darkMode]);

  const loadUserProfile = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      if (!user) {
        setLoadError(true);
        return;
      }

      const { data, error } = await fetchUserProfile(user.id);

      if (error) {
        console.error('Error fetching profile:', error);
        // Don't throw here, continue with default values
      }

      if (data) {
        setProfile(data);
        setFullName(
          data.full_name || (user.email ? user.email.split('@')[0] : '') || ''
        );
        setBio(data.bio || '');

        // Use type assertion for dynamic properties
        const profileData = data as any;

        // Use the underscore prefixed properties directly (memory-only values)
        if (profileData._darkMode !== undefined) {
          setDarkMode(profileData._darkMode);
        } else if (profileData.preferences) {
          // Fallback to legacy preferences if available
          try {
            const prefsObj =
              typeof profileData.preferences === 'string'
                ? JSON.parse(profileData.preferences)
                : profileData.preferences;

            if (prefsObj) {
              setDarkMode(
                prefsObj.darkMode !== undefined ? prefsObj.darkMode : isDark
              );
              setNotifications(
                prefsObj.notifications !== undefined
                  ? prefsObj.notifications
                  : true
              );
              setDataSharing(
                prefsObj.dataSharing !== undefined ? prefsObj.dataSharing : true
              );
            }
          } catch (e) {
            console.error('Error parsing preferences:', e);
            setDarkMode(isDark);
            setNotifications(true);
            setDataSharing(true);
          }
        } else {
          // Use default values
          setDarkMode(isDark);
          setNotifications(
            profileData._notifications !== undefined
              ? profileData._notifications
              : true
          );
          setDataSharing(
            profileData._dataSharing !== undefined
              ? profileData._dataSharing
              : true
          );
        }
      } else {
        // Create default profile in memory if none exists
        setFullName(user.email ? user.email.split('@')[0] : '');
        setBio('');
        setDarkMode(isDark);
        setNotifications(true);
        setDataSharing(true);
      }

      // Get user creation date from auth
      if (user.created_at) {
        setCreatedAt(new Date(user.created_at));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setLoadError(true);
      Alert.alert('Error', 'Failed to load profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setSavingProfile(true);
    try {
      const updates = {
        id: user.id,
        full_name: fullName.trim(),
        bio: bio.trim(),
        _darkMode: darkMode,
        _notifications: notifications,
        _dataSharing: dataSharing,
        updated_at: new Date().toISOString(),
      };

      const { error } = await updateUserProfile(user.id, updates);

      if (error) {
        console.error('Error updating profile:', error);
        // Still alert but don't throw
        Alert.alert(
          'Warning',
          'Profile saved with some limitations. Some settings may not persist between sessions.'
        );
      } else {
        Alert.alert('Success', 'Profile updated successfully');
      }

      setEditing(false);
      await loadUserProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          setLoading(true);
          try {
            await signOut();
            router.replace('/auth');
          } catch (error) {
            console.error('Error signing out:', error);
            Alert.alert('Error', 'Failed to sign out');
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  if (!user) {
    router.replace('/auth');
    return null;
  }

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      paddingBottom: 40,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    loadingText: {
      marginTop: 12,
      fontSize: 16,
      color: colors.secondaryText,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 60,
      marginBottom: 24,
      paddingHorizontal: 16,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      padding: 8,
      backgroundColor: isDark ? colors.settingsIconBackground : 'transparent',
      borderRadius: 20,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.text,
      marginLeft: 16,
    },
    editButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
      backgroundColor: isDark ? colors.elevated : '#F3F4F6',
    },
    editButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.secondaryText,
    },
    saveButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
      backgroundColor: colors.primary,
    },
    saveButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    profileCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      overflow: 'hidden',
      marginBottom: 24,
      shadowColor: isDark ? '#000' : '#888',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.05,
      shadowRadius: 15,
      elevation: 3,
      marginHorizontal: 16,
    },
    gradientHeader: {
      paddingTop: 40,
      paddingBottom: 20,
      paddingHorizontal: 16,
    },
    profileHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    avatarContainer: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: colors.avatarBackground,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    avatarText: {
      fontSize: 30,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    profileInfo: {
      flex: 1,
    },
    profileName: {
      fontSize: 20,
      fontWeight: '700',
      color: isDark ? '#FFFFFF' : colors.text,
      marginBottom: 4,
    },
    profileEmail: {
      fontSize: 14,
      color: isDark ? colors.secondaryText : '#6B7280',
    },
    profileBio: {
      fontSize: 14,
      color: colors.secondaryText,
      lineHeight: 20,
      padding: 16,
    },
    nameInput: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 8,
      marginBottom: 8,
      backgroundColor: colors.inputBackground,
    },
    bioEditContainer: {
      marginTop: 8,
      padding: 16,
    },
    bioLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.secondaryText,
      marginBottom: 8,
    },
    bioInput: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 12,
      fontSize: 14,
      color: colors.text,
      textAlignVertical: 'top',
      minHeight: 80,
      backgroundColor: colors.inputBackground,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 16,
      marginTop: 8,
      marginHorizontal: 16,
    },
    settingsSection: {
      backgroundColor: colors.card,
      borderRadius: 12,
      marginBottom: 24,
      shadowColor: isDark ? '#000' : '#888',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDark ? 0.3 : 0.05,
      shadowRadius: 10,
      elevation: 2,
      marginHorizontal: 16,
    },
    settingsItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    settingsIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: isDark ? colors.settingsIconBackground : '#F3F4F6',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    settingsText: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
    },
    signOutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      backgroundColor: isDark ? 'rgba(239, 68, 68, 0.2)' : '#FEE2E2',
      borderRadius: 12,
      marginBottom: 24,
      marginHorizontal: 16,
    },
    signOutText: {
      marginLeft: 8,
      fontSize: 16,
      fontWeight: '600',
      color: colors.error,
    },
    versionText: {
      textAlign: 'center',
      fontSize: 14,
      color: colors.secondaryText,
      marginBottom: 40,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modalContent: {
      backgroundColor: colors.card,
      borderRadius: 12,
      width: Dimensions.get('window').width * 0.9,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 16,
      textAlign: 'center',
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    detailIcon: {
      marginRight: 16,
      backgroundColor: isDark
        ? colors.settingsIconBackground
        : colors.background,
      padding: 10,
      borderRadius: 20,
    },
    detailContent: {
      flex: 1,
    },
    detailLabel: {
      fontSize: 14,
      color: colors.secondaryText,
      marginBottom: 4,
    },
    detailValue: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
    },
    modalButton: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      padding: 14,
      alignItems: 'center',
      marginTop: 10,
    },
    modalButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    errorContainer: {
      padding: 16,
      backgroundColor: isDark ? 'rgba(239, 68, 68, 0.2)' : '#FEE2E2',
      marginHorizontal: 16,
      borderRadius: 8,
      marginBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },
    errorText: {
      color: colors.error,
      flex: 1,
      marginLeft: 8,
    },
    retryButton: {
      backgroundColor: colors.error,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
    },
    retryText: {
      color: '#FFFFFF',
      fontWeight: '600',
    },
  });

  if (loading && !profile) {
    return (
      <View style={dynamicStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={dynamicStyles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={dynamicStyles.container}>
      <ScrollView contentContainerStyle={dynamicStyles.scrollContent}>
        <View style={dynamicStyles.header}>
          <View style={dynamicStyles.headerRow}>
            <TouchableOpacity
              style={dynamicStyles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={dynamicStyles.headerTitle}>Profile</Text>
          </View>
          {!editing ? (
            <TouchableOpacity
              style={dynamicStyles.editButton}
              onPress={() => setEditing(true)}
            >
              <Text style={dynamicStyles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={dynamicStyles.saveButton}
              onPress={handleSaveProfile}
              disabled={savingProfile}
            >
              {savingProfile ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={dynamicStyles.saveButtonText}>Save</Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        {loadError && (
          <View style={dynamicStyles.errorContainer}>
            <Shield size={20} color={colors.error} />
            <Text style={dynamicStyles.errorText}>
              Failed to load profile data
            </Text>
            <TouchableOpacity
              style={dynamicStyles.retryButton}
              onPress={loadUserProfile}
            >
              <Text style={dynamicStyles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={dynamicStyles.profileCard}>
          <LinearGradient
            colors={[colors.profileGradientStart, colors.profileGradientEnd]}
            style={dynamicStyles.gradientHeader}
          >
            <View style={dynamicStyles.profileHeader}>
              <View style={dynamicStyles.avatarContainer}>
                <Text style={dynamicStyles.avatarText}>
                  {user.email && user.email[0].toUpperCase()}
                </Text>
              </View>
              <View style={dynamicStyles.profileInfo}>
                <Text style={dynamicStyles.profileName}>
                  {profile?.full_name || user.email?.split('@')[0]}
                </Text>
                <Text style={dynamicStyles.profileEmail}>{user.email}</Text>
              </View>
            </View>
          </LinearGradient>

          {editing ? (
            <View style={dynamicStyles.bioEditContainer}>
              <Text style={dynamicStyles.bioLabel}>Full Name</Text>
              <TextInput
                style={dynamicStyles.nameInput}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter your full name"
                placeholderTextColor={colors.secondaryText}
              />

              <Text style={dynamicStyles.bioLabel}>Bio</Text>
              <TextInput
                style={dynamicStyles.bioInput}
                value={bio}
                onChangeText={setBio}
                placeholder="Tell us about yourself..."
                placeholderTextColor={colors.secondaryText}
                multiline
                numberOfLines={3}
              />
            </View>
          ) : (
            profile?.bio && (
              <Text style={dynamicStyles.profileBio}>{profile.bio}</Text>
            )
          )}
        </View>

        <Text style={dynamicStyles.sectionTitle}>Account Settings</Text>

        <View style={dynamicStyles.settingsSection}>
          <TouchableOpacity
            style={dynamicStyles.settingsItem}
            onPress={() => setAccountDetailsVisible(true)}
          >
            <View style={dynamicStyles.settingsIcon}>
              <User size={20} color={colors.primary} />
            </View>
            <Text style={dynamicStyles.settingsText}>Account Details</Text>
            <ChevronRight size={18} color={colors.secondaryText} />
          </TouchableOpacity>

          <View style={dynamicStyles.settingsItem}>
            <View style={dynamicStyles.settingsIcon}>
              <Bell size={20} color={colors.primary} />
            </View>
            <Text style={dynamicStyles.settingsText}>Notifications</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: colors.border, true: `${colors.primary}50` }}
              thumbColor={notifications ? colors.primary : colors.secondaryText}
            />
          </View>

          <View style={dynamicStyles.settingsItem}>
            <View style={dynamicStyles.settingsIcon}>
              <Moon size={20} color={colors.primary} />
            </View>
            <Text style={dynamicStyles.settingsText}>Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: colors.border, true: `${colors.primary}50` }}
              thumbColor={darkMode ? colors.primary : colors.secondaryText}
            />
          </View>

          <View style={dynamicStyles.settingsItem}>
            <View style={dynamicStyles.settingsIcon}>
              <Shield size={20} color={colors.primary} />
            </View>
            <Text style={dynamicStyles.settingsText}>Data Sharing</Text>
            <Switch
              value={dataSharing}
              onValueChange={setDataSharing}
              trackColor={{ false: colors.border, true: `${colors.primary}50` }}
              thumbColor={dataSharing ? colors.primary : colors.secondaryText}
            />
          </View>
        </View>

        <Text style={dynamicStyles.sectionTitle}>Support</Text>

        <View style={dynamicStyles.settingsSection}>
          <TouchableOpacity
            style={dynamicStyles.settingsItem}
            onPress={() => Linking.openURL('https://EcoNexus.org/help')}
          >
            <View style={dynamicStyles.settingsIcon}>
              <HelpCircle size={20} color={colors.primary} />
            </View>
            <Text style={dynamicStyles.settingsText}>Help Center</Text>
            <ChevronRight size={18} color={colors.secondaryText} />
          </TouchableOpacity>

          <TouchableOpacity
            style={dynamicStyles.settingsItem}
            onPress={() => Linking.openURL('mailto:support@EcoNexus.org')}
          >
            <View style={dynamicStyles.settingsIcon}>
              <Mail size={20} color={colors.primary} />
            </View>
            <Text style={dynamicStyles.settingsText}>Contact Support</Text>
            <ChevronRight size={18} color={colors.secondaryText} />
          </TouchableOpacity>

          <TouchableOpacity
            style={dynamicStyles.settingsItem}
            onPress={() => Linking.openURL('https://EcoNexus.org/privacy')}
          >
            <View style={dynamicStyles.settingsIcon}>
              <Shield size={20} color={colors.primary} />
            </View>
            <Text style={dynamicStyles.settingsText}>Privacy Policy</Text>
            <ChevronRight size={18} color={colors.secondaryText} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={dynamicStyles.signOutButton}
          onPress={handleSignOut}
        >
          <LogOut size={20} color={colors.error} />
          <Text style={dynamicStyles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={dynamicStyles.versionText}>
          EcoNexus 2.0 - Version 1.0.0
        </Text>
      </ScrollView>

      {/* Account Details Modal */}
      <Modal
        visible={accountDetailsVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setAccountDetailsVisible(false)}
      >
        <View style={dynamicStyles.modalContainer}>
          <View style={dynamicStyles.modalContent}>
            <Text style={dynamicStyles.modalTitle}>Account Details</Text>

            <View style={dynamicStyles.detailRow}>
              <View style={dynamicStyles.detailIcon}>
                <User size={24} color={colors.primary} />
              </View>
              <View style={dynamicStyles.detailContent}>
                <Text style={dynamicStyles.detailLabel}>Full Name</Text>
                <Text style={dynamicStyles.detailValue}>
                  {profile?.full_name || user.email?.split('@')[0] || 'Not set'}
                </Text>
              </View>
            </View>

            <View style={dynamicStyles.detailRow}>
              <View style={dynamicStyles.detailIcon}>
                <Mail size={24} color={colors.primary} />
              </View>
              <View style={dynamicStyles.detailContent}>
                <Text style={dynamicStyles.detailLabel}>Email Address</Text>
                <Text style={dynamicStyles.detailValue}>{user.email}</Text>
              </View>
            </View>

            <View style={dynamicStyles.detailRow}>
              <View style={dynamicStyles.detailIcon}>
                <Calendar size={24} color={colors.primary} />
              </View>
              <View style={dynamicStyles.detailContent}>
                <Text style={dynamicStyles.detailLabel}>Account Created</Text>
                <Text style={dynamicStyles.detailValue}>
                  {createdAt
                    ? createdAt.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'N/A'}
                </Text>
              </View>
            </View>

            <View
              style={[
                dynamicStyles.detailRow,
                { borderBottomWidth: 0, marginBottom: 0, paddingBottom: 0 },
              ]}
            >
              <View style={dynamicStyles.detailIcon}>
                <CheckCircle size={24} color={colors.primary} />
              </View>
              <View style={dynamicStyles.detailContent}>
                <Text style={dynamicStyles.detailLabel}>Email Verified</Text>
                <Text style={dynamicStyles.detailValue}>
                  {user.email_confirmed_at ? 'Yes' : 'No'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={dynamicStyles.modalButton}
              onPress={() => setAccountDetailsVisible(false)}
            >
              <Text style={dynamicStyles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
