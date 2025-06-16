
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { VET_ROUTES } from './navigationConfig';
import VetDashboard from '@/features/vets/screens/VetDashboard';
import VetAppointmentDetailScreen from '@/features/vets/screens/VetAppointmentDetailScreen';
import VetScheduleScreen from '@/features/vets/screens/VetScheduleScreen';
import VetProfileScreen from '@/features/vets/screens/VetProfileScreen';
import SettingsScreen from '@/features/settings/screens/SettingsScreen';
import ChatsScreen from '@/features/chats/screens/ChatsScreen';
import IndividualChatScreen from '@/features/chats/screens/IndividualChatScreen';
import VetWeeklyAgendaScreen from '@/features/vets/screens/VetWeeklyAgendaScreen';

const VetNavigator: React.FC = () => {
  return (
    <Routes>
      <Route path={VET_ROUTES.DASHBOARD} element={<VetDashboard />} />
      <Route path={VET_ROUTES.APPOINTMENTS} element={<VetDashboard />} />
      <Route path={VET_ROUTES.APPOINTMENT_DETAIL} element={<VetAppointmentDetailScreen />} />
      <Route path={VET_ROUTES.SCHEDULE} element={<VetScheduleScreen />} />
      <Route path={VET_ROUTES.PROFILE} element={<VetProfileScreen />} />
      <Route path={VET_ROUTES.SETTINGS} element={<SettingsScreen />} />
      <Route path={VET_ROUTES.CHATS} element={<ChatsScreen />} />
      <Route path={VET_ROUTES.INDIVIDUAL_CHAT} element={<IndividualChatScreen />} />
      <Route path={VET_ROUTES.AGENDA} element={<VetWeeklyAgendaScreen />} />
      <Route path="*" element={<VetDashboard />} />
    </Routes>
  );
};

export default VetNavigator;
