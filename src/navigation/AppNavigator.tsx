
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

      {/* Role switcher for demo purposes */}
      <div className="fixed bottom-4 left-4 p-2 bg-white rounded-md shadow-md">
        <p className="text-sm font-semibold mb-2">Switch Role (Demo):</p>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded-md text-sm ${userRole === 'unauthenticated' ? 'bg-[#7ECEC4] text-white' : 'bg-gray-200'}`}
            onClick={() => setUserRole('unauthenticated')}
          >
            Auth
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm ${userRole === 'pet_owner' ? 'bg-[#7ECEC4] text-white' : 'bg-gray-200'}`}
            onClick={() => setUserRole('pet_owner')}
          >
            Owner
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm ${userRole === 'veterinarian' ? 'bg-[#7ECEC4] text-white' : 'bg-gray-200'}`}
            onClick={() => setUserRole('veterinarian')}
          >
            Vet
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppNavigator;
