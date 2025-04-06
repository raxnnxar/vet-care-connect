
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
      ) : userRole === 'owner' ? (
        // Pet Owner flow
        <OwnerNavigator />
      ) : (
        // Vet flow
        <VetNavigator />
      )}

      {/* Role switcher for demo purposes */}
      <div className="fixed bottom-4 left-4 p-2 bg-white rounded-md shadow-md">
        <p className="text-sm font-semibold mb-2">Switch Role (Demo):</p>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded-md text-sm ${userRole === 'unauthenticated' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setUserRole('unauthenticated')}
          >
            Auth
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm ${userRole === 'owner' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setUserRole('owner')}
          >
            Owner
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm ${userRole === 'vet' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setUserRole('vet')}
          >
            Vet
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppNavigator;
