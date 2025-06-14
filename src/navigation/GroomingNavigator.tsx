
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { GROOMING_ROUTES } from './navigationConfig';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import GroomingDashboard from '@/features/grooming/screens/GroomingDashboard';
import GroomingProfileScreen from '@/features/grooming/screens/GroomingProfileScreen';
import GroomingWeeklyAgendaScreen from '@/features/grooming/screens/GroomingWeeklyAgendaScreen';
import ChatsScreen from '@/features/chats/screens/ChatsScreen';
import IndividualChatScreen from '@/features/chats/screens/IndividualChatScreen';
import SettingsScreen from '@/features/settings/screens/SettingsScreen';

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

const GroomingNavigator: React.FC = () => {
  return (
    <Routes>
      <Route path={GROOMING_ROUTES.DASHBOARD} element={<GroomingDashboard />} />
      <Route path={GROOMING_ROUTES.APPOINTMENTS} element={<UnderConstructionPage title="Citas" />} />
      <Route path={GROOMING_ROUTES.APPOINTMENT_DETAIL} element={<UnderConstructionPage title="Detalle de Cita" />} />
      <Route path={GROOMING_ROUTES.PROFILE} element={<GroomingProfileScreen />} />
      <Route path={GROOMING_ROUTES.SETTINGS} element={<SettingsScreen />} />
      <Route path={GROOMING_ROUTES.CHATS} element={<ChatsScreen />} />
      <Route path={GROOMING_ROUTES.INDIVIDUAL_CHAT} element={<IndividualChatScreen />} />
      <Route path={GROOMING_ROUTES.AGENDA} element={<GroomingWeeklyAgendaScreen />} />
      <Route path="*" element={<GroomingDashboard />} />
    </Routes>
  );
};

export default GroomingNavigator;
