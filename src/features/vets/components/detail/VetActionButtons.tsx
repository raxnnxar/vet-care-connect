
import React from 'react';
import { Calendar, MessageCircle } from 'lucide-react';
import { Button } from '@/ui/atoms/button';

interface VetActionButtonsProps {
  onBookAppointment: () => void;
  onReviewClick: () => void;
}

const VetActionButtons: React.FC<VetActionButtonsProps> = ({
  onBookAppointment,
  onReviewClick
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button 
        onClick={onBookAppointment}
        className="bg-[#79D0B8] hover:bg-[#68BBA3] py-3"
      >
        <Calendar className="mr-2" size={20} />
        Agendar Cita
      </Button>
      
      <Button 
        onClick={onReviewClick}
        variant="outline" 
        className="border-[#79D0B8] text-[#79D0B8] hover:bg-[#79D0B8]/10 py-3"
      >
        <MessageCircle className="mr-2" size={20} />
        Calificar
      </Button>
    </div>
  );
};

export default VetActionButtons;
