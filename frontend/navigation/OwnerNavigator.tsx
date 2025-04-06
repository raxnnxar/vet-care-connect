
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, Calendar, Search, User } from 'lucide-react';
import { SCREENS, defaultScreenOptions } from './navigationConfig';

// Define the owner stack param list
type OwnerStackParamList = {
  [SCREENS.OWNER_HOME]: undefined;
  [SCREENS.OWNER_PETS]: undefined;
  [SCREENS.OWNER_APPOINTMENTS]: undefined;
  [SCREENS.OWNER_PROFILE]: undefined;
};

const OwnerTab = createBottomTabNavigator<OwnerStackParamList>();
const OwnerStack = createNativeStackNavigator<OwnerStackParamList>();

// Placeholder screen components
const OwnerHomeScreen = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <h2 className="text-xl font-semibold">Owner Home Screen</h2>
    </div>
  </div>
);

const OwnerPetsScreen = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <h2 className="text-xl font-semibold">Owner Pets Screen</h2>
    </div>
  </div>
);

const OwnerAppointmentsScreen = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <h2 className="text-xl font-semibold">Owner Appointments Screen</h2>
    </div>
  </div>
);

const OwnerProfileScreen = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <h2 className="text-xl font-semibold">Owner Profile Screen</h2>
    </div>
  </div>
);

// Main owner navigator with bottom tabs
const OwnerNavigator = () => {
  return (
    <OwnerTab.Navigator 
      initialRouteName={SCREENS.OWNER_HOME}
      screenOptions={{ 
        tabBarActiveTintColor: '#0284c7',
        tabBarInactiveTintColor: '#64748b',
        headerShown: true,
        ...defaultScreenOptions
      }}
    >
      <OwnerTab.Screen 
        name={SCREENS.OWNER_HOME} 
        component={OwnerHomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />
        }}
      />
      <OwnerTab.Screen 
        name={SCREENS.OWNER_PETS} 
        component={OwnerPetsScreen}
        options={{
          title: 'My Pets',
          tabBarIcon: ({ color }) => <Search size={24} color={color} />
        }}
      />
      <OwnerTab.Screen 
        name={SCREENS.OWNER_APPOINTMENTS} 
        component={OwnerAppointmentsScreen}
        options={{
          title: 'Appointments',
          tabBarIcon: ({ color }) => <Calendar size={24} color={color} />
        }}
      />
      <OwnerTab.Screen 
        name={SCREENS.OWNER_PROFILE} 
        component={OwnerProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User size={24} color={color} />
        }}
      />
    </OwnerTab.Navigator>
  );
};

export default OwnerNavigator;
