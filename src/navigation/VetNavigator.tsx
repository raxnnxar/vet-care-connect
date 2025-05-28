
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { VET_ROUTES } from './navigationConfig';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import VetDashboard from '@/features/vets/screens/VetDashboard';
import VetAppointmentDetailScreen from '@/features/vets/screens/VetAppointmentDetailScreen';
import VetProfileScreen from '@/features/vets/screens/VetProfileScreen';
import VetScheduleScreen from '@/features/vets/screens/VetScheduleScreen';
import VetWeeklyAgendaScreen from '@/features/vets/screens/VetWeeklyAgendaScreen';

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
      <Route path={VET_ROUTES.DASHBOARD} element={<VetDashboard />} />
      <Route path={VET_ROUTES.APPOINTMENTS} element={<UnderConstructionPage title="Citas" />} />
      <Route path={VET_ROUTES.APPOINTMENT_DETAIL} element={<VetAppointmentDetailScreen />} />
      <Route path={VET_ROUTES.PROFILE} element={<VetProfileScreen />} />
      <Route path={VET_ROUTES.SETTINGS} element={<UnderConstructionPage title="Configuración" />} />
      <Route path={VET_ROUTES.PATIENTS} element={<UnderConstructionPage title="Pacientes" />} />
      <Route path={VET_ROUTES.SCHEDULE} element={<VetScheduleScreen />} />
      <Route path="/agenda" element={<VetWeeklyAgendaScreen />} />
      <Route path="*" element={<VetDashboard />} />
    </Routes>
  );
};

export default VetNavigator;
