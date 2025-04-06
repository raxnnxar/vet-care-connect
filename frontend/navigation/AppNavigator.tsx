
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigator';
import OwnerNavigator from './OwnerNavigator';
import VetNavigator from './VetNavigator';
import { UserRole } from './navigationConfig';

// Root stack for conditional navigation between flows
const RootStack = createNativeStackNavigator();

const AppNavigator = () => {
  // This would normally come from a context or state management
  // For demonstration purposes, we're using a local state
  const [userRole, setUserRole] = useState<UserRole>('unauthenticated');

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {userRole === 'unauthenticated' ? (
          // Auth flow
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        ) : userRole === 'owner' ? (
          // Pet Owner flow
          <RootStack.Screen name="OwnerFlow" component={OwnerNavigator} />
        ) : (
          // Vet flow
          <RootStack.Screen name="VetFlow" component={VetNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
