import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth/hooks/useAuth';

export const useOwnerAppointments = (activeTab: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['owner-appointments', activeTab, user?.id],
    queryFn: async () => {
      console.log('Fetching appointments for tab:', activeTab);
      
      try {
        console.log('Current user ID:', user?.id);
        
        // First, get appointments only
        const { data: appointmentsData, error: appointmentsError } = await supabase
          .from('appointments')
          .select('*')
          .eq('owner_id', user?.id)
          .order('created_at', { ascending: false });

        if (appointmentsError) {
          console.error('Error fetching appointments:', appointmentsError);
          throw appointmentsError;
        }
        
        console.log('Fetched appointments:', appointmentsData);

        if (!appointmentsData || appointmentsData.length === 0) {
          return [];
        }

        // Get pet information for each appointment
        const appointmentsWithDetails = await Promise.all(
          appointmentsData.map(async (appointment) => {
            let petInfo = null;
            let vetName = 'Por confirmar';
            
            // Get pet information if pet_id exists
            if (appointment.pet_id) {
              const { data: petData, error: petError } = await supabase
                .from('pets')
                .select('id, name, profile_picture_url')
                .eq('id', appointment.pet_id)
                .single();
              
              if (!petError && petData) {
                petInfo = petData;
              }
            }
            
            // Get veterinarian information if provider_id exists
            if (appointment.provider_id) {
              const { data: vetProfile, error: vetError } = await supabase
                .from('profiles')
                .select('display_name')
                .eq('id', appointment.provider_id)
                .single();
              
              if (!vetError && vetProfile) {
                vetName = vetProfile.display_name;
              }
            }
            
            return {
              ...appointment,
              provider_name: vetName,
              pets: petInfo
            };
          })
        );

        // Filter appointments based on status, date and tab
        const now = new Date();
        const filteredAppointments = appointmentsWithDetails.filter(appointment => {
          if (!appointment.appointment_date) return false;
          
          // Don't show cancelled appointments in any tab
          if (appointment.status === 'cancelada') return false;
          
          try {
            let appointmentDate: Date;
            
            // Handle different appointment_date formats
            if (typeof appointment.appointment_date === 'string') {
              appointmentDate = new Date(appointment.appointment_date);
            } else if (typeof appointment.appointment_date === 'object' && appointment.appointment_date !== null) {
              // Handle JSON format like {date: "2024-01-01", time: "10:00"}
              const dateObj = appointment.appointment_date as any;
              if (dateObj.date && dateObj.time) {
                appointmentDate = new Date(`${dateObj.date}T${dateObj.time}`);
              } else {
                return false;
              }
            } else {
              return false;
            }
            
            // Filter based on tab
            if (activeTab === 'upcoming') {
              // Próximas: programada o pendiente + fecha futura
              return ['programada', 'pendiente'].includes(appointment.status) && appointmentDate > now;
            } else {
              // Anteriores: completada o no_asistió + fecha pasada
              return ['completada', 'no_asistió'].includes(appointment.status) && appointmentDate < now;
            }
          } catch (error) {
            console.error('Error parsing appointment date:', error);
            return false;
          }
        });

        // Transform the data to match the expected format
        return filteredAppointments.map(appointment => {
          const pet = appointment.pets;
          
          return {
            ...appointment,
            // Keep appointment_date as is for proper formatting in components
            appointment_date: appointment.appointment_date,
            // Extract pet name safely
            pet_name: pet?.name || 'Mascota sin nombre',
            // Add pet object for compatibility
            pets: pet ? {
              id: pet.id,
              name: pet.name,
              profile_picture_url: pet.profile_picture_url
            } : null,
            // Ensure status is properly set
            status: appointment.status || 'pendiente'
          };
        });
      } catch (error) {
        console.error('Error in fetchAppointments:', error);
        throw error;
      }
    },
    enabled: !!user?.id, // Only run query when user ID is available
  });
};
