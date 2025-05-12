
import React from 'react';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';

const VetScheduleScreen = () => {
  return (
    <LayoutBase
      header={
        <div className="flex justify-between items-center px-4 py-3 bg-[#79D0B8]">
          <h1 className="text-white font-medium text-lg">Mi Agenda</h1>
        </div>
      }
      footer={<NavbarInferior activeTab="schedule" />}
    >
      <div className="p-4">
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <h2 className="text-xl font-semibold text-[#4DA6A8] mb-4">Agenda</h2>
          <p className="text-gray-600 mb-4">
            Aquí podrás gestionar tu disponibilidad y citas programadas.
          </p>
          
          <div className="p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-400">
              No tienes ninguna cita programada en este momento.
            </p>
          </div>
        </div>
      </div>
    </LayoutBase>
  );
};

export default VetScheduleScreen;
