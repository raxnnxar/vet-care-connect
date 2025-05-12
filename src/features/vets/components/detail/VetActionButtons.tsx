
import React from 'react';
import { Calendar, MessageSquare } from 'lucide-react';
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
    <div className="fixed bottom-16 left-0 right-0 p-4 flex gap-3 bg-white border-t shadow-lg">
      <Button
        className="flex-1 bg-[#79D0B8] hover:bg-[#5FBFB3] text-white"
        onClick={onBookAppointment}
      >
        <Calendar className="mr-2 h-4 w-4" />
        Agendar Cita
      </Button>
      
      <Button
        variant="outline"
        className="flex-1 border-[#79D0B8] text-[#4DA6A8] hover:bg-[#e8f7f3]"
        onClick={onReviewClick}
      >
        <MessageSquare className="mr-2 h-4 w-4" />
        Calificar
      </Button>
    </div>
  );
};

export default VetActionButtons;
