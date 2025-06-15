
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { OWNER_ROUTES } from './navigationConfig';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import OwnerHomeScreen from '@/features/home/screens/OwnerHomeScreen';
import SaludScreen from '@/features/health/screens/SaludScreen';
import EsteticaScreen from '@/features/grooming/screens/EsteticaScreen';
import OwnerAppointmentsScreen from '@/features/appointments/screens/OwnerAppointmentsScreen';
import AppointmentDetailScreen from '@/features/appointments/screens/AppointmentDetailScreen';
import BookAppointmentScreen from '@/features/appointments/screens/BookAppointmentScreen';
import NotificationsScreen from '@/features/notifications/screens/NotificationsScreen';
import OwnerProfileScreen from '@/features/owner/screens/OwnerProfileScreen';
import ChatsScreen from '@/features/chats/screens/ChatsScreen';
import IndividualChatScreen from '@/features/chats/screens/IndividualChatScreen';
import FindVetsScreen from '@/features/vets/screens/FindVetsScreen';
import VetDetailScreen from '@/features/vets/screens/VetDetailScreen';
import VetReviewScreen from '@/features/vets/screens/VetReviewScreen';
import PetDetailScreen from '@/features/pets/screens/PetDetailScreen';
import PetEditScreen from '@/features/pets/screens/PetEditScreen';
import GroomingDetailScreen from '@/features/grooming/screens/GroomingDetailScreen';
import GroomingReviewScreen from '@/features/grooming/screens/GroomingReviewScreen';
import SettingsScreen from '@/features/settings/screens/SettingsScreen';

const OwnerNavigator: React.FC = () => {
  return (
    <Routes>
      <Route path={OWNER_ROUTES.HOME} element={<OwnerHomeScreen />} />
      <Route path={OWNER_ROUTES.SALUD} element={<SaludScreen />} />
      <Route path={OWNER_ROUTES.ESTETICA} element={<EsteticaScreen />} />
      <Route path={OWNER_ROUTES.APPOINTMENTS} element={<OwnerAppointmentsScreen />} />
      <Route path={OWNER_ROUTES.APPOINTMENT_DETAIL} element={<AppointmentDetailScreen />} />
      <Route path={OWNER_ROUTES.BOOK_APPOINTMENT} element={<BookAppointmentScreen />} />
      <Route path={OWNER_ROUTES.NOTIFICATIONS} element={<NotificationsScreen />} />
      <Route path={OWNER_ROUTES.PROFILE} element={<OwnerProfileScreen />} />
      <Route path={OWNER_ROUTES.CHATS} element={<ChatsScreen />} />
      <Route path={OWNER_ROUTES.INDIVIDUAL_CHAT} element={<IndividualChatScreen />} />
      <Route path={OWNER_ROUTES.FIND_VETS} element={<FindVetsScreen />} />
      <Route path={OWNER_ROUTES.VET_DETAIL} element={<VetDetailScreen />} />
      <Route path={OWNER_ROUTES.VET_REVIEW} element={<VetReviewScreen />} />
      <Route path={OWNER_ROUTES.PET_DETAIL} element={<PetDetailScreen />} />
      <Route path="/owner/pets/:id/edit" element={<PetEditScreen />} />
      <Route path={OWNER_ROUTES.GROOMING_DETAIL} element={<GroomingDetailScreen />} />
      <Route path={OWNER_ROUTES.GROOMING_REVIEW} element={<GroomingReviewScreen />} />
      <Route path={OWNER_ROUTES.SETTINGS} element={<SettingsScreen />} />
      
      {/* Redirect legacy grooming routes to new estetica routes */}
      <Route path="/groomers/:id" element={<GroomingDetailScreen />} />
      <Route path="/groomers/:id/review" element={<GroomingReviewScreen />} />
      
      <Route path="*" element={<OwnerHomeScreen />} />
    </Routes>
  );
};

export default OwnerNavigator;
