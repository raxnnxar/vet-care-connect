
import React from 'react';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { Button } from '@/ui/atoms/button';
import { ArrowLeft } from 'lucide-react';

interface AppointmentDetailLoadingProps {
  onBack: () => void;
}

const AppointmentDetailLoading: React.FC<AppointmentDetailLoadingProps> = ({ onBack }) => {
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
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    </LayoutBase>
  );
};

export default AppointmentDetailLoading;
