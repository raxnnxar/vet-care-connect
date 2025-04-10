
import React, { useState } from 'react';
import AuthNavigator from './AuthNavigator';
import OwnerNavigator from './OwnerNavigator';
import VetNavigator from './VetNavigator';
import { UserRole } from './navigationConfig';

const AppNavigator = () => {
  // This would normally come from a context or state management
  // For demonstration purposes, we're using a local state
  const [userRole, setUserRole] = useState<UserRole>('unauthenticated');

  return (
    <div className="w-full h-screen bg-gray-50">
      {userRole === 'unauthenticated' ? (
        // Auth flow
        <AuthNavigator />
      ) : userRole === 'pet_owner' ? (
        // Pet Owner flow
        <OwnerNavigator />
      ) : (
        // Vet flow
        <VetNavigator />
      )}
    </div>
  );
};

export default AppNavigator;
