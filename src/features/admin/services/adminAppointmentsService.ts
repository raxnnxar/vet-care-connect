
import { supabase } from '@/integrations/supabase/client';

export interface Appointment {
  id: string;
  appointment_date: string;
  pet_name: string;
  owner_email: string;
  vet_email: string;
  status: string;
}

export const fetchAppointments = async (): Promise<Appointment[]> => {
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      id,
      appointment_date,
      status,
      pet_id,
      owner_id,
      provider_id
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  // Get additional information for each appointment
  const appointmentsWithDetails = await Promise.all(
    (data || []).map(async (appointment) => {
      // Get pet name
      const { data: petData } = await supabase
        .from('pets')
        .select('name')
        .eq('id', appointment.pet_id)
        .single();

      // Get owner email
      const { data: ownerData } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', appointment.owner_id)
        .single();

      // Get vet email
      const { data: vetData } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', appointment.provider_id)
        .single();

      return {
        id: appointment.id,
        appointment_date: typeof appointment.appointment_date === 'string' 
          ? appointment.appointment_date 
          : JSON.stringify(appointment.appointment_date),
        status: appointment.status || 'Sin estado',
        pet_name: petData?.name || 'Sin nombre',
        owner_email: ownerData?.email || 'Sin email',
        vet_email: vetData?.email || 'Sin asignar'
      };
    })
  );
  
  return appointmentsWithDetails;
};
