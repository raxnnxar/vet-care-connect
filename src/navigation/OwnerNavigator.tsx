import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ROUTES } from '@/frontend/shared/constants/routes';
import { usePets } from '@/features/pets/hooks';
import { useAuth } from '@/features/auth/hooks/useAuth';
import OwnerHomeScreen from '@/features/home/screens/OwnerHomeScreen';
import OwnerProfileScreenComponent from '@/features/owner/screens/OwnerProfileScreen';
import PetForm from '@/features/pets/components/PetForm';
import PetDetailScreen from '@/features/pets/screens/PetDetailScreen';
import OwnerAppointmentsScreen from '@/features/appointments/screens/OwnerAppointmentsScreen';
import AppointmentDetailScreen from '@/features/appointments/screens/AppointmentDetailScreen';
import FindVetsScreen from '@/features/vets/screens/FindVetsScreen';
import VetDetailScreen from '@/features/vets/screens/VetDetailScreen';
import BookAppointmentScreen from '@/features/appointments/screens/BookAppointmentScreen';
import NotificationsScreen from '@/features/notifications/screens/NotificationsScreen';
import SettingsScreen from '@/features/settings/screens/SettingsScreen';

const OwnerNavigator = () => {
  const location = useLocation();
  
  useEffect(() => {
    console.log('OwnerNavigator mounted, current path:', location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative h-full">
      <Routes>
        {/* Use consistent route naming from ROUTES constant */}
        <Route path="/" element={<OwnerHomeScreen />} />
        <Route path="/profile" element={<OwnerProfileScreenComponent />} />
        
        {/* Pet routes */}
        <Route path="/pets" element={<PetForm mode="list" />} />
        <Route path="/pets/add" element={<PetForm mode="create" />} />
        <Route path="/pets/:id" element={<PetDetailScreen />} />
        <Route path="/pets/:id/edit" element={<PetForm mode="edit" />} />
        
        {/* Appointment routes */}
        <Route path="/appointments" element={<OwnerAppointmentsScreen />} />
        <Route path="/appointments/:id" element={<AppointmentDetailScreen />} />
        <Route path="/appointments/book/:vetId" element={<BookAppointmentScreen />} />
        
        {/* Vet discovery routes */}
        <Route path="/find-vets" element={<FindVetsScreen />} />
        <Route path="/vets/:id" element={<VetDetailScreen />} />
        
        {/* Other routes */}
        <Route path="/notifications" element={<NotificationsScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
        
        {/* Default route redirects to home */}
        <Route path="*" element={<OwnerHomeScreen />} />
      </Routes>
    </div>
  );
};

export default OwnerNavigator;
