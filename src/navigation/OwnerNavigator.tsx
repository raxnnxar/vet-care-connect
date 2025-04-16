
import React, { useState, useEffect } from 'react';
import { Home, Calendar, Search, User } from 'lucide-react';
import { SCREENS } from './navigationConfig';
import { usePets } from '@/features/pets/hooks';
import { useAuth } from '@/features/auth/hooks/useAuth';

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
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  useEffect(() => {
    if (user?.id) {
      getCurrentUserPets();
    }
  }, [user, getCurrentUserPets]);
  
  const handleSubmit = async (data) => {
    try {
      const result = await createPet(data);
      if (result) {
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      }
      return result;
    } catch (error) {
      console.error("Error adding pet:", error);
      return null;
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Agregar nueva mascota</h2>
      
      {showSuccessMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-4 mb-4">
          ¡Mascota agregada exitosamente!
        </div>
      )}
      
      {pets && pets.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Mis mascotas</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pets.map(pet => (
              <div key={pet.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  {pet.profile_picture_url && (
                    <div className="h-12 w-12 rounded-full overflow-hidden">
                      <img 
                        src={pet.profile_picture_url} 
                        alt={pet.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{pet.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {pet.species} {pet.breed ? `· ${pet.breed}` : ''}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
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
