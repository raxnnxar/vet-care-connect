import React, { useState, useEffect } from 'react';
import { Home, Calendar, Search, User, Settings, MessageSquare } from 'lucide-react';
import OwnerHomeScreen from '@/features/home/screens/OwnerHomeScreen';
import { SCREENS } from './navigationConfig';
import { usePets } from '@/features/pets/hooks';
import { useAuth } from '@/features/auth/hooks/useAuth';
import OwnerProfileScreenComponent from '@/features/owner/screens/OwnerProfileScreen';

type OwnerScreen = 'OwnerHome' | 'OwnerPets' | 'OwnerAppointments' | 'OwnerProfile';

import PetForm from '@/features/pets/components/PetForm';

const OwnerHomeScreenOld = () => (
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

const OwnerNavigator = () => {
  const [currentScreen, setCurrentScreen] = useState<OwnerScreen>('OwnerHome');
  
  const renderScreen = () => {
    switch (currentScreen) {
      case 'OwnerHome':
        return <OwnerHomeScreen />;
      case 'OwnerPets':
        return <OwnerPetsScreen />;
      case 'OwnerProfile':
        return <OwnerProfileScreenComponent />;
      case 'OwnerAppointments':
        return <OwnerAppointmentsScreen />;
      default:
        return <OwnerHomeScreen />;
    }
  };

  return (
    <div className="relative h-full">
      {renderScreen()}
    </div>
  );
};

export default OwnerNavigator;
