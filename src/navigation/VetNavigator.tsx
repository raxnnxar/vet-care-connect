import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { VET_ROUTES } from './navigationConfig';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import VetDashboard from '@/features/vets/screens/VetDashboard';
import VetProfileScreen from '@/features/vets/screens/VetProfileScreen';
import VetScheduleScreen from '@/features/vets/screens/VetScheduleScreen';
import VetWeeklyAgendaScreen from '@/features/vets/screens/VetWeeklyAgendaScreen';
import ChatsScreen from '@/features/chats/screens/ChatsScreen';
import IndividualChatScreen from '@/features/chats/screens/IndividualChatScreen';
import SettingsScreen from '@/features/settings/screens/SettingsScreen';
import DetallesCitaScreen from '@/features/vets/screens/DetallesCitaScreen';
import VetPetMedicalScreen from '@/features/vets/screens/VetPetMedicalScreen';
import VetAppointmentHistoryScreen from '@/features/vets/screens/VetAppointmentHistoryScreen';

interface UnderConstructionPageProps {
  title: string;
}

const UnderConstructionPage: React.FC<UnderConstructionPageProps> = ({ title }) => (
  <LayoutBase
    header={
      <div className="flex justify-between items-center px-4 py-3 bg-[#79D0B8]">
        <h1 className="text-white font-medium text-lg">{title}</h1>
      </div>
    }
    footer={<NavbarInferior activeTab="home" />}
  >
    <div className="flex flex-col items-center justify-center p-8 h-[70vh]">
      <div className="bg-white rounded-xl shadow-md p-6 text-center">
        <h2 className="text-xl font-semibold text-[#4DA6A8] mb-4">En Construcción</h2>
        <p className="text-gray-600">
          Esta sección estará disponible próximamente.
        </p>
      </div>
    </div>
  </LayoutBase>
);

const VetNavigator: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<VetDashboard />} />
      <Route path={VET_ROUTES.DASHBOARD.replace('/vet', '')} element={<VetDashboard />} />
      <Route path={VET_ROUTES.APPOINTMENTS.replace('/vet', '')} element={<UnderConstructionPage title="Citas" />} />
      <Route path={VET_ROUTES.PROFILE.replace('/vet', '')} element={<VetProfileScreen />} />
      <Route path={VET_ROUTES.SETTINGS.replace('/vet', '')} element={<SettingsScreen />} />
      <Route path={VET_ROUTES.PATIENTS.replace('/vet', '')} element={<UnderConstructionPage title="Pacientes" />} />
      <Route path={VET_ROUTES.SCHEDULE.replace('/vet', '')} element={<VetScheduleScreen />} />
      <Route path={VET_ROUTES.CHATS.replace('/vet', '')} element={<ChatsScreen />} />
      <Route path={VET_ROUTES.INDIVIDUAL_CHAT.replace('/vet', '')} element={<IndividualChatScreen />} />
      <Route path="agenda" element={<VetWeeklyAgendaScreen />} />
      <Route path="detalles-cita/:id" element={<DetallesCitaScreen />} />
      <Route path="detalles-cita/:id/expediente-medico" element={<VetPetMedicalScreen />} />
      <Route path="historial-citas" element={<VetAppointmentHistoryScreen />} />
      <Route path="*" element={<VetDashboard />} />
    </Routes>
  );
};

export default VetNavigator;
