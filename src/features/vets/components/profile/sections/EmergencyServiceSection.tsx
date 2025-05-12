
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface EmergencyServiceSectionProps {
  hasEmergencyServices: boolean;
}

const EmergencyServiceSection: React.FC<EmergencyServiceSectionProps> = ({
  hasEmergencyServices
}) => {
  if (!hasEmergencyServices) {
    return null;
  }
  
  return (
    <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-md flex items-center">
      <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" />
      <div>
        <span className="text-red-600 font-medium block">
          Ofrece servicios de emergencia
        </span>
        <span className="text-red-500 text-sm">
          Disponible fuera del horario regular para casos urgentes
        </span>
      </div>
    </div>
  );
};

export default EmergencyServiceSection;
