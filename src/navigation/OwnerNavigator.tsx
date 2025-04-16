
import React, { useState } from 'react';
import { Home, Calendar, Search, User } from 'lucide-react';
import { SCREENS } from './navigationConfig';
import { usePets } from '@/features/pets/hooks/usePets';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useEffect } from 'react';

type OwnerScreen = 'OwnerHome' | 'OwnerPets' | 'OwnerAppointments' | 'OwnerProfile';

// Import PetScreen component
import PetForm from '@/features/pets/components/PetForm';

// Placeholder screen components
const OwnerHomeScreen = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <h2 className="text-xl font-semibold">Owner Home Screen</h2>
    </div>
  </div>
);

const OwnerPetsScreen = () => {
  const { createPet, isLoading, error, getCurrentUserPets, pets } = usePets();
  const { user } = useAuth();
  
  useEffect(() => {
    if (user?.id) {
      getCurrentUserPets();
    }
  }, [user, getCurrentUserPets]);
  
  const handleSubmit = async (data) => {
    try {
      const result = await createPet(data);
      return result;
    } catch (error) {
      console.error("Error adding pet:", error);
      return null;
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Agregar nueva mascota</h2>
      <PetForm onSubmit={handleSubmit} isSubmitting={isLoading} />
    </div>
  );
};

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
  const [currentScreen, setCurrentScreen] = useState<OwnerScreen>('OwnerPets');
  
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
          {currentScreen === 'OwnerHome' ? 'Inicio' : 
           currentScreen === 'OwnerPets' ? 'Mis Mascotas' :
           currentScreen === 'OwnerAppointments' ? 'Citas' : 'Perfil'}
        </h1>
      </div>
      
      {/* Screen content */}
      <div className="pb-16">
        {renderScreen()}
      </div>

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center p-3">
        <button 
          onClick={() => setCurrentScreen('OwnerHome')}
          className={`flex flex-col items-center ${currentScreen === 'OwnerHome' ? 'text-primary' : 'text-gray-500'}`}
        >
          <Home size={24} />
          <span className="text-xs mt-1">Inicio</span>
        </button>
        <button 
          onClick={() => setCurrentScreen('OwnerPets')}
          className={`flex flex-col items-center ${currentScreen === 'OwnerPets' ? 'text-primary' : 'text-gray-500'}`}
        >
          <Search size={24} />
          <span className="text-xs mt-1">Mis Mascotas</span>
        </button>
        <button 
          onClick={() => setCurrentScreen('OwnerAppointments')}
          className={`flex flex-col items-center ${currentScreen === 'OwnerAppointments' ? 'text-primary' : 'text-gray-500'}`}
        >
          <Calendar size={24} />
          <span className="text-xs mt-1">Citas</span>
        </button>
        <button 
          onClick={() => setCurrentScreen('OwnerProfile')}
          className={`flex flex-col items-center ${currentScreen === 'OwnerProfile' ? 'text-primary' : 'text-gray-500'}`}
        >
          <User size={24} />
          <span className="text-xs mt-1">Perfil</span>
        </button>
      </div>
    </div>
  );
};

export default OwnerNavigator;
