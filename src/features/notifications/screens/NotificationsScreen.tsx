
import React from 'react';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';

const NotificationsScreen = () => {
  return (
    <LayoutBase
      header={
        <div className="flex justify-between items-center px-4 py-3 bg-[#5FBFB3]">
          <h1 className="text-white text-xl font-semibold">Notificaciones</h1>
        </div>
      }
      footer={<NavbarInferior activeTab="home" />}
    >
      <div className="p-4">
        <div className="text-center py-8">
          <p className="text-gray-500">No tienes notificaciones nuevas</p>
        </div>
      </div>
    </LayoutBase>
  );
};

export default NotificationsScreen;
