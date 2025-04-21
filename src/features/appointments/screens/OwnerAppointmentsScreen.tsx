
import React from 'react';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';

const OwnerAppointmentsScreen = () => {
  return (
    <LayoutBase
      header={
        <div className="flex justify-between items-center px-4 py-3 bg-[#5FBFB3]">
          <h1 className="text-white text-xl font-semibold">Mis Citas</h1>
        </div>
      }
      footer={<NavbarInferior activeTab="appointments" />}
    >
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Próximas Citas</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">No tienes citas programadas</p>
        </div>
      </div>
    </LayoutBase>
  );
};

export default OwnerAppointmentsScreen;
