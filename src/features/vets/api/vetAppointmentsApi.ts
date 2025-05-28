
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO, startOfDay, endOfDay } from 'date-fns';
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
        pets!appointments_pet_id_fkey(id, name)
      `)
      .eq('provider_id', providerId);
    
    if (error) {
      console.error('Error fetching vet appointments:', error);
      throw error;
    }

    console.log('Raw appointments data:', data);

    // Format the appointments with pet names and formatted times
    return data.map(appointment => {
      let petName = 'Mascota';
      
      if (appointment.pets && typeof appointment.pets === 'object') {
        const petsData = appointment.pets as PetData;
        if ('name' in petsData && typeof petsData.name === 'string') {
          petName = petsData.name;
        }
      }
      
      // Handle the JSON date format properly
      let appointmentDateStr = '';
      let timeFormatted = 'Hora no especificada';
      
      if (appointment.appointment_date) {
        try {
          const dateObj = appointment.appointment_date as any;
          console.log('Processing appointment date:', dateObj);
          
          if (typeof dateObj === 'object' && dateObj.date && dateObj.time) {
            // Format: {"date":"2025-05-29","time":"09:30"}
            appointmentDateStr = `${dateObj.date}T${dateObj.time}:00`;
            timeFormatted = format(parseISO(`${dateObj.date}T${dateObj.time}`), 'h:mm a');
          } else if (typeof dateObj === 'string') {
            appointmentDateStr = dateObj;
            timeFormatted = format(parseISO(dateObj), 'h:mm a');
          }
        } catch (err) {
          console.error('Error parsing appointment date:', err);
        }
      }

      let price: number | null = null;
      if (appointment.service_type && typeof appointment.service_type === 'object') {
        const serviceObj = appointment.service_type as any;
        price = serviceObj.price ? Number(serviceObj.price) : null;
      }
      
      return {
        ...appointment,
        appointment_date: appointmentDateStr,
        petName,
        time: timeFormatted,
        price
      } as Appointment;
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
    console.log('Fetching appointments for date:', format(date, 'yyyy-MM-dd'));
    
    // Get the date in YYYY-MM-DD format to match the JSON structure
    const targetDate = format(date, 'yyyy-MM-dd');
    
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        pets!appointments_pet_id_fkey(id, name)
      `)
      .eq('provider_id', providerId);
    
    if (error) {
      console.error('Error fetching vet appointments by date:', error);
      throw error;
    }

    console.log('All appointments for vet:', data);

    // Filter appointments by date on the client side since the date is stored as JSON
    const filteredData = data.filter(appointment => {
      if (!appointment.appointment_date) return false;
      
      try {
        const dateObj = appointment.appointment_date as any;
        if (typeof dateObj === 'object' && dateObj.date) {
          return dateObj.date === targetDate;
        } else if (typeof dateObj === 'string') {
          const appointmentDate = format(parseISO(dateObj), 'yyyy-MM-dd');
          return appointmentDate === targetDate;
        }
      } catch (err) {
        console.error('Error comparing appointment date:', err);
      }
      return false;
    });

    console.log('Filtered appointments for date:', filteredData);

    // Format the appointments with pet names and formatted times
    return filteredData.map(appointment => {
      let petName = 'Mascota';
      
      if (appointment.pets && typeof appointment.pets === 'object') {
        const petsData = appointment.pets as PetData;
        if ('name' in petsData && typeof petsData.name === 'string') {
          petName = petsData.name;
        }
      }
      
      let appointmentDateStr = '';
      let timeFormatted = 'Hora no especificada';
      
      if (appointment.appointment_date) {
        try {
          const dateObj = appointment.appointment_date as any;
          
          if (typeof dateObj === 'object' && dateObj.date && dateObj.time) {
            appointmentDateStr = `${dateObj.date}T${dateObj.time}:00`;
            timeFormatted = format(parseISO(`${dateObj.date}T${dateObj.time}`), 'h:mm a');
          } else if (typeof dateObj === 'string') {
            appointmentDateStr = dateObj;
            timeFormatted = format(parseISO(dateObj), 'h:mm a');
          }
        } catch (err) {
          console.error('Error parsing appointment date:', err);
        }
      }

      let price: number | null = null;
      if (appointment.service_type && typeof appointment.service_type === 'object') {
        const serviceObj = appointment.service_type as any;
        price = serviceObj.price ? Number(serviceObj.price) : null;
      }
      
      return {
        ...appointment,
        appointment_date: appointmentDateStr,
        petName,
        time: timeFormatted,
        price
      } as Appointment;
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
    const { data, error } = await supabase
      .from('appointments')
      .select('appointment_date')
      .eq('provider_id', providerId);
    
    if (error) {
      console.error('Error fetching vet appointment dates:', error);
      throw error;
    }

    // Convert the appointment dates to Date objects
    return data.map(item => {
      try {
        const dateObj = item.appointment_date as any;
        if (typeof dateObj === 'object' && dateObj.date) {
          return parseISO(dateObj.date);
        } else if (typeof dateObj === 'string') {
          return parseISO(dateObj);
        }
      } catch (err) {
        console.error('Error parsing appointment date:', err);
      }
      return new Date(); // fallback
    }).filter(date => !isNaN(date.getTime()));
  } catch (err) {
    console.error('Unexpected error in getVetAppointmentDates:', err);
    return [];
  }
};
