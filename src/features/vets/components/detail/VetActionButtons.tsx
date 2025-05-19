
import React from 'react';
import { Button } from '@/ui/atoms/button';

interface VetActionButtonsProps {
  onBookAppointment: () => void;
}

const VetActionButtons: React.FC<VetActionButtonsProps> = ({
  onBookAppointment
}) => {
  return (
    <div className="fixed bottom-20 left-0 right-0 p-4 bg-white shadow-md border-t border-gray-200 z-10">
      <div className="flex flex-col gap-3 max-w-md mx-auto">
        <Button 
          onClick={onBookAppointment}
          className="w-full bg-[#79D0B8] hover:bg-[#4DA6A8] text-white shadow-md rounded-lg"
        >
          Agendar cita
        </Button>
      </div>
    </div>
  );
};

export default VetActionButtons;
