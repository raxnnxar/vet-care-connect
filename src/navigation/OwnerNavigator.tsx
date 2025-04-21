import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import OwnerHomeScreen from '../features/owner/screens/OwnerHomeScreen';
import OwnerProfileScreen from '../features/profile/screens/OwnerProfileScreen';
import PetForm from '../features/pets/components/PetForm';
import PetDetailsScreen from '../features/pets/screens/PetDetailsScreen';
import AppointmentBookingScreen from '../features/appointments/screens/AppointmentBookingScreen';
import AppointmentDetailsScreen from '../features/appointments/screens/AppointmentDetailsScreen';
import AppointmentsListScreen from '../features/appointments/screens/AppointmentsListScreen';
import OwnerLayout from '../layouts/OwnerLayout';
import { ROUTES } from '../frontend/shared/constants/routes';
import { usePets } from '../features/pets/hooks';

const OwnerNavigator = () => {
  const { user } = useSelector((state: any) => state.auth);
  const { createPet } = usePets();

  // Redirect if user is not authenticated or not a pet owner
  if (!user || user.role !== 'pet_owner') {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  const handleAddPet = async (petData: any) => {
    if (!user?.id) return null;
    
    const completeData = {
      ...petData,
      owner_id: user.id
    };
    
    return await createPet(completeData);
  };

  return (
    <OwnerLayout>
      <Routes>
        <Route path="/" element={<OwnerHomeScreen />} />
        <Route path="/profile" element={<OwnerProfileScreen />} />
        <Route path="/pets/new" element={
          <PetForm 
            onSubmit={handleAddPet} 
            isSubmitting={false} 
          />
        } />
        <Route path="/pets/:petId" element={<PetDetailsScreen />} />
        <Route path="/appointments" element={<AppointmentsListScreen />} />
        <Route path="/appointments/new" element={<AppointmentBookingScreen />} />
        <Route path="/appointments/:appointmentId" element={<AppointmentDetailsScreen />} />
        <Route path="*" element={<Navigate to="/owner" replace />} />
      </Routes>
    </OwnerLayout>
  );
};

export default OwnerNavigator;
