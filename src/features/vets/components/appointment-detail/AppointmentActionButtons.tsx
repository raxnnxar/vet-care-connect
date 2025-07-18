
import React from 'react';
import { Button } from '@/ui/atoms/button';
import { Check, X, MessageSquare } from 'lucide-react';
import { APPOINTMENT_STATUS } from '@/core/constants/app.constants';

interface AppointmentActionButtonsProps {
  appointmentStatus: string;
  onApprove: () => void;
  onReject: () => void;
  onSendMessage: () => void;
}

const AppointmentActionButtons: React.FC<AppointmentActionButtonsProps> = ({
  appointmentStatus,
  onApprove,
  onReject,
  onSendMessage
}) => {
  return (
    <div className="flex flex-col gap-3">
      {appointmentStatus === APPOINTMENT_STATUS.PENDING && (
        <div className="flex gap-3">
          <Button 
            className="flex-1 bg-[#79D0B8] hover:bg-[#5FBFB3] text-white"
            onClick={onApprove}
          >
            <Check className="mr-2" size={16} />
            Confirmar cita
          </Button>
          <Button 
            className="flex-1 bg-[#EF4444] hover:bg-red-400 text-white"
            onClick={onReject}
          >
            <X className="mr-2" size={16} />
            Rechazar cita
          </Button>
        </div>
      )}
      <Button 
        variant="outline"
        className="w-full max-w-sm mx-auto border-[#79D0B8] text-[#79D0B8] hover:bg-[#79D0B8]/10"
        onClick={onSendMessage}
      >
        <MessageSquare className="mr-2" size={16} />
        Enviar mensaje
      </Button>
    </div>
  );
};

export default AppointmentActionButtons;
