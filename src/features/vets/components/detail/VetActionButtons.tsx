
import React from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '@/ui/atoms/button';

interface VetActionButtonsProps {
  onBookAppointment: () => void;
}

const VetActionButtons: React.FC<VetActionButtonsProps> = ({
  onBookAppointment
}) => {
  return (
    <div className="fixed bottom-16 left-0 right-0 p-4 bg-white border-t shadow-lg">
      <Button
        className="w-full bg-[#79D0B8] hover:bg-[#5FBFB3] text-white"
        onClick={onBookAppointment}
      >
        <Calendar className="mr-2 h-4 w-4" />
        Agendar Cita
      </Button>
    </div>
  );
};

export default VetActionButtons;
