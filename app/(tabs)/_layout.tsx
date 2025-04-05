import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Home, Users, Trophy, AlertCircle, AlertTriangle, 
  Leaf, Wind, Drone, Zap
} from 'lucide-react-native';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Home>['name'];
  color: string;
}) {
  switch (props.name) {
    case 'home':
      return <Home size={24} color={props.color} />;
    case 'users':
      return <Users size={24} color={props.color} />;
    case 'trophy':
      return <Trophy size={24} color={props.color} />;
    case 'alert-circle':
      return <AlertCircle size={24} color={props.color} />;
    case 'alert-triangle':
      return <AlertTriangle size={24} color={props.color} />;
    case 'leaf':
      return <Leaf size={24} color={props.color} />;
    case 'wind':
      return <Wind size={24} color={props.color} />;
    case 'drone':
      return <Drone size={24} color={props.color} />;
    case 'zap':
      return <Zap size={24} color={props.color} />;
    default:
      return <Home size={24} color={props.color} />;
  }
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#22C55E',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
        },
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
          fontWeight: '500',
        },
        header: (props) => {
          return (
            <SafeAreaView
              edges={['top']}
              style={{ backgroundColor: '#FFFFFF' }}
            >
              {props.options.header?.(props) ?? null}
            </SafeAreaView>
          );
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="home" color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="users" color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="forest"
        options={{
          title: 'Forest',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="leaf" color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="energy"
        options={{
          title: 'Energy',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="zap" color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="drone"
        options={{
          title: 'Drone',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="drone" color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="disaster"
        options={{
          title: 'Disaster',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="alert-triangle" color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="alert-circle" color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="ewaste"
        options={{
          title: 'E-Waste',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="wind" color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="quests"
        options={{
          title: 'Quests',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="trophy" color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
        }}
      />
    </Tabs>
  );
}