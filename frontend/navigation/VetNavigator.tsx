
import React from 'react';
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
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <h2 className="text-xl font-semibold">Vet Dashboard Screen</h2>
    </div>
  </div>
);

const VetAppointmentsScreen = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <h2 className="text-xl font-semibold">Vet Appointments Screen</h2>
    </div>
  </div>
);

const VetPatientsScreen = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <h2 className="text-xl font-semibold">Vet Patients Screen</h2>
    </div>
  </div>
);

const VetProfileScreen = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <h2 className="text-xl font-semibold">Vet Profile Screen</h2>
    </div>
  </div>
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
