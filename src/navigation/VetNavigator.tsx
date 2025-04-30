
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { VET_ROUTES } from './navigationConfig';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';

const VetDashboard = () => {
  return (
    <LayoutBase
      header={
        <div className="flex justify-between items-center px-4 py-3 bg-[#79D0B8]">
          <h1 className="text-white font-medium text-lg">Panel Veterinario</h1>
        </div>
      }
      footer={<NavbarInferior activeTab="home" />}
    >
      <div className="p-4">
        <div className="bg-white rounded-xl shadow-md p-6 mb-4">
          <h2 className="text-xl font-semibold text-[#4DA6A8] mb-2">¡Bienvenido!</h2>
          <p className="text-gray-600">
            Este es tu panel de veterinario. Aquí podrás gestionar tus citas,
            pacientes y ver tu agenda.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="text-[#FF8A65] font-medium mb-1">Citas Pendientes</div>
            <div className="text-2xl font-bold">0</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="text-[#4DA6A8] font-medium mb-1">Pacientes</div>
            <div className="text-2xl font-bold">0</div>
          </div>
        </div>
      </div>
    </LayoutBase>
  );
};

const UnderConstructionPage = ({ title }: { title: string }) => (
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

// This is a skeleton file until VetNavigator is properly implemented
const VetNavigator: React.FC = () => {
  return (
    <Routes>
      <Route path={VET_ROUTES.DASHBOARD} element={<VetDashboard />} />
      <Route path={VET_ROUTES.APPOINTMENTS} element={<UnderConstructionPage title="Citas" />} />
      <Route path={VET_ROUTES.PROFILE} element={<UnderConstructionPage title="Perfil" />} />
      <Route path={VET_ROUTES.SETTINGS} element={<UnderConstructionPage title="Configuración" />} />
      <Route path={VET_ROUTES.PATIENTS} element={<UnderConstructionPage title="Pacientes" />} />
      <Route path={VET_ROUTES.SCHEDULE} element={<UnderConstructionPage title="Agenda" />} />
      <Route path="*" element={<VetDashboard />} />
    </Routes>
  );
};

export default VetNavigator;
