
import React, { useState } from 'react';
import { Home, Calendar, Search, User } from 'lucide-react';
import { SCREENS } from './navigationConfig';

type OwnerScreen = 'OwnerHome' | 'OwnerPets' | 'OwnerAppointments' | 'OwnerProfile';

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
  const [currentScreen, setCurrentScreen] = useState<OwnerScreen>('OwnerHome');
  
  const renderScreen = () => {
    switch (currentScreen) {
      case 'OwnerHome':
        return <OwnerHomeScreen />;
      case 'OwnerPets':
        return <OwnerPetsScreen />;
      case 'OwnerAppointments':
        return <OwnerAppointmentsScreen />;
      case 'OwnerProfile':
        return <OwnerProfileScreen />;
      default:
        return <OwnerHomeScreen />;
    }
  };

  return (
    <div className="relative h-full">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm border-b">
        <h1 className="text-lg font-semibold">
          {currentScreen === 'OwnerHome' ? 'Home' : 
           currentScreen === 'OwnerPets' ? 'My Pets' :
           currentScreen === 'OwnerAppointments' ? 'Appointments' : 'Profile'}
        </h1>
      </div>
      
      {/* Screen content */}
      {renderScreen()}

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center p-3">
        <button 
          onClick={() => setCurrentScreen('OwnerHome')}
          className={`flex flex-col items-center ${currentScreen === 'OwnerHome' ? 'text-blue-600' : 'text-gray-500'}`}
        >
          <Home size={24} />
          <span className="text-xs mt-1">Home</span>
        </button>
        <button 
          onClick={() => setCurrentScreen('OwnerPets')}
          className={`flex flex-col items-center ${currentScreen === 'OwnerPets' ? 'text-blue-600' : 'text-gray-500'}`}
        >
          <Search size={24} />
          <span className="text-xs mt-1">My Pets</span>
        </button>
        <button 
          onClick={() => setCurrentScreen('OwnerAppointments')}
          className={`flex flex-col items-center ${currentScreen === 'OwnerAppointments' ? 'text-blue-600' : 'text-gray-500'}`}
        >
          <Calendar size={24} />
          <span className="text-xs mt-1">Appointments</span>
        </button>
        <button 
          onClick={() => setCurrentScreen('OwnerProfile')}
          className={`flex flex-col items-center ${currentScreen === 'OwnerProfile' ? 'text-blue-600' : 'text-gray-500'}`}
        >
          <User size={24} />
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default OwnerNavigator;
