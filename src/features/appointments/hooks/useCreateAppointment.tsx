
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Pet } from '@/features/pets/types';

interface CreateAppointmentData {
  petId: string;
  providerId: string;
  appointmentDate: {
    date: string;
    time: string;
  };
  serviceType: {
    id: string;
    name: string;
    price?: number;
    description?: string;
  };
  ownerId: string;
  providerType?: 'vet' | 'grooming' | null;
}

export const useCreateAppointment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createAppointment = async (appointmentData: CreateAppointmentData) => {
    setIsLoading(true);
    
    try {
      console.log('Creating appointment with data:', appointmentData);

      // Create the appointment record
      const appointmentRecord = {
        pet_id: appointmentData.petId,
        provider_id: appointmentData.providerId,
        appointment_date: appointmentData.appointmentDate,
        service_type: appointmentData.serviceType,
        owner_id: appointmentData.ownerId,
        status: 'pendiente',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Inserting appointment record:', appointmentRecord);

      const { data, error } = await supabase
        .from('appointments')
        .insert(appointmentRecord)
        .select()
        .single();

      if (error) {
        console.error('Error creating appointment:', error);
        toast({
          title: "Error",
          description: "No se pudo crear la cita. Por favor, inténtalo de nuevo.",
          variant: "destructive"
        });
        return null;
      }

      console.log('Appointment created successfully:', data);

      toast({
        title: "¡Cita creada con éxito!",
        description: "Tu cita ha sido agendada correctamente. Te contactaremos pronto para confirmar los detalles.",
        variant: "default"
      });

      return data;
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado. Por favor, inténtalo de nuevo.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createAppointment,
    isLoading
  };
};
