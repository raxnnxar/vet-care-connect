
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AvailabilitySchedule, DaySchedule } from '@/features/auth/types/veterinarianTypes';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

export const useVetAvailability = (userId: string, initialAvailability: AvailabilitySchedule) => {
  const [availability, setAvailability] = useState<AvailabilitySchedule>(initialAvailability || {});
  const [isLoading, setIsLoading] = useState(false);

  // Función para actualizar la disponibilidad de un día específico
  const updateDayAvailability = (day: string, dayData: DaySchedule) => {
    setAvailability(prev => ({
      ...prev,
      [day]: dayData
    }));
  };

  // Función para alternar la disponibilidad de un día
  const toggleDayAvailability = (day: string) => {
    setAvailability(prev => {
      const currentDay = prev[day] || { isAvailable: false };
      return {
        ...prev,
        [day]: {
          ...currentDay,
          isAvailable: !currentDay.isAvailable,
          startTime: currentDay.startTime || '09:00',
          endTime: currentDay.endTime || '18:00'
        }
      };
    });
  };

  // Función para actualizar la hora de inicio de un día
  const updateStartTime = (day: string, time: string) => {
    setAvailability(prev => {
      const currentDay = prev[day] || { isAvailable: true, startTime: '09:00', endTime: '18:00' };
      return {
        ...prev,
        [day]: {
          ...currentDay,
          startTime: time,
          // Si la hora de inicio es posterior a la hora de fin, actualizar la hora de fin
          endTime: time >= currentDay.endTime ? time : currentDay.endTime
        }
      };
    });
  };

  // Función para actualizar la hora de fin de un día
  const updateEndTime = (day: string, time: string) => {
    setAvailability(prev => {
      const currentDay = prev[day] || { isAvailable: true, startTime: '09:00', endTime: '18:00' };
      return {
        ...prev,
        [day]: {
          ...currentDay,
          endTime: time,
          // Si la hora de fin es anterior a la hora de inicio, mantener la hora de inicio
          startTime: time <= currentDay.startTime ? time : currentDay.startTime
        }
      };
    });
  };

  // Función para guardar la disponibilidad en la base de datos
  const saveAvailability = async () => {
    if (!userId) {
      toast.error('No se pudo identificar al usuario');
      return false;
    }

    setIsLoading(true);
    try {
      // Convert the availability object to a plain object that meets the Json requirements
      const availabilityJson = availability as unknown as Json;
      
      const { error } = await supabase
        .from('veterinarians')
        .update({ availability: availabilityJson })
        .eq('id', userId);

      if (error) {
        throw error;
      }

      toast.success('Disponibilidad actualizada con éxito');
      return true;
    } catch (error: any) {
      console.error('Error al guardar la disponibilidad:', error);
      toast.error(`Error al guardar: ${error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    availability,
    isLoading,
    updateDayAvailability,
    toggleDayAvailability,
    updateStartTime,
    updateEndTime,
    saveAvailability
  };
};
