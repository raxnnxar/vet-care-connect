
import React from 'react';
import { Card } from '@/ui/molecules/card';
import { Button } from '@/ui/atoms/button';
import { Cat, Check, X, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { APPOINTMENT_STATUS } from '@/core/constants/app.constants';
import { useEffect } from 'react';

interface PendingRequest {
  id: string;
  petName: string;
  time: string;
  date: string;
  serviceType: string;
}

interface PendingRequestsListProps {
  requests: PendingRequest[];
}

interface PetData {
  id: string;
  name: string;
}

const PendingRequestsList: React.FC<PendingRequestsListProps> = ({ requests: initialRequests }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch pending appointment requests from Supabase with real-time updates
  const { data: requests, isLoading, refetch } = useQuery({
    queryKey: ['pending-requests'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('No user logged in');

      console.log('Fetching pending requests for user:', user.user.id);

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          appointment_date,
          service_type,
          pets!appointments_pet_id_fkey(id, name)
        `)
        .eq('provider_id', user.user.id)
        .eq('status', APPOINTMENT_STATUS.PENDING)
        .order('appointment_date', { ascending: true });
      
      if (error) {
        console.error('Error fetching pending requests:', error);
        throw error;
      }
      
      console.log('Raw pending appointments data:', data);
      
      return data.map(appointment => {
        // Default pet name
        let petName = 'Mascota';
        
        // First check if pets exists and is an object
        if (appointment.pets && typeof appointment.pets === 'object') {
          // Use type assertion after validating object exists
          const petsData = appointment.pets as PetData;
          
          // Then check if it has a name property that's a string
          if ('name' in petsData && typeof petsData.name === 'string') {
            petName = petsData.name;
          }
        }
        
        // Safely parse appointment date
        let timeFormatted = 'Hora no especificada';
        let dateFormatted = 'Fecha no especificada';
        
        if (appointment.appointment_date) {
          try {
            if (typeof appointment.appointment_date === 'string') {
              const date = new Date(appointment.appointment_date);
              timeFormatted = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
              dateFormatted = date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
            } else if (typeof appointment.appointment_date === 'object' && appointment.appointment_date !== null) {
              const dateObj = appointment.appointment_date as any;
              if (dateObj.date && dateObj.time) {
                const date = new Date(`${dateObj.date}T${dateObj.time}`);
                timeFormatted = dateObj.time;
                dateFormatted = date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
              }
            }
          } catch (error) {
            console.error('Error parsing appointment date:', error);
          }
        }

        // Safely parse service type
        let serviceType = 'Servicio no especificado';
        if (appointment.service_type) {
          try {
            if (typeof appointment.service_type === 'string') {
              serviceType = appointment.service_type;
            } else if (typeof appointment.service_type === 'object' && appointment.service_type !== null) {
              const serviceObj = appointment.service_type as any;
              serviceType = serviceObj.name || serviceObj.type || 'Servicio no especificado';
            }
          } catch (error) {
            console.error('Error parsing service type:', error);
          }
        }
        
        return {
          id: appointment.id,
          petName,
          time: timeFormatted,
          date: dateFormatted,
          serviceType
        };
      });
    },
    initialData: initialRequests,
    refetchInterval: 10000, // Refetch every 10 seconds
    staleTime: 0, // Consider data stale immediately
  });

  // Set up real-time subscription for appointments table
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: user } = await supabase.auth.getUser();
      return user.user;
    };

    const setupRealtimeSubscription = async () => {
      const user = await getCurrentUser();
      if (!user) return;

      console.log('Setting up real-time subscription for pending requests');

      const channel = supabase
        .channel('pending-appointments-changes')
        .on(
          'postgres_changes',
          {
            event: '*', // Listen to all changes (INSERT, UPDATE, DELETE)
            schema: 'public',
            table: 'appointments',
            filter: `provider_id=eq.${user.id}`,
          },
          (payload) => {
            console.log('Real-time change detected in appointments:', payload);
            
            // Check if the change is related to pending status
            const newRecord = payload.new as any;
            const oldRecord = payload.old as any;
            
            if (
              (payload.eventType === 'INSERT' && newRecord?.status === APPOINTMENT_STATUS.PENDING) ||
              (payload.eventType === 'UPDATE' && (
                newRecord?.status === APPOINTMENT_STATUS.PENDING || 
                oldRecord?.status === APPOINTMENT_STATUS.PENDING
              )) ||
              payload.eventType === 'DELETE'
            ) {
              console.log('Invalidating pending requests query due to relevant change');
              // Invalidate and refetch the pending requests
              queryClient.invalidateQueries({ queryKey: ['pending-requests'] });
            }
          }
        )
        .subscribe((status) => {
          console.log('Real-time subscription status:', status);
        });

      return () => {
        console.log('Cleaning up real-time subscription');
        supabase.removeChannel(channel);
      };
    };

    setupRealtimeSubscription();
  }, [queryClient]);

  // Manual refresh function
  const handleRefresh = () => {
    console.log('Manual refresh triggered');
    refetch();
  };

  const handleViewRequest = (requestId: string) => {
    navigate(`/vet/appointments/${requestId}`);
  };

  const handleViewDetails = (requestId: string) => {
    console.log('Navigating to appointment details:', requestId);
    navigate(`/vet/detalles-cita/${requestId}`);
  };

  const handleApproveRequest = async (requestId: string) => {
    try {
      console.log('Approving request:', requestId);
      const { data, error } = await supabase
        .from('appointments')
        .update({ status: APPOINTMENT_STATUS.CONFIRMED })
        .eq('id', requestId)
        .select();
      
      if (error) {
        throw error;
      }
      
      console.log('Request approved successfully:', data);
      
      // Invalidate and refetch the pending requests
      queryClient.invalidateQueries({ queryKey: ['pending-requests'] });
      
      // Also invalidate any appointment-related queries
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['vet-appointments'] });
      
      toast.success('Cita aprobada correctamente');
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error('Error al aprobar la cita');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      console.log('Rejecting request:', requestId);
      const { data, error } = await supabase
        .from('appointments')
        .update({ status: APPOINTMENT_STATUS.CANCELLED })
        .eq('id', requestId)
        .select();
      
      if (error) {
        throw error;
      }
      
      console.log('Request rejected successfully:', data);
      
      // Invalidate and refetch the pending requests
      queryClient.invalidateQueries({ queryKey: ['pending-requests'] });
      
      // Also invalidate any appointment-related queries
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['vet-appointments'] });
      
      toast.success('Cita rechazada correctamente');
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Error al rechazar la cita');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-medium text-[#1F2937]">Solicitudes pendientes</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleRefresh}
          className="text-xs"
        >
          Actualizar
        </Button>
      </div>
      
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
            <div 
              className="flex items-center justify-between mb-3 cursor-pointer"
              onClick={() => handleViewDetails(request.id)}
            >
              <div className="flex items-center space-x-3">
                <div className="bg-gray-100 p-2 rounded-full">
                  <Cat size={24} className="text-[#4DA6A8]" />
                </div>
                <div>
                  <p className="font-medium text-lg">{request.petName}</p>
                  <p className="text-gray-500">{request.date} — {request.time}</p>
                  <p className="text-sm text-gray-600">{request.serviceType}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                className="bg-[#79D0B8] hover:bg-[#5FBFB3] text-white rounded-full h-10 w-10 p-0"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleApproveRequest(request.id);
                }}
              >
                <Check size={18} />
              </Button>
              <Button 
                className="bg-[#EF4444] hover:bg-red-400 text-white rounded-full h-10 w-10 p-0"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRejectRequest(request.id);
                }}
              >
                <X size={18} />
              </Button>
              <Button 
                variant="outline"
                className="border-[#79D0B8] text-[#79D0B8] hover:bg-[#79D0B8]/10 rounded-full h-10 w-10 p-0"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewRequest(request.id);
                }}
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
