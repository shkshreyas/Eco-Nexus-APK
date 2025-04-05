import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, Alert } from 'react-native';
import { Drone, Upload, Map, Check, X, Camera } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type DroneScan = Database['public']['Tables']['drone_scans']['Row'];

export default function DroneReconInterface() {
  const [droneScanHistory, setDroneScanHistory] = useState<DroneScan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewScanForm, setShowNewScanForm] = useState(false);
  
  // Form state
  const [missionName, setMissionName] = useState('');
  const [scanAreaName, setScanAreaName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [altitude, setAltitude] = useState('');
  const [findings, setFindings] = useState('');

  useEffect(() => {
    fetchDroneScans();

    // Set up real-time subscription for drone scans
    const subscription = supabase
      .channel('drone_scans_changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'drone_scans' }, 
        (payload) => {
          const newScan = payload.new as DroneScan;
          setDroneScanHistory(prev => [newScan, ...prev]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchDroneScans = async () => {
    try {
      setLoading(true);
      // In a real app, we'd filter by the current user's ID
      const { data, error } = await supabase
        .from('drone_scans')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        throw error;
      }

      setDroneScanHistory(data || []);
    } catch (err) {
      console.error('Error fetching drone scans:', err);
      setError('Failed to load drone scan history');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitScan = async () => {
    if (!missionName || !scanAreaName || !latitude || !longitude) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    try {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      
      if (isNaN(lat) || isNaN(lng)) {
        Alert.alert('Invalid Coordinates', 'Please enter valid latitude and longitude values');
        return;
      }

      const userId = 'current-user-id'; // In a real app, get this from authentication state
      
      const newScan = {
        user_id: userId,
        mission_name: missionName,
        scan_area_name: scanAreaName,
        lat: lat,
        lng: lng,
        altitude_meters: altitude ? parseFloat(altitude) : null,
        image_url: null, // In a real app, we'd handle image upload
        findings: findings || null
      };

      const { error } = await supabase
        .from('drone_scans')
        .insert([newScan]);

      if (error) {
        throw error;
      }

      // Reset form
      setMissionName('');
      setScanAreaName('');
      setLatitude('');
      setLongitude('');
      setAltitude('');
      setFindings('');
      setShowNewScanForm(false);

      // Show success message
      Alert.alert('Success', 'Drone scan data saved successfully');
    } catch (err) {
      console.error('Error saving drone scan:', err);
      Alert.alert('Error', 'Failed to save drone scan data');
    }
  };

  const renderScanItem = (scan: DroneScan) => (
    <View key={scan.id} style={styles.scanItem}>
      <View style={styles.scanHeader}>
        <View style={styles.missionInfo}>
          <Text style={styles.missionName}>{scan.mission_name}</Text>
          <Text style={styles.scanDate}>{new Date(scan.created_at).toLocaleDateString()}</Text>
        </View>
        <Drone size={24} color="#6366F1" />
      </View>
      
      <View style={styles.scanDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Area:</Text>
          <Text style={styles.detailValue}>{scan.scan_area_name}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Coordinates:</Text>
          <Text style={styles.detailValue}>{scan.lat.toFixed(6)}, {scan.lng.toFixed(6)}</Text>
        </View>
        
        {scan.altitude_meters && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Altitude:</Text>
            <Text style={styles.detailValue}>{scan.altitude_meters}m</Text>
          </View>
        )}
      </View>
      
      {scan.findings && (
        <View style={styles.findingsContainer}>
          <Text style={styles.findingsLabel}>Findings:</Text>
          <Text style={styles.findingsText}>{scan.findings}</Text>
        </View>
      )}
      
      {scan.image_url && (
        <Image 
          source={{ uri: scan.image_url }} 
          style={styles.scanImage}
          resizeMode="cover"
        />
      )}
    </View>
  );

  const renderNewScanForm = () => (
    <View style={styles.formContainer}>
      <View style={styles.formHeader}>
        <Text style={styles.formTitle}>New Drone Scan</Text>
        <TouchableOpacity onPress={() => setShowNewScanForm(false)}>
          <X size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.formScroll}>
        <View style={styles.formField}>
          <Text style={styles.formLabel}>Mission Name *</Text>
          <TextInput
            style={styles.formInput}
            value={missionName}
            onChangeText={setMissionName}
            placeholder="Enter mission name"
          />
        </View>
        
        <View style={styles.formField}>
          <Text style={styles.formLabel}>Scan Area Name *</Text>
          <TextInput
            style={styles.formInput}
            value={scanAreaName}
            onChangeText={setScanAreaName}
            placeholder="Enter scan area name"
          />
        </View>
        
        <View style={styles.coordinatesContainer}>
          <View style={[styles.formField, styles.coordinateField]}>
            <Text style={styles.formLabel}>Latitude *</Text>
            <TextInput
              style={styles.formInput}
              value={latitude}
              onChangeText={setLatitude}
              placeholder="37.7749"
              keyboardType="numeric"
            />
          </View>
          
          <View style={[styles.formField, styles.coordinateField]}>
            <Text style={styles.formLabel}>Longitude *</Text>
            <TextInput
              style={styles.formInput}
              value={longitude}
              onChangeText={setLongitude}
              placeholder="-122.4194"
              keyboardType="numeric"
            />
          </View>
        </View>
        
        <View style={styles.formField}>
          <Text style={styles.formLabel}>Altitude (meters)</Text>
          <TextInput
            style={styles.formInput}
            value={altitude}
            onChangeText={setAltitude}
            placeholder="100"
            keyboardType="numeric"
          />
        </View>
        
        <View style={styles.formField}>
          <Text style={styles.formLabel}>Findings</Text>
          <TextInput
            style={[styles.formInput, styles.textArea]}
            value={findings}
            onChangeText={setFindings}
            placeholder="Enter scan findings and observations"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
        
        <View style={styles.imageUploadContainer}>
          <TouchableOpacity style={styles.imageUploadButton}>
            <Camera size={20} color="#6366F1" />
            <Text style={styles.imageUploadText}>Add Scan Image</Text>
          </TouchableOpacity>
          <Text style={styles.imageUploadHint}>
            This would upload a drone scan image in a real app
          </Text>
        </View>
        
        <View style={styles.formActions}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => setShowNewScanForm(false)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmitScan}
          >
            <Check size={20} color="#FFFFFF" />
            <Text style={styles.submitButtonText}>Save Scan</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );

  if (loading && droneScanHistory.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading drone scan data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showNewScanForm ? (
        renderNewScanForm()
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>Drone Reconnaissance</Text>
            <TouchableOpacity 
              style={styles.newScanButton}
              onPress={() => setShowNewScanForm(true)}
            >
              <Upload size={18} color="#FFFFFF" />
              <Text style={styles.newScanButtonText}>Log Scan</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Drone Scan Data</Text>
            <Text style={styles.infoText}>
              View and log drone reconnaissance data for environmental monitoring and deforestation tracking.
            </Text>
          </View>
          
          {droneScanHistory.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Drone size={48} color="#9CA3AF" />
              <Text style={styles.emptyText}>No drone scans found</Text>
              <Text style={styles.emptySubtext}>
                Start by logging your first drone reconnaissance scan
              </Text>
            </View>
          ) : (
            <ScrollView style={styles.scanList}>
              {droneScanHistory.map(renderScanItem)}
            </ScrollView>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  newScanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  newScanButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 6,
  },
  infoBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4B5563',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  scanList: {
    flex: 1,
  },
  scanItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  scanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  missionInfo: {
    flex: 1,
  },
  missionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  scanDate: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  scanDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
    width: 100,
  },
  detailValue: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
  },
  findingsContainer: {
    marginBottom: 12,
  },
  findingsLabel: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
    marginBottom: 4,
  },
  findingsText: {
    fontSize: 14,
    color: '#111827',
    lineHeight: 20,
  },
  scanImage: {
    width: '100%',
    height: 160,
    borderRadius: 8,
  },
  formContainer: {
    flex: 1,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  formScroll: {
    flex: 1,
  },
  formField: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 6,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  coordinatesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  coordinateField: {
    flex: 1,
    marginHorizontal: 4,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imageUploadContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  imageUploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#6366F1',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 16,
    width: '100%',
  },
  imageUploadText: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '500',
    marginLeft: 8,
  },
  imageUploadHint: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    marginBottom: 24,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 12,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 6,
  },
}); 