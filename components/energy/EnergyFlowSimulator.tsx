import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { Zap, BarChart3, RefreshCw, Droplet, Wind, Sun } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type EnergyReading = Database['public']['Tables']['energy_readings']['Row'];

interface EnergySource {
  id: string;
  name: string;
  color: string;
  icon: React.ReactNode;
}

const ENERGY_SOURCES: EnergySource[] = [
  { id: 'solar', name: 'Solar', color: '#F59E0B', icon: <Sun size={16} color="#F59E0B" /> },
  { id: 'wind', name: 'Wind', color: '#3B82F6', icon: <Wind size={16} color="#3B82F6" /> },
  { id: 'hydro', name: 'Hydro', color: '#06B6D4', icon: <Droplet size={16} color="#06B6D4" /> },
  { id: 'biomass', name: 'Biomass', color: '#10B981', icon: <Zap size={16} color="#10B981" /> },
  { id: 'geothermal', name: 'Geothermal', color: '#EF4444', icon: <BarChart3 size={16} color="#EF4444" /> }
];

export default function EnergyFlowSimulator() {
  const [energyReadings, setEnergyReadings] = useState<EnergyReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSources, setSelectedSources] = useState<Record<string, boolean>>(
    ENERGY_SOURCES.reduce((acc, source) => ({ ...acc, [source.id]: true }), {})
  );

  useEffect(() => {
    fetchEnergyReadings();

    // Set up real-time subscription for energy readings
    const subscription = supabase
      .channel('energy_readings_changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'energy_readings' }, 
        (payload) => {
          // Add new reading to the list
          const newReading = payload.new as EnergyReading;
          setEnergyReadings(prev => [...prev, newReading].sort((a, b) => 
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          ));
        }
      )
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchEnergyReadings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('energy_readings')
        .select('*')
        .order('timestamp', { ascending: true })
        .limit(100);

      if (error) {
        throw error;
      }

      setEnergyReadings(data || []);
    } catch (err) {
      console.error('Error fetching energy readings:', err);
      setError('Failed to load energy data');
    } finally {
      setLoading(false);
    }
  };

  const toggleSource = (sourceId: string) => {
    setSelectedSources(prev => ({
      ...prev,
      [sourceId]: !prev[sourceId]
    }));
  };

  // Group readings by date for the chart
  const getChartData = () => {
    // Filter by selected sources
    const filteredReadings = energyReadings.filter(reading => 
      selectedSources[reading.reading_type]
    );

    // Group by date
    const byDate = filteredReadings.reduce((acc, reading) => {
      const date = new Date(reading.timestamp).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = {};
      }
      if (!acc[date][reading.reading_type]) {
        acc[date][reading.reading_type] = 0;
      }
      acc[date][reading.reading_type] += reading.reading_value;
      return acc;
    }, {} as Record<string, Record<string, number>>);

    // Format for chart
    const labels = Object.keys(byDate).slice(-7); // Last 7 days
    
    const datasets = ENERGY_SOURCES.filter(source => selectedSources[source.id]).map(source => ({
      data: labels.map(date => byDate[date]?.[source.id] || 0),
      color: () => source.color,
      strokeWidth: 2
    }));

    return {
      labels,
      datasets
    };
  };

  // Calculate total energy from forest data
  const getForestEnergyImpact = () => {
    // In a real app, this would fetch from forest_data table
    // For now we're returning a mock value
    return 1450; // kWh equivalent saved by forest
  };

  // Generate the 3D visualization HTML
  const generate3DVisualizationHtml = () => {
    const filteredReadings = energyReadings.filter(reading => 
      selectedSources[reading.reading_type]
    );

    // Transform data for visualization
    const energyData = ENERGY_SOURCES.map(source => {
      const sourceReadings = filteredReadings.filter(r => r.reading_type === source.id);
      const totalValue = sourceReadings.reduce((sum, r) => sum + r.reading_value, 0);
      
      return {
        id: source.id,
        name: source.name,
        value: totalValue,
        color: source.color
      };
    });

    // Convert to JSON string for the WebView
    const energyDataJson = JSON.stringify(energyData);
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
        <style>
          body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            background-color: #111827;
          }
          #canvas {
            width: 100%;
            height: 100%;
          }
        </style>
      </head>
      <body>
        <div id="canvas"></div>
        <script>
          // Energy data from React Native component
          const energyData = ${energyDataJson};
          
          // Set up scene
          const scene = new THREE.Scene();
          const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
          const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
          renderer.setSize(window.innerWidth, window.innerHeight);
          document.getElementById('canvas').appendChild(renderer.domElement);
          
          camera.position.z = 10;
          
          // Add ambient light
          const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
          scene.add(ambientLight);
          
          // Add directional light
          const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
          directionalLight.position.set(1, 1, 1);
          scene.add(directionalLight);
          
          // Create energy flow objects
          const flows = [];
          
          energyData.forEach((source, index) => {
            if (source.value <= 0) return;
            
            // Scale value for visualization
            const size = 0.5 + (source.value / 1000);
            const segments = 32;
            
            // Create a torus for each energy source
            const geometry = new THREE.TorusGeometry(2 + index * 0.5, 0.2, 16, segments);
            const material = new THREE.MeshPhongMaterial({ 
              color: source.color,
              emissive: source.color,
              emissiveIntensity: 0.3,
              transparent: true,
              opacity: 0.8,
              shininess: 100
            });
            
            const torus = new THREE.Mesh(geometry, material);
            torus.rotation.x = Math.PI / 3;
            torus.userData = { sourceId: source.id, rotationSpeed: 0.01 + (index * 0.002) };
            
            // Add particles flowing along the torus
            const particlesCount = Math.floor(source.value / 10);
            const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
            const particleMaterial = new THREE.MeshPhongMaterial({ 
              color: source.color,
              emissive: source.color,
              emissiveIntensity: 0.5
            });
            
            for (let i = 0; i < particlesCount; i++) {
              const particle = new THREE.Mesh(particleGeometry, particleMaterial);
              const angle = (i / particlesCount) * Math.PI * 2;
              
              // Position on the torus
              particle.position.x = (2 + index * 0.5) * Math.cos(angle);
              particle.position.y = (2 + index * 0.5) * Math.sin(angle) * Math.sin(Math.PI / 3);
              particle.position.z = (2 + index * 0.5) * Math.sin(angle) * Math.cos(Math.PI / 3);
              
              particle.userData = { 
                angle,
                radius: 2 + index * 0.5, 
                sourceId: source.id,
                speed: 0.02 + Math.random() * 0.02
              };
              
              flows.push(particle);
              scene.add(particle);
            }
            
            scene.add(torus);
            flows.push(torus);
          });
          
          // Animation loop
          const animate = () => {
            requestAnimationFrame(animate);
            
            // Rotate camera slowly
            camera.position.x = 10 * Math.sin(Date.now() * 0.0001);
            camera.position.z = 10 * Math.cos(Date.now() * 0.0001);
            camera.lookAt(0, 0, 0);
            
            // Animate energy flows
            flows.forEach(object => {
              if (object.geometry instanceof THREE.TorusGeometry) {
                // Rotate the torus
                object.rotation.z += object.userData.rotationSpeed;
              } else {
                // Move particles along the torus
                object.userData.angle += object.userData.speed;
                
                const radius = object.userData.radius;
                object.position.x = radius * Math.cos(object.userData.angle);
                object.position.y = radius * Math.sin(object.userData.angle) * Math.sin(Math.PI / 3);
                object.position.z = radius * Math.sin(object.userData.angle) * Math.cos(Math.PI / 3);
              }
            });
            
            renderer.render(scene, camera);
          };
          
          animate();
          
          // Handle window resize
          window.addEventListener('resize', () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
          });
        </script>
      </body>
      </html>
    `;
  };

  if (loading && energyReadings.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading energy data...</Text>
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
      <Text style={styles.title}>3D Energy Flow Simulator</Text>
      
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {ENERGY_SOURCES.map((source) => (
            <TouchableOpacity 
              key={source.id}
              style={[
                styles.filterItem, 
                selectedSources[source.id] ? { backgroundColor: source.color } : styles.filterItemInactive
              ]}
              onPress={() => toggleSource(source.id)}
            >
              {source.icon}
              <Text 
                style={[
                  styles.filterText, 
                  selectedSources[source.id] ? styles.filterTextActive : {}
                ]}
              >
                {source.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {energyReadings
              .filter(r => selectedSources[r.reading_type])
              .reduce((sum, r) => sum + r.reading_value, 0)
              .toLocaleString()} kWh
          </Text>
          <Text style={styles.statLabel}>Total Energy</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {getForestEnergyImpact().toLocaleString()} kWh
          </Text>
          <Text style={styles.statLabel}>Forest Impact</Text>
        </View>
      </View>
      
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Energy Production (Last 7 Days)</Text>
        {energyReadings.length > 0 ? (
          <LineChart
            data={getChartData()}
            width={Dimensions.get('window').width - 32}
            height={180}
            chartConfig={{
              backgroundColor: '#f0f9ff',
              backgroundGradientFrom: '#f0f9ff',
              backgroundGradientTo: '#e0f2fe',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(75, 85, 99, ${opacity})`,
              propsForDots: {
                r: '4',
                strokeWidth: '2',
              },
              propsForBackgroundLines: {
                strokeDasharray: '',
              },
            }}
            bezier
            style={styles.chart}
          />
        ) : (
          <View style={styles.noChartData}>
            <Text style={styles.noChartDataText}>No energy data available</Text>
          </View>
        )}
      </View>
      
      <View style={styles.visualizationContainer}>
        <View style={styles.visualizationHeader}>
          <Text style={styles.visualizationTitle}>Real-time Energy Flow</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={fetchEnergyReadings}>
            <RefreshCw size={16} color="#3B82F6" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.visualization}>
          <WebView
            source={{ html: generate3DVisualizationHtml() }}
            style={styles.webView}
            originWhitelist={['*']}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            mixedContentMode="always"
            allowFileAccess={true}
            useWebKit={true}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterItemInactive: {
    backgroundColor: '#F3F4F6',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3B82F6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  chartContainer: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 8,
  },
  chart: {
    borderRadius: 12,
    paddingRight: 12,
  },
  noChartData: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noChartDataText: {
    fontSize: 14,
    color: '#64748B',
  },
  visualizationContainer: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    overflow: 'hidden',
  },
  visualizationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  visualizationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  refreshButton: {
    padding: 4,
    backgroundColor: '#334155',
    borderRadius: 4,
  },
  visualization: {
    flex: 1,
  },
  webView: {
    flex: 1,
    backgroundColor: 'transparent',
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
}); 