
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { OWNER_ROUTES } from './navigationConfig';
import OwnerHomeScreen from '@/features/home/screens/OwnerHomeScreen';
import OwnerAppointmentsScreen from '@/features/appointments/screens/OwnerAppointmentsScreen';
import AppointmentDetailScreen from '@/features/appointments/screens/AppointmentDetailScreen';
import BookAppointmentScreen from '@/features/appointments/screens/BookAppointmentScreen';
import OwnerProfileScreen from '@/features/owner/screens/OwnerProfileScreen';
import PetDetailScreen from '@/features/pets/screens/PetDetailScreen';
import FindVetsScreen from '@/features/vets/screens/FindVetsScreen';
import VetDetailScreen from '@/features/vets/screens/VetDetailScreen';
import VetReviewScreen from '@/features/vets/screens/VetReviewScreen';
import SaludScreen from '@/features/health/screens/SaludScreen';
import NotificationsScreen from '@/features/notifications/screens/NotificationsScreen';
import SettingsScreen from '@/features/settings/screens/SettingsScreen';
import ChatsScreen from '@/features/chats/screens/ChatsScreen';

const OwnerNavigator: React.FC = () => {
  return (
    <Routes>
      <Route path={OWNER_ROUTES.HOME} element={<OwnerHomeScreen />} />
      <Route path={OWNER_ROUTES.APPOINTMENTS} element={<OwnerAppointmentsScreen />} />
      <Route path={OWNER_ROUTES.APPOINTMENT_DETAIL} element={<AppointmentDetailScreen />} />
      <Route path={OWNER_ROUTES.BOOK_APPOINTMENT} element={<BookAppointmentScreen />} />
      <Route path={OWNER_ROUTES.PROFILE} element={<OwnerProfileScreen />} />
      <Route path={OWNER_ROUTES.PET_DETAIL} element={<PetDetailScreen />} />
      <Route path={OWNER_ROUTES.FIND_VETS} element={<FindVetsScreen />} />
      <Route path={OWNER_ROUTES.VET_DETAIL} element={<VetDetailScreen />} />
      <Route path={OWNER_ROUTES.VET_REVIEW} element={<VetReviewScreen />} />
      <Route path={OWNER_ROUTES.SALUD} element={<SaludScreen />} />
      <Route path={OWNER_ROUTES.NOTIFICATIONS} element={<NotificationsScreen />} />
      <Route path={OWNER_ROUTES.SETTINGS} element={<SettingsScreen />} />
      <Route path={OWNER_ROUTES.CHATS} element={<ChatsScreen />} />
      <Route path="*" element={<OwnerHomeScreen />} />
    </Routes>
  );
};

export default OwnerNavigator;
