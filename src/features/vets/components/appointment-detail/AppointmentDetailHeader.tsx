
import React from 'react';
import { Button } from '@/ui/atoms/button';
import { ArrowLeft } from 'lucide-react';

interface AppointmentDetailHeaderProps {
  onBack: () => void;
  petName?: string;
}

const AppointmentDetailHeader: React.FC<AppointmentDetailHeaderProps> = ({
  onBack,
  petName
}) => {
  return (
    <div className="flex items-center px-4 py-3 bg-[#79D0B8]">
      <Button variant="ghost" size="icon" className="text-white" onClick={onBack}>
        <ArrowLeft />
      </Button>
      <h1 className="text-white font-medium text-lg ml-2">
        Detalles de Cita - {petName || 'Mascota'}
      </h1>
    </div>
  );
};

export default AppointmentDetailHeader;
