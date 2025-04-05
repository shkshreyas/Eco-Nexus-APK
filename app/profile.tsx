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
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/auth';
import { supabase, fetchUserProfile, updateUserProfile } from '@/lib/supabase';
import { ChevronRight, User, Bell, Shield, HelpCircle, LogOut } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [dataSharing, setDataSharing] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    setLoading(true);
    try {
      const { data, error } = await fetchUserProfile(user.id);
      
      if (error) throw error;
      
      if (data) {
        setProfile(data);
        setFullName(data.full_name || '');
        setBio(data.bio || '');
        
        // Load preferences if they exist
        if (data.preferences) {
          const prefs = data.preferences;
          setNotifications(prefs.notifications !== undefined ? prefs.notifications : true);
          setDarkMode(prefs.darkMode !== undefined ? prefs.darkMode : false);
          setDataSharing(prefs.dataSharing !== undefined ? prefs.dataSharing : true);
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const updates = {
        id: user.id,
        full_name: fullName,
        bio: bio,
        preferences: {
          notifications,
          darkMode,
          dataSharing
        },
        updated_at: new Date().toISOString(),
      };

      const { error } = await updateUserProfile(user.id, updates);
      
      if (error) throw error;
      
      Alert.alert('Success', 'Profile updated successfully');
      setEditing(false);
      loadUserProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
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
          }
        },
      ]
    );
  };

  if (!user) {
    router.replace('/auth');
    return null;
  }

  if (loading && !profile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#22C55E" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          {!editing ? (
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => setEditing(true)}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSaveProfile}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {user.email && user.email[0].toUpperCase()}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              {editing ? (
                <TextInput
                  style={styles.nameInput}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter your full name"
                />
              ) : (
                <Text style={styles.profileName}>
                  {profile?.full_name || user.email?.split('@')[0]}
                </Text>
              )}
              <Text style={styles.profileEmail}>{user.email}</Text>
            </View>
          </View>

          {editing ? (
            <View style={styles.bioEditContainer}>
              <Text style={styles.bioLabel}>Bio</Text>
              <TextInput
                style={styles.bioInput}
                value={bio}
                onChangeText={setBio}
                placeholder="Tell us about yourself..."
                multiline
                numberOfLines={3}
              />
            </View>
          ) : (
            profile?.bio && (
              <Text style={styles.profileBio}>{profile.bio}</Text>
            )
          )}
        </View>

        <Text style={styles.sectionTitle}>Account Settings</Text>
        
        <View style={styles.settingsSection}>
          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.settingsIcon}>
              <User size={20} color="#22C55E" />
            </View>
            <Text style={styles.settingsText}>Account Details</Text>
            <ChevronRight size={18} color="#9CA3AF" />
          </TouchableOpacity>
          
          <View style={styles.settingsItem}>
            <View style={styles.settingsIcon}>
              <Bell size={20} color="#22C55E" />
            </View>
            <Text style={styles.settingsText}>Notifications</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#E5E7EB', true: '#DCFCE7' }}
              thumbColor={notifications ? '#22C55E' : '#9CA3AF'}
            />
          </View>
          
          <View style={styles.settingsItem}>
            <View style={styles.settingsIcon}>
              <Shield size={20} color="#22C55E" />
            </View>
            <Text style={styles.settingsText}>Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#E5E7EB', true: '#DCFCE7' }}
              thumbColor={darkMode ? '#22C55E' : '#9CA3AF'}
            />
          </View>
          
          <View style={styles.settingsItem}>
            <View style={styles.settingsIcon}>
              <Shield size={20} color="#22C55E" />
            </View>
            <Text style={styles.settingsText}>Data Sharing</Text>
            <Switch
              value={dataSharing}
              onValueChange={setDataSharing}
              trackColor={{ false: '#E5E7EB', true: '#DCFCE7' }}
              thumbColor={dataSharing ? '#22C55E' : '#9CA3AF'}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Support</Text>
        
        <View style={styles.settingsSection}>
          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.settingsIcon}>
              <HelpCircle size={20} color="#22C55E" />
            </View>
            <Text style={styles.settingsText}>Help Center</Text>
            <ChevronRight size={18} color="#9CA3AF" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.settingsIcon}>
              <HelpCircle size={20} color="#22C55E" />
            </View>
            <Text style={styles.settingsText}>Contact Support</Text>
            <ChevronRight size={18} color="#9CA3AF" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.settingsIcon}>
              <HelpCircle size={20} color="#22C55E" />
            </View>
            <Text style={styles.settingsText}>Privacy Policy</Text>
            <ChevronRight size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>EcoVolt 2.0 - Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#4B5563',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#22C55E',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
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
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
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
    color: '#111827',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  profileBio: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  nameInput: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  bioEditContainer: {
    marginTop: 8,
  },
  bioLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 8,
  },
  bioInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#111827',
    textAlignVertical: 'top',
    minHeight: 80,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    marginTop: 8,
  },
  settingsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 1,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingsIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingsText: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    marginBottom: 24,
  },
  signOutText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 40,
  },
}); 