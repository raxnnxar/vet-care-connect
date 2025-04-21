
import React from 'react';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { Switch } from '@/ui/atoms/switch';
import { Card } from '@/ui/molecules/card';

const SettingsScreen = () => {
  return (
    <LayoutBase
      header={
        <div className="flex justify-between items-center px-4 py-3 bg-[#5FBFB3]">
          <h1 className="text-white text-xl font-semibold">Configuración</h1>
        </div>
      }
      footer={<NavbarInferior activeTab="settings" />}
    >
      <div className="p-4 space-y-4">
        <Card className="p-4">
          <h2 className="font-medium mb-4">Notificaciones</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Recordatorios de citas</p>
                <p className="text-sm text-gray-500">Recibe alertas sobre tus próximas citas</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Promociones</p>
                <p className="text-sm text-gray-500">Recibe información sobre ofertas y descuentos</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <h2 className="font-medium mb-4">Preferencias</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Idioma</p>
                <p className="text-sm text-gray-500">Español</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Moneda</p>
                <p className="text-sm text-gray-500">Peso Mexicano (MXN)</p>
              </div>
            </div>
          </div>
        </Card>
        
        <div className="text-center py-4 text-sm text-gray-500">
          Versión 1.0.0
        </div>
      </div>
    </LayoutBase>
  );
};

export default SettingsScreen;
