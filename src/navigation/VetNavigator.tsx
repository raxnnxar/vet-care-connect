
import React, { useState } from 'react';
import { Home, Calendar, Users, User } from 'lucide-react';
import { SCREENS } from './navigationConfig';

type VetScreen = 'VetDashboard' | 'VetAppointments' | 'VetPatients' | 'VetProfile';

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
  const [currentScreen, setCurrentScreen] = useState<VetScreen>('VetDashboard');
  
  const renderScreen = () => {
    switch (currentScreen) {
      case 'VetDashboard':
        return <VetDashboardScreen />;
      case 'VetAppointments':
        return <VetAppointmentsScreen />;
      case 'VetPatients':
        return <VetPatientsScreen />;
      case 'VetProfile':
        return <VetProfileScreen />;
      default:
        return <VetDashboardScreen />;
    }
  };

  return (
    <div className="relative h-full">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm border-b">
        <h1 className="text-lg font-semibold">
          {currentScreen === 'VetDashboard' ? 'Dashboard' : 
           currentScreen === 'VetAppointments' ? 'Schedule' :
           currentScreen === 'VetPatients' ? 'Patients' : 'Profile'}
        </h1>
      </div>
      
      {/* Screen content */}
      {renderScreen()}

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center p-3">
        <button 
          onClick={() => setCurrentScreen('VetDashboard')}
          className={`flex flex-col items-center ${currentScreen === 'VetDashboard' ? 'text-blue-600' : 'text-gray-500'}`}
        >
          <Home size={24} />
          <span className="text-xs mt-1">Dashboard</span>
        </button>
        <button 
          onClick={() => setCurrentScreen('VetAppointments')}
          className={`flex flex-col items-center ${currentScreen === 'VetAppointments' ? 'text-blue-600' : 'text-gray-500'}`}
        >
          <Calendar size={24} />
          <span className="text-xs mt-1">Schedule</span>
        </button>
        <button 
          onClick={() => setCurrentScreen('VetPatients')}
          className={`flex flex-col items-center ${currentScreen === 'VetPatients' ? 'text-blue-600' : 'text-gray-500'}`}
        >
          <Users size={24} />
          <span className="text-xs mt-1">Patients</span>
        </button>
        <button 
          onClick={() => setCurrentScreen('VetProfile')}
          className={`flex flex-col items-center ${currentScreen === 'VetProfile' ? 'text-blue-600' : 'text-gray-500'}`}
        >
          <User size={24} />
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default VetNavigator;
