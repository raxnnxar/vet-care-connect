
import React from 'react';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { Button } from '@/ui/atoms/button';
import { ArrowLeft } from 'lucide-react';

interface AppointmentDetailErrorProps {
  onBack: () => void;
}

const AppointmentDetailError: React.FC<AppointmentDetailErrorProps> = ({ onBack }) => {
  return (
    <LayoutBase
      header={
        <div className="flex items-center px-4 py-3 bg-[#79D0B8]">
          <Button variant="ghost" size="icon" className="text-white" onClick={onBack}>
            <ArrowLeft />
          </Button>
          <h1 className="text-white font-medium text-lg ml-2">Detalles de Cita</h1>
        </div>
      }
      footer={<NavbarInferior activeTab="home" />}
    >
      <div className="p-4 text-center">
        <p className="text-gray-500 mb-3">No se encontraron detalles para esta cita</p>
        <Button 
          className="bg-[#79D0B8] hover:bg-[#5FBFB3]"
          onClick={onBack}
        >
          Volver
        </Button>
      </div>
    </LayoutBase>
  );
};

export default AppointmentDetailError;
