
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAppointmentDetailData = (id?: string) => {
  return useQuery({
    queryKey: ['appointment-details', id],
    queryFn: async () => {
      if (!id) throw new Error('No appointment ID provided');
      
      // Fetch appointment with related data
      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .select(`
          *,
          pets!appointments_pet_id_fkey (
            id,
            name,
            species,
            breed,
            date_of_birth,
            weight,
            sex,
            temperament,
            profile_picture_url,
            owner_id,
            created_at
          ),
          pet_owners!appointments_owner_id_fkey (
            address,
            phone_number
          )
        `)
        .eq('id', id)
        .single();
      
      if (appointmentError) {
        console.error('Error fetching appointment:', appointmentError);
        throw appointmentError;
      }
      
      return {
        appointment,
        medicalHistory: null // No longer fetching medical history from pet_medical_history
      };
    },
    enabled: !!id
  });
};
