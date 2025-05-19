
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO } from 'date-fns';
import { APPOINTMENT_STATUS } from '@/core/constants/app.constants';

export interface Appointment {
  id: string;
  pet_id: string;
  provider_id: string;
  appointment_date: string;
  reason: string | null;
  status: string | null;
  notes: string | null;
  service_type: string | null;
  duration: number | null;
  location: string | null;
  price: number | null;
  payment_status: string | null;
  owner_id: string | null;
  // Additional fields for UI display
  petName?: string;
  time?: string;
}

interface PetData {
  id: string;
  name: string;
  // Add other pet fields if needed
}

/**
 * Fetches all appointments for a specific veterinarian
 */
export const getVetAppointments = async (providerId: string): Promise<Appointment[]> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        pets:pet_id(id, name)
      `)
      .eq('provider_id', providerId);
    
    if (error) {
      console.error('Error fetching vet appointments:', error);
      throw error;
    }

    // Format the appointments with pet names and formatted times
    return data.map(appointment => {
      // Default pet name if no pet data is available
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
      
      return {
        ...appointment,
        petName,
        time: appointment.appointment_date ? 
          format(parseISO(appointment.appointment_date), 'h:mm a') : 
          'Hora no especificada'
      };
    });
  } catch (err) {
    console.error('Unexpected error in getVetAppointments:', err);
    return [];
  }
};

/**
 * Fetches appointments for a specific veterinarian on a specific date
 */
export const getVetAppointmentsByDate = async (providerId: string, date: Date): Promise<Appointment[]> => {
  try {
    // Format the date to match the beginning of the day
    const startOfDay = format(date, 'yyyy-MM-dd');
    const endOfDay = format(date, 'yyyy-MM-dd 23:59:59');
    
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        pets:pet_id(id, name)
      `)
      .eq('provider_id', providerId)
      .gte('appointment_date', startOfDay)
      .lte('appointment_date', endOfDay);
    
    if (error) {
      console.error('Error fetching vet appointments by date:', error);
      throw error;
    }

    // Format the appointments with pet names and formatted times
    return data.map(appointment => {
      // Default pet name if no pet data is available
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
      
      return {
        ...appointment,
        petName,
        time: appointment.appointment_date ? 
          format(parseISO(appointment.appointment_date), 'h:mm a') : 
          'Hora no especificada'
      };
    });
  } catch (err) {
    console.error('Unexpected error in getVetAppointmentsByDate:', err);
    return [];
  }
};

/**
 * Get dates with appointments for a specific veterinarian in a date range
 */
export const getVetAppointmentDates = async (providerId: string, startDate: Date, endDate: Date): Promise<Date[]> => {
  try {
    // Format the dates for the query
    const startDateStr = format(startDate, 'yyyy-MM-dd');
    const endDateStr = format(endDate, 'yyyy-MM-dd 23:59:59');
    
    const { data, error } = await supabase
      .from('appointments')
      .select('appointment_date')
      .eq('provider_id', providerId)
      .gte('appointment_date', startDateStr)
      .lte('appointment_date', endDateStr);
    
    if (error) {
      console.error('Error fetching vet appointment dates:', error);
      throw error;
    }

    // Convert the appointment dates to Date objects
    return data.map(item => parseISO(item.appointment_date));
  } catch (err) {
    console.error('Unexpected error in getVetAppointmentDates:', err);
    return [];
  }
};
