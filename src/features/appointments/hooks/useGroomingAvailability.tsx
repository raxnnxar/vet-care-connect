
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

interface GroomingAvailability {
  [key: string]: {
    isAvailable: boolean;
    startTime?: string;
    endTime?: string;
  };
}

interface ExistingAppointment {
  appointment_date: any;
  status: string;
}

export const useGroomingAvailability = (groomingId: string) => {
  const [availability, setAvailability] = useState<GroomingAvailability>({});
  const [existingAppointments, setExistingAppointments] = useState<ExistingAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGroomingAvailability = async () => {
      if (!groomingId) return;

      try {
        setIsLoading(true);
        
        // Fetch grooming availability
        const { data: groomingData, error: groomingError } = await supabase
          .from('pet_grooming')
          .select('availability')
          .eq('id', groomingId)
          .maybeSingle();

        if (groomingError) throw groomingError;

        // Fetch existing appointments
        const { data: appointmentsData, error: appointmentsError } = await supabase
          .from('appointments')
          .select('appointment_date, status')
          .eq('provider_id', groomingId)
          .in('status', ['programada', 'pendiente']);

        if (appointmentsError) throw appointmentsError;

        // Properly handle the availability data
        const availabilityData = groomingData?.availability;
        if (availabilityData && typeof availabilityData === 'object') {
          setAvailability(availabilityData as GroomingAvailability);
        }
        setExistingAppointments(appointmentsData || []);
      } catch (error) {
        console.error('Error fetching grooming availability:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroomingAvailability();
  }, [groomingId]);

  const isDateAvailable = (date: Date): boolean => {
    const dayName = format(date, 'EEEE', { locale: es }).toLowerCase();
    const dayMap: { [key: string]: string } = {
      'lunes': 'monday',
      'martes': 'tuesday',
      'miércoles': 'wednesday',
      'jueves': 'thursday',
      'viernes': 'friday',
      'sábado': 'saturday',
      'domingo': 'sunday'
    };
    
    const dayKey = dayMap[dayName];
    return availability[dayKey]?.isAvailable || false;
  };

  const getAvailableTimeSlotsForDate = (date: Date): string[] => {
    if (!isDateAvailable(date)) return [];

    const dayName = format(date, 'EEEE', { locale: es }).toLowerCase();
    const dayMap: { [key: string]: string } = {
      'lunes': 'monday',
      'martes': 'tuesday',
      'miércoles': 'wednesday',
      'jueves': 'thursday',
      'viernes': 'friday',
      'sábado': 'saturday',
      'domingo': 'sunday'
    };
    
    const dayKey = dayMap[dayName];
    const daySchedule = availability[dayKey];
    
    if (!daySchedule?.isAvailable) return [];

    const startTime = daySchedule.startTime || '09:00';
    const endTime = daySchedule.endTime || '18:00';
    
    // Generate time slots
    const slots = [];
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    let currentHour = startHour;
    let currentMinute = startMinute;
    
    while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
      const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      
      // Check if this time slot is not occupied by an existing appointment
      const isOccupied = existingAppointments.some(appointment => {
        try {
          let appointmentDate;
          let appointmentTime;
          
          if (typeof appointment.appointment_date === 'string') {
            appointmentDate = parseISO(appointment.appointment_date);
            appointmentTime = format(appointmentDate, 'HH:mm');
          } else if (typeof appointment.appointment_date === 'object') {
            const dateObj = appointment.appointment_date as any;
            appointmentDate = parseISO(dateObj.date);
            appointmentTime = dateObj.time;
          }
          
          return isSameDay(appointmentDate, date) && appointmentTime === timeStr;
        } catch (error) {
          console.error('Error parsing appointment date:', error);
          return false;
        }
      });
      
      if (!isOccupied) {
        slots.push(timeStr);
      }
      
      currentMinute += 30;
      if (currentMinute >= 60) {
        currentMinute = 0;
        currentHour++;
      }
    }
    
    return slots;
  };

  return {
    availability,
    isLoading,
    isDateAvailable,
    getAvailableTimeSlotsForDate
  };
};
