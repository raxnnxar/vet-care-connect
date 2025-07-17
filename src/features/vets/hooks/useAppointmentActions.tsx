
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { APPOINTMENT_STATUS } from '@/core/constants/app.constants';

export const useAppointmentActions = (appointmentId?: string) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.auth);

  const handleApproveAppointment = async () => {
    if (!appointmentId) return;
    
    try {
      console.log('Approving appointment:', appointmentId);
      const { data, error } = await supabase
        .from('appointments')
        .update({ status: APPOINTMENT_STATUS.CONFIRMED })
        .eq('id', appointmentId)
        .select();
      
      if (error) {
        throw error;
      }
      
      console.log('Appointment approved successfully:', data);
      
      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: ['appointment-details', appointmentId] });
      queryClient.invalidateQueries({ queryKey: ['pending-requests'] });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['vet-appointments'] });
      
      toast.success('Cita confirmada correctamente');
    } catch (error) {
      console.error('Error approving appointment:', error);
      toast.error('Error al confirmar la cita');
    }
  };

  const handleRejectSuccess = () => {
    // Invalidate and refetch queries
    queryClient.invalidateQueries({ queryKey: ['appointment-details', appointmentId] });
    queryClient.invalidateQueries({ queryKey: ['pending-requests'] });
    queryClient.invalidateQueries({ queryKey: ['appointments'] });
    queryClient.invalidateQueries({ queryKey: ['vet-appointments'] });
  };

  const handleSendMessage = async (ownerId: string) => {
    if (!ownerId || !user?.id) {
      toast.error('No se pudo encontrar la información del usuario');
      return;
    }

    try {
      // Usar la función get_or_create_conversation para crear o encontrar una conversación
      const { data: conversationId, error } = await supabase.rpc('get_or_create_conversation', {
        user1_uuid: user.id,
        user2_uuid: ownerId
      });

      if (error) {
        console.error('Error creating/getting conversation:', error);
        toast.error('Error al crear la conversación');
        return;
      }

      if (conversationId) {
        // Navegar al chat individual con el ID de conversación correcto
        navigate(`/vet/chats/${conversationId}`);
      } else {
        toast.error('No se pudo crear la conversación');
      }
    } catch (error) {
      console.error('Error handling send message:', error);
      toast.error('Error al enviar mensaje');
    }
  };

  const handleMarkNoShow = async () => {
    if (!appointmentId) return;
    
    try {
      console.log('Marking appointment as no show:', appointmentId);
      const { data, error } = await supabase
        .from('appointments')
        .update({ status: 'no_asistió' })
        .eq('id', appointmentId)
        .select();
      
      if (error) {
        throw error;
      }
      
      console.log('Appointment marked as no show successfully:', data);
      
      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: ['appointment-details', appointmentId] });
      queryClient.invalidateQueries({ queryKey: ['pending-requests'] });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['vet-appointments'] });
      
      toast.success('Cita marcada como "No asistió"');
    } catch (error) {
      console.error('Error marking appointment as no show:', error);
      toast.error('Error al marcar la cita');
    }
  };

  return {
    handleApproveAppointment,
    handleRejectSuccess,
    handleSendMessage,
    handleMarkNoShow
  };
};
