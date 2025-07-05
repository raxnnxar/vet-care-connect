
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Home and Profile screens
import OwnerHomeScreen from '@/features/home/screens/OwnerHomeScreen';
import OwnerProfileScreen from '@/features/owner/screens/OwnerProfileScreen';

// Pet management screens
import PetsScreen from '@/pages/_pets/PetsScreen';
import AddPetScreen from '@/pages/_pets/AddPetScreen';
import PetDetailScreen from '@/features/pets/screens/PetDetailScreen';
import PetEditScreen from '@/features/pets/screens/PetEditScreen';
import PetMedicalRecordsScreen from '@/features/pets/screens/PetMedicalRecordsScreen';
import MedicalHistoryDetailScreen from '@/features/pets/screens/MedicalHistoryDetailScreen';
import VaccinationDetailScreen from '@/features/pets/screens/VaccinationDetailScreen';

// Appointment screens
import OwnerAppointmentsScreen from '@/features/appointments/screens/OwnerAppointmentsScreen';
import AppointmentDetailScreen from '@/features/appointments/screens/AppointmentDetailScreen';
import BookAppointmentScreen from '@/features/appointments/screens/BookAppointmentScreen';

// Vet and service screens
import FindVetsScreen from '@/features/vets/screens/FindVetsScreen';
import VetDetailScreen from '@/features/vets/screens/VetDetailScreen';
import VetReviewScreen from '@/features/vets/screens/VetReviewScreen';
import SaludScreen from '@/features/health/screens/SaludScreen';
import EsteticaScreen from '@/features/grooming/screens/EsteticaScreen';
import TreatmentsScreen from '@/features/treatments/screens/TreatmentsScreen';

// Communication screens
import ChatsScreen from '@/features/chats/screens/ChatsScreen';
import IndividualChatScreen from '@/features/chats/screens/IndividualChatScreen';

// Settings and notifications
import NotificationsScreen from '@/features/notifications/screens/NotificationsScreen';
import SettingsScreen from '@/features/settings/screens/SettingsScreen';
import UpdatePasswordScreen from '@/features/settings/screens/UpdatePasswordScreen';

const OwnerNavigator = () => {
  return (
    <Routes>
      <Route path="/" element={<OwnerHomeScreen />} />
      <Route path="/profile" element={<OwnerProfileScreen />} />
      <Route path="/pets" element={<PetsScreen />} />
      <Route path="/pets/add" element={<AddPetScreen />} />
      <Route path="/pets/:id" element={<PetDetailScreen />} />
      <Route path="/pets/:id/edit" element={<PetEditScreen />} />
      <Route path="/pets/:id/medical" element={<PetMedicalRecordsScreen />} />
      <Route path="/pets/:id/medical/:recordId" element={<MedicalHistoryDetailScreen />} />
      <Route path="/pets/:id/vaccination/:vaccinationId" element={<VaccinationDetailScreen />} />
      <Route path="/appointments" element={<OwnerAppointmentsScreen />} />
      <Route path="/appointments/:id" element={<AppointmentDetailScreen />} />
      <Route path="/appointments/book/:vetId" element={<BookAppointmentScreen />} />
      <Route path="/find-vets" element={<FindVetsScreen />} />
      <Route path="/vets/:id" element={<VetDetailScreen />} />
      <Route path="/vets/:id/review" element={<VetReviewScreen />} />
      <Route path="/salud" element={<SaludScreen />} />
      <Route path="/estetica" element={<EsteticaScreen />} />
      <Route path="/treatments" element={<TreatmentsScreen />} />
      <Route path="/chats" element={<ChatsScreen />} />
      <Route path="/chats/:conversationId" element={<IndividualChatScreen />} />
      <Route path="/notifications" element={<NotificationsScreen />} />
      <Route path="/settings" element={<SettingsScreen />} />
      <Route path="/update-password" element={<UpdatePasswordScreen />} />
    </Routes>
  );
};

export default OwnerNavigator;
