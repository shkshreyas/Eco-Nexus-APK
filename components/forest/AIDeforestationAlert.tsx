import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Modal } from 'react-native';
import { AlertTriangle, X, MapPin, Calendar, AlertCircle } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type Alert = Database['public']['Tables']['alerts']['Row'];

export default function AIDeforestationAlert() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchAlerts();

    // Set up real-time subscription for alerts
    const subscription = supabase
      .channel('alerts_changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'alerts' }, 
        (payload) => {
          // Add new alert to the list
          const newAlert = payload.new as Alert;
          setAlerts(prev => [newAlert, ...prev]);
        }
      )
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .eq('alert_type', 'deforestation')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        throw error;
      }

      setAlerts(data || []);
    } catch (err) {
      console.error('Error fetching alerts:', err);
      setError('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  const markAlertAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('alerts')
        .update({ is_read: true })
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state
      setAlerts(prev => 
        prev.map(alert => 
          alert.id === id ? { ...alert, is_read: true } : alert
        )
      );
    } catch (err) {
      console.error('Error marking alert as read:', err);
    }
  };

  const openAlertDetails = (alert: Alert) => {
    setSelectedAlert(alert);
    setModalVisible(true);
    if (!alert.is_read) {
      markAlertAsRead(alert.id);
    }
  };

  const getAlertImage = (alert: Alert) => {
    // In a real app, we would use a proper image based on the alert
    // For demo purposes, we'll use placeholder images based on severity
    switch (alert.severity) {
      case 'high':
        return require('@/assets/images/deforestation-high.jpg');
      case 'medium':
        return require('@/assets/images/deforestation-medium.jpg');
      case 'low':
        return require('@/assets/images/deforestation-low.jpg');
      default:
        return require('@/assets/images/deforestation-default.jpg');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#3B82F6';
      default:
        return '#6B7280';
    }
  };

  const renderAlertItem = ({ item }: { item: Alert }) => (
    <TouchableOpacity 
      style={[
        styles.alertItem, 
        item.is_read ? styles.alertItemRead : {}
      ]} 
      onPress={() => openAlertDetails(item)}
    >
      <View style={[styles.severityIndicator, { backgroundColor: getSeverityColor(item.severity) }]} />
      <View style={styles.alertContent}>
        <Text style={styles.alertTitle}>
          {!item.is_read && <View style={styles.unreadDot} />} {item.title}
        </Text>
        <Text style={styles.alertDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.alertMeta}>
          <Text style={styles.alertTime}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
          <View style={styles.severityBadge}>
            <Text style={[styles.severityText, { color: getSeverityColor(item.severity) }]}>
              {item.severity.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderAlertDetailsModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View style={styles.modalTitleContainer}>
              <AlertTriangle size={20} color={selectedAlert ? getSeverityColor(selectedAlert.severity) : '#000'} />
              <Text style={styles.modalTitle}>{selectedAlert?.title}</Text>
            </View>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <X size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {selectedAlert?.lat && selectedAlert?.lng && (
            <View style={styles.imageContainer}>
              <Image 
                source={selectedAlert ? getAlertImage(selectedAlert) : require('@/assets/images/deforestation-default.jpg')}
                style={styles.alertImage}
                resizeMode="cover"
              />
              <View style={styles.coordinateOverlay}>
                <MapPin size={16} color="#fff" />
                <Text style={styles.coordinateText}>
                  {selectedAlert.lat.toFixed(6)}, {selectedAlert.lng.toFixed(6)}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.modalBody}>
            <View style={styles.detailRow}>
              <AlertCircle size={18} color="#4B5563" />
              <Text style={styles.detailLabel}>Severity:</Text>
              <Text style={[styles.detailValue, { color: selectedAlert ? getSeverityColor(selectedAlert.severity) : '#000' }]}>
                {selectedAlert?.severity.toUpperCase()}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Calendar size={18} color="#4B5563" />
              <Text style={styles.detailLabel}>Detected:</Text>
              <Text style={styles.detailValue}>
                {selectedAlert ? new Date(selectedAlert.created_at).toLocaleString() : ''}
              </Text>
            </View>
            
            <Text style={styles.descriptionTitle}>Description</Text>
            <Text style={styles.descriptionText}>
              {selectedAlert?.description}
            </Text>
            
            <Text style={styles.actionTitle}>Recommended Actions</Text>
            <View style={styles.actionItem}>
              <Text style={styles.actionNumber}>1.</Text>
              <Text style={styles.actionText}>Report to local environmental authorities</Text>
            </View>
            <View style={styles.actionItem}>
              <Text style={styles.actionNumber}>2.</Text>
              <Text style={styles.actionText}>Organize community response team</Text>
            </View>
            <View style={styles.actionItem}>
              <Text style={styles.actionNumber}>3.</Text>
              <Text style={styles.actionText}>Schedule drone reconnaissance mission</Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (loading && alerts.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading alerts...</Text>
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
      <Text style={styles.title}>AI Deforestation Alerts</Text>
      
      {alerts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No deforestation alerts at this time</Text>
        </View>
      ) : (
        <FlatList
          data={alerts}
          renderItem={renderAlertItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {renderAlertDetailsModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#065F46',
  },
  listContent: {
    paddingBottom: 16,
  },
  alertItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  alertItemRead: {
    opacity: 0.7,
  },
  severityIndicator: {
    width: 4,
    borderRadius: 2,
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    marginRight: 6,
  },
  alertDescription: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
  },
  alertMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  severityText: {
    fontSize: 10,
    fontWeight: '600',
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
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 8,
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  alertImage: {
    width: '100%',
    height: '100%',
  },
  coordinateOverlay: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  coordinateText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginLeft: 4,
  },
  modalBody: {
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
    marginLeft: 8,
    marginRight: 4,
  },
  detailValue: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginTop: 8,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 16,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  actionItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  actionNumber: {
    fontSize: 14,
    color: '#065F46',
    fontWeight: '600',
    width: 20,
  },
  actionText: {
    fontSize: 14,
    color: '#4B5563',
    flex: 1,
  },
}); 