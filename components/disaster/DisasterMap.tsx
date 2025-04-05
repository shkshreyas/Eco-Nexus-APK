import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type DisasterZone = Database['public']['Tables']['disaster_zones']['Row'];

export default function DisasterMap() {
  const [disasterZones, setDisasterZones] = useState<DisasterZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch disaster zones from Supabase
  useEffect(() => {
    async function fetchDisasterZones() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('disaster_zones')
          .select('*')
          .gte('timestamp', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Last 7 days
          .eq('active', true);

        if (error) {
          throw error;
        }

        setDisasterZones(data || []);
      } catch (err) {
        console.error('Error fetching disaster zones:', err);
        setError('Failed to load disaster data');
      } finally {
        setLoading(false);
      }
    }

    fetchDisasterZones();

    // Set up real-time subscription for disaster zone updates
    const subscription = supabase
      .channel('disaster_zones_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'disaster_zones' }, 
        (payload) => {
          // Refresh the disaster zones when data changes
          fetchDisasterZones();
        }
      )
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Format disaster zones for the map
  const getDisasterMapData = () => {
    return disasterZones.map(zone => ({
      id: zone.id,
      name: zone.name,
      description: zone.description || '',
      lat: zone.lat,
      lng: zone.lng,
      intensity: zone.intensity,
      type: zone.disaster_type,
      radius: zone.radius_meters
    }));
  };

  // Generate the HTML for the map with the disaster zones
  const generateMapHtml = () => {
    const disasterData = JSON.stringify(getDisasterMapData());
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <style>
          body, html, #map {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
        </style>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
        <script src="https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js"></script>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const disasters = ${disasterData};
          
          // Initialize map centered on average position of disasters or default to San Francisco
          const defaultCenter = [37.7749, -122.4194]; // San Francisco
          let mapCenter = defaultCenter;
          
          if (disasters.length > 0) {
            const sumLat = disasters.reduce((sum, d) => sum + d.lat, 0);
            const sumLng = disasters.reduce((sum, d) => sum + d.lng, 0);
            mapCenter = [sumLat / disasters.length, sumLng / disasters.length];
          }
          
          const map = L.map('map').setView(mapCenter, 10);
          
          // Add tile layer (map background)
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
          }).addTo(map);
          
          // Add heat map layer for disaster intensity
          const heatPoints = disasters.map(d => [
            d.lat, 
            d.lng, 
            d.intensity / 10 // Scale intensity for better visualization
          ]);
          
          L.heatLayer(heatPoints, {
            radius: 25,
            blur: 15,
            maxZoom: 10,
            gradient: {0.4: 'blue', 0.65: 'yellow', 1: 'red'}
          }).addTo(map);
          
          // Add circles for each disaster zone
          disasters.forEach(disaster => {
            let color;
            switch(disaster.type) {
              case 'flood': color = '#3B82F6'; break;
              case 'fire': color = '#EF4444'; break;
              case 'earthquake': color = '#B45309'; break;
              case 'hurricane': color = '#8B5CF6'; break;
              case 'tornado': color = '#10B981'; break;
              default: color = '#6B7280';
            }
            
            L.circle([disaster.lat, disaster.lng], {
              color: color,
              fillColor: color,
              fillOpacity: 0.3,
              radius: disaster.radius
            }).bindPopup(
              '<b>' + disaster.name + '</b><br>' +
              disaster.description + '<br>' +
              'Intensity: ' + disaster.intensity + '/10'
            ).addTo(map);
          });
        </script>
      </body>
      </html>
    `;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading disaster data...</Text>
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
      {disasterZones.length === 0 ? (
        <Text style={styles.messageText}>No active disaster zones found</Text>
      ) : (
        <WebView
          source={{ html: generateMapHtml() }}
          style={styles.map}
          originWhitelist={['*']}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          mixedContentMode="always"
          allowFileAccess={true}
          useWebKit={true}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  loadingText: {
    fontSize: 16,
    color: '#4B5563',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
  },
  messageText: {
    fontSize: 16,
    color: '#4B5563',
  },
});