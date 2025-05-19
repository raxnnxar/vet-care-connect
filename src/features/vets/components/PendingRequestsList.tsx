
import React from 'react';
import { Card } from '@/ui/molecules/card';
import { Button } from '@/ui/atoms/button';
import { Cat, Check, X, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface PendingRequest {
  id: string;
  petName: string;
  time: string;
  date: string;
}

interface PendingRequestsListProps {
  requests: PendingRequest[];
}

const PendingRequestsList: React.FC<PendingRequestsListProps> = ({ requests: initialRequests }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch pending appointment requests from Supabase
  const { data: requests, isLoading } = useQuery({
    queryKey: ['pending-requests'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('No user logged in');

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          appointment_date,
          pets:pet_id(name)
        `)
        .eq('provider_id', user.user.id)
        .eq('status', 'pendiente');
      
      if (error) {
        console.error('Error fetching pending requests:', error);
        throw error;
      }
      
      return data.map(appointment => ({
        id: appointment.id,
        petName: appointment.pets?.name || 'Mascota',
        time: appointment.appointment_date ? 
          new Date(appointment.appointment_date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : 
          'Hora no especificada',
        date: appointment.appointment_date ? 
          new Date(appointment.appointment_date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }) : 
          'Fecha no especificada'
      }));
    },
    initialData: initialRequests
  });

  const handleViewRequest = (requestId: string) => {
    navigate(`/vet/appointments/${requestId}`);
  };

  const handleApproveRequest = async (requestId: string) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update({ status: 'programada' })
        .eq('id', requestId)
        .select();
      
      if (error) {
        throw error;
      }
      
      // Invalidate and refetch the pending requests
      queryClient.invalidateQueries({ queryKey: ['pending-requests'] });
      
      // Also invalidate any appointment-related queries
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      
      toast.success('Cita aprobada correctamente');
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error('Error al aprobar la cita');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update({ status: 'cancelada' })
        .eq('id', requestId)
        .select();
      
      if (error) {
        throw error;
      }
      
      // Invalidate and refetch the pending requests
      queryClient.invalidateQueries({ queryKey: ['pending-requests'] });
      
      // Also invalidate any appointment-related queries
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      
      toast.success('Cita rechazada correctamente');
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Error al rechazar la cita');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-medium text-[#1F2937] mb-3">Solicitudes pendientes</h2>
      
      {isLoading ? (
        <Card className="p-4 text-center">
          <div className="animate-pulse flex flex-col space-y-3">
            <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-24 bg-gray-200 rounded w-full"></div>
          </div>
        </Card>
      ) : requests && requests.length > 0 ? (
        requests.map((request) => (
          <Card key={request.id} className="p-3 mb-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="bg-gray-100 p-2 rounded-full">
                  <Cat size={24} className="text-[#4DA6A8]" />
                </div>
                <div>
                  <p className="font-medium text-lg">{request.petName}</p>
                  <p className="text-gray-500">{request.date} — {request.time}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                className="bg-[#79D0B8] hover:bg-[#5FBFB3] text-white rounded-full h-10 w-10 p-0"
                size="icon"
                onClick={() => handleApproveRequest(request.id)}
              >
                <Check size={18} />
              </Button>
              <Button 
                className="bg-[#EF4444] hover:bg-red-400 text-white rounded-full h-10 w-10 p-0"
                size="icon"
                onClick={() => handleRejectRequest(request.id)}
              >
                <X size={18} />
              </Button>
              <Button 
                variant="outline"
                className="border-[#79D0B8] text-[#79D0B8] hover:bg-[#79D0B8]/10 rounded-full h-10 w-10 p-0"
                size="icon"
                onClick={() => handleViewRequest(request.id)}
              >
                <MessageSquare size={18} />
              </Button>
            </div>
          </Card>
        ))
      ) : (
        <Card className="p-4 text-center text-gray-500">
          No hay solicitudes pendientes
        </Card>
      )}
    </div>
  );
};

export default PendingRequestsList;
