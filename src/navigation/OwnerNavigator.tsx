import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import owner screens
import OwnerHomeScreen from '@/features/home/screens/OwnerHomeScreen';
import SaludScreen from '@/features/health/screens/SaludScreen';
import EsteticaScreen from '@/features/grooming/screens/EsteticaScreen';
import OwnerAppointmentsScreen from '@/features/appointments/screens/OwnerAppointmentsScreen';
import OwnerProfileScreen from '@/features/owner/screens/OwnerProfileScreen';

// Import detail screens
import VetDetailScreen from '@/features/vets/screens/VetDetailScreen';
import VetReviewScreen from '@/features/vets/screens/VetReviewScreen';
import GroomingDetailScreen from '@/features/grooming/screens/GroomingDetailScreen';
import GroomingReviewScreen from '@/features/grooming/screens/GroomingReviewScreen';

// Import pet screens
import PetDetailScreen from '@/features/pets/screens/PetDetailScreen';
import PetEditScreen from '@/features/pets/screens/PetEditScreen';

// Import appointment screens
import BookAppointmentScreen from '@/features/appointments/screens/BookAppointmentScreen';
import AppointmentDetailScreen from '@/features/appointments/screens/AppointmentDetailScreen';

// Import other screens
import NotificationsScreen from '@/features/notifications/screens/NotificationsScreen';
import ChatsScreen from '@/features/chats/screens/ChatsScreen';
import IndividualChatScreen from '@/features/chats/screens/IndividualChatScreen';
import SettingsScreen from '@/features/settings/screens/SettingsScreen';

const OwnerNavigator = () => {
  return (
    <Routes>
      {/* Main tabs */}
      <Route path="/" element={<OwnerHomeScreen />} />
      <Route path="/owner/home" element={<OwnerHomeScreen />} />
      <Route path="/owner/health" element={<SaludScreen />} />
      <Route path="/owner/grooming" element={<EsteticaScreen />} />
      <Route path="/owner/appointments" element={<OwnerAppointmentsScreen />} />
      <Route path="/owner/profile" element={<OwnerProfileScreen />} />

      {/* Vet detail and review screens */}
      <Route path="/owner/vets/:id" element={<VetDetailScreen />} />
      <Route path="/owner/vets/:id/review" element={<VetReviewScreen />} />

      {/* Grooming detail and review screens */}
      <Route path="/owner/grooming/:id" element={<GroomingDetailScreen />} />
      <Route path="/owner/grooming/:id/review" element={<GroomingReviewScreen />} />

      {/* Pet screens */}
      <Route path="/owner/pets/:id" element={<PetDetailScreen />} />
      <Route path="/owner/pets/:id/edit" element={<PetEditScreen />} />

      {/* Appointment screens */}
      <Route path="/owner/appointments/book/:vetId" element={<BookAppointmentScreen />} />
      <Route path="/owner/appointments/:id" element={<AppointmentDetailScreen />} />

      {/* Other screens */}
      <Route path="/notifications" element={<NotificationsScreen />} />
      <Route path="/chats" element={<ChatsScreen />} />
      <Route path="/chats/:conversationId" element={<IndividualChatScreen />} />
      <Route path="/settings" element={<SettingsScreen />} />
    </Routes>
  );
};

export default OwnerNavigator;
