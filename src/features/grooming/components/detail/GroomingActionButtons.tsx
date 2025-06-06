
import React from 'react';
import { MessageSquare, Calendar } from 'lucide-react';
import { Button } from '@/ui/atoms/button';

interface GroomingActionButtonsProps {
  onBookAppointment: () => void;
  onSendMessage: () => void;
}

const GroomingActionButtons: React.FC<GroomingActionButtonsProps> = ({
  onBookAppointment,
  onSendMessage
}) => {
  return (
    <div className="fixed bottom-20 left-0 right-0 p-4 bg-white shadow-md border-t border-gray-200 z-10">
      <div className="flex gap-3 max-w-md mx-auto">
        <Button 
          onClick={onSendMessage}
          className="flex-1 bg-white border border-[#79D0B8] text-[#79D0B8] hover:bg-[#79D0B8] hover:text-white shadow-md rounded-lg"
        >
          <MessageSquare size={16} className="mr-2" />
          Enviar mensaje
        </Button>
        <Button 
          onClick={onBookAppointment}
          className="flex-1 bg-[#79D0B8] hover:bg-[#4DA6A8] text-white shadow-md rounded-lg"
        >
          <Calendar size={16} className="mr-2" />
          Agendar cita
        </Button>
      </div>
    </div>
  );
};

export default GroomingActionButtons;
