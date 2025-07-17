
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/ui/molecules/alert-dialog';
import { Button } from '@/ui/atoms/button';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { APPOINTMENT_STATUS } from '@/core/constants/app.constants';

interface RejectAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string;
  ownerId: string;
  vetId: string;
  petName: string;
  onSuccess: () => void;
  isConfirmedAppointment?: boolean;
}

const PREDEFINED_REASONS = [
  "No estaré disponible en ese horario",
  "Por favor, elige otro día", 
  "Este servicio no está disponible actualmente",
  "Ese horario ya fue ocupado"
];

const CANCELLATION_REASONS = [
  "Ha surgido una emergencia médica",
  "Por motivos de salud no podré atender",
  "Cancelación por motivos personales",
  "Reagendemos para otra fecha"
];

const RejectAppointmentModal: React.FC<RejectAppointmentModalProps> = ({
  isOpen,
  onClose,
  appointmentId,
  ownerId,
  vetId,
  petName,
  onSuccess,
  isConfirmedAppointment = false
}) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reasons = isConfirmedAppointment ? CANCELLATION_REASONS : PREDEFINED_REASONS;
  const actionText = isConfirmedAppointment ? 'cancelar' : 'rechazar';
  const titleText = isConfirmedAppointment ? '¿Por qué deseas cancelar esta cita?' : '¿Por qué deseas rechazar esta cita?';

  const handleRejectOrCancel = async () => {
    const finalReason = customReason.trim() || selectedReason;
    
    if (!finalReason) {
      toast.error('Por favor selecciona o escribe un motivo');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Actualizar el status de la cita a cancelada
      const { error: updateError } = await supabase
        .from('appointments')
        .update({ 
          status: APPOINTMENT_STATUS.CANCELLED,
          canceled_reason: finalReason
        })
        .eq('id', appointmentId);

      if (updateError) throw updateError;

      // Crear o encontrar conversación y enviar mensaje
      const { data: conversationId, error: convError } = await supabase.rpc('get_or_create_conversation', {
        user1_uuid: vetId,
        user2_uuid: ownerId
      });

      if (convError) throw convError;

      // Enviar mensaje al dueño
      const messageText = isConfirmedAppointment 
        ? `El veterinario ha cancelado tu cita para ${petName}. Motivo: '${finalReason}'. Puedes intentar agendar en otro momento.`
        : `El veterinario ha rechazado tu cita para ${petName}. Motivo: '${finalReason}'. Puedes intentar agendar en otro momento.`;
      
      const { error: messageError } = await supabase.rpc('send_message', {
        conversation_uuid: conversationId,
        sender_uuid: vetId,
        receiver_uuid: ownerId,
        message_text: messageText
      });

      if (messageError) throw messageError;

      const successMessage = isConfirmedAppointment ? 'Cita cancelada correctamente' : 'Cita rechazada correctamente';
      toast.success(successMessage);
      onSuccess();
      onClose();
    } catch (error) {
      console.error(`Error ${actionText}ing appointment:`, error);
      const errorMessage = isConfirmedAppointment ? 'Error al cancelar la cita' : 'Error al rechazar la cita';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedReason('');
    setCustomReason('');
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-medium text-[#1F2937]">
            {titleText}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-gray-600">
            Selecciona un motivo o escribe uno personalizado. El dueño recibirá un mensaje con tu respuesta.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          {/* Dropdown con motivos predefinidos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motivo predefinido
            </label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#79D0B8] focus:border-transparent"
            >
              <option value="">Selecciona un motivo...</option>
              {reasons.map((reason, index) => (
                <option key={index} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </div>

          {/* Campo de texto personalizado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motivo personalizado (opcional)
            </label>
            <textarea
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Escribe un motivo personalizado..."
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#79D0B8] focus:border-transparent resize-none"
              rows={3}
              maxLength={200}
            />
            <p className="text-xs text-gray-500 mt-1">
              {customReason.length}/200 caracteres
            </p>
          </div>
        </div>

        <AlertDialogFooter className="flex gap-3 mt-6">
          <AlertDialogCancel asChild>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button 
              className="flex-1 bg-[#79D0B8] hover:bg-[#5FBFB3] text-white"
              onClick={handleRejectOrCancel}
              disabled={isSubmitting}
            >
              {isSubmitting ? `${actionText === 'cancelar' ? 'Cancelando' : 'Rechazando'}...` : `Confirmar ${actionText}`}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RejectAppointmentModal;
