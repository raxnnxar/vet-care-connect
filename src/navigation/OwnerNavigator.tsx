
import React, { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import OwnerHomeScreen from '../features/home/screens/OwnerHomeScreen';
import OwnerProfileScreen from '../features/owner/screens/OwnerProfileScreen';
import PetForm from '../features/pets/components/PetForm';
import PetDetailScreen from '../features/pets/screens/PetDetailScreen';
import OwnerAppointmentsScreen from '../features/appointments/screens/OwnerAppointmentsScreen';
import AppointmentDetailScreen from '../features/appointments/screens/AppointmentDetailScreen';
import BookAppointmentScreen from '../features/appointments/screens/BookAppointmentScreen';
import FindVetsScreen from '../features/vets/screens/FindVetsScreen';
import VetDetailScreen from '../features/vets/screens/VetDetailScreen';
import NotificationsScreen from '../features/notifications/screens/NotificationsScreen';
import SettingsScreen from '../features/settings/screens/SettingsScreen';
import { RootState } from '@/state/store';
import { usePets } from '@/features/pets/hooks';
import { Pet } from '@/features/pets/types';

const OwnerNavigator = () => {
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const { createPet, updatePet } = usePets();

  const handleCreatePet = async (petData: any): Promise<Pet | null> => {
    try {
      const result = await createPet(petData);
      // Make sure we return the pet data from createPet or null
      return result as Pet;
    } catch (error) {
      console.error("Error creating pet:", error);
      return null;
    }
  };

  const handleUpdatePet = async (petData: any): Promise<Pet | null> => {
    if (!petData.id) return null;
    try {
      const result = await updatePet(petData.id, petData);
      // Return the updated pet data or null
      return result as Pet;
    } catch (error) {
      console.error("Error updating pet:", error);
      return null;
    }
  };

  useEffect(() => {
    console.log('OwnerNavigator mounted, current path:', location.pathname);
    // Force the role to be pet_owner when in the owner section
    if (user && !user.role && location.pathname.startsWith('/owner')) {
      console.log('User in owner section but no role set, forcing pet_owner role');
      // This is a temporary fix to prevent redirect loops
      return;
    }
  }, [
    location.pathname,
    user,
    navigate
  ]);

  return (
    <div className="relative h-full">
      <Routes>
        <Route path="/" element={<OwnerHomeScreen />} />
        <Route path="/home" element={<OwnerHomeScreen />} />
        <Route path="/profile" element={<OwnerProfileScreen />} />
        
        <Route path="/pets" element={<OwnerHomeScreen />} />
        <Route path="/pets/add" element={
          <PetForm 
            mode="create" 
            onSubmit={handleCreatePet} 
            isSubmitting={false}
          />
        } />
        <Route path="/pets/:id" element={<PetDetailScreen />} />
        <Route path="/pets/:id/edit" element={
          <PetForm 
            mode="edit" 
            onSubmit={handleUpdatePet} 
            isSubmitting={false}
          />
        } />
        
        <Route path="/appointments" element={<OwnerAppointmentsScreen />} />
        <Route path="/appointments/:id" element={<AppointmentDetailScreen />} />
        <Route path="/appointments/book/:vetId" element={<BookAppointmentScreen />} />
        
        <Route path="/find-vets" element={<FindVetsScreen />} />
        <Route path="/vets/:id" element={<VetDetailScreen />} />
        
        <Route path="/notifications" element={<NotificationsScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
        
        <Route path="*" element={<OwnerHomeScreen />} />
      </Routes>
    </div>
  );
};

export default OwnerNavigator;
