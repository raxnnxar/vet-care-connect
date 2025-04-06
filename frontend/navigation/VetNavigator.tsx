
import React from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, Calendar, Users, User } from 'lucide-react';
import { SCREENS, defaultScreenOptions } from './navigationConfig';

// Define the vet stack param list
type VetStackParamList = {
  [SCREENS.VET_DASHBOARD]: undefined;
  [SCREENS.VET_APPOINTMENTS]: undefined;
  [SCREENS.VET_PATIENTS]: undefined;
  [SCREENS.VET_PROFILE]: undefined;
};

const VetTab = createBottomTabNavigator<VetStackParamList>();
const VetStack = createNativeStackNavigator<VetStackParamList>();

// Placeholder screen components
const VetDashboardScreen = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Vet Dashboard Screen</Text>
  </View>
);

const VetAppointmentsScreen = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Vet Appointments Screen</Text>
  </View>
);

const VetPatientsScreen = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Vet Patients Screen</Text>
  </View>
);

const VetProfileScreen = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Vet Profile Screen</Text>
  </View>
);

// Main vet navigator with bottom tabs
const VetNavigator = () => {
  return (
    <VetTab.Navigator 
      initialRouteName={SCREENS.VET_DASHBOARD}
      screenOptions={{ 
        tabBarActiveTintColor: '#0284c7',
        tabBarInactiveTintColor: '#64748b',
        headerShown: true,
        ...defaultScreenOptions
      }}
    >
      <VetTab.Screen 
        name={SCREENS.VET_DASHBOARD} 
        component={VetDashboardScreen}
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />
        }}
      />
      <VetTab.Screen 
        name={SCREENS.VET_APPOINTMENTS} 
        component={VetAppointmentsScreen}
        options={{
          title: 'Schedule',
          tabBarIcon: ({ color }) => <Calendar size={24} color={color} />
        }}
      />
      <VetTab.Screen 
        name={SCREENS.VET_PATIENTS} 
        component={VetPatientsScreen}
        options={{
          title: 'Patients',
          tabBarIcon: ({ color }) => <Users size={24} color={color} />
        }}
      />
      <VetTab.Screen 
        name={SCREENS.VET_PROFILE} 
        component={VetProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User size={24} color={color} />
        }}
      />
    </VetTab.Navigator>
  );
};

export default VetNavigator;
