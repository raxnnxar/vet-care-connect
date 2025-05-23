import { AppDispatch } from '../../../state/store';
import { appointmentsActions } from './appointmentsSlice';
import { 
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  getAppointmentsByPet,
  getAppointmentsByVet,
  getAvailableSlots
} from '../api/appointmentsApi';
import { 
  CreateAppointmentData,
  UpdateAppointmentData,
  AppointmentFilters
} from '../types';
import { QueryOptions } from '../../../core/api/apiClient';
import { APPOINTMENT_STATUS } from '@/core/constants/app.constants';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Fetch all appointments with optional filtering
 */
export const fetchAppointments = (filters?: AppointmentFilters) => async (dispatch: AppDispatch) => {
  dispatch(appointmentsActions.requestStarted());
  
  try {
    const options: QueryOptions = { 
      filters: filters as Record<string, any> 
    };
    
    const { data, error } = await getAppointments(options);
    
    if (error) throw new Error(error.message || 'Failed to fetch appointments');
    
    dispatch(appointmentsActions.fetchAppointmentsSuccess(data || []));
    return data;
  } catch (err) {
    dispatch(appointmentsActions.requestFailed(err instanceof Error ? err.message : 'An unknown error occurred'));
    return null;
  }
};

/**
 * Fetch a single appointment by ID
 */
export const fetchAppointmentById = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(appointmentsActions.requestStarted());
  
  try {
    const { data, error } = await getAppointmentById(id);
    
    if (error) throw new Error(error.message || 'Failed to fetch appointment');
    if (!data) throw new Error('Appointment not found');
    
    dispatch(appointmentsActions.fetchAppointmentSuccess(data));
    return data;
  } catch (err) {
    dispatch(appointmentsActions.requestFailed(err instanceof Error ? err.message : 'An unknown error occurred'));
    return null;
  }
};

/**
 * Schedule a new appointment and save to database
 */
export const scheduleAppointment = (appointmentData: CreateAppointmentData) => async (dispatch: AppDispatch) => {
  dispatch(appointmentsActions.requestStarted());
  
  try {
    console.log('Starting appointment creation with data:', appointmentData);
    
    // Prepare appointment data with 'pendiente' status
    const appointmentWithStatus = {
      ...appointmentData,
      status: APPOINTMENT_STATUS.PENDING
    };
    
    console.log('Appointment data with status:', appointmentWithStatus);
    
    // Save the appointment to Supabase database
    const { data: savedAppointment, error: saveError } = await supabase
      .from('appointments')
      .insert({
        pet_id: appointmentWithStatus.pet_id,
        provider_id: appointmentWithStatus.provider_id,
        owner_id: appointmentWithStatus.owner_id,
        appointment_date: appointmentWithStatus.appointment_date,
        duration: appointmentWithStatus.duration || 30,
        service_type: appointmentWithStatus.service_type,
        reason: appointmentWithStatus.reason,
        notes: appointmentWithStatus.notes,
        price: appointmentWithStatus.price,
        status: appointmentWithStatus.status,
        location: appointmentWithStatus.location,
        payment_status: 'pendiente'
      })
      .select()
      .single();
    
    if (saveError) {
      console.error('Error saving appointment to database:', saveError);
      throw new Error(saveError.message || 'Error al guardar la cita en la base de datos');
    }
    
    if (!savedAppointment) {
      throw new Error('No se pudo crear la cita');
    }
    
    console.log('Appointment saved successfully:', savedAppointment);
    
    // Update Redux store
    dispatch(appointmentsActions.createAppointmentSuccess(savedAppointment));
    
    // Show success message
    toast({
      title: "¡Cita agendada exitosamente!",
      description: "Tu cita ha sido programada y está pendiente de confirmación por parte del veterinario. Recibirás una notificación cuando sea confirmada.",
      variant: "default"
    });
    
    return savedAppointment;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Error desconocido al agendar la cita';
    console.error('Error scheduling appointment:', err);
    
    dispatch(appointmentsActions.requestFailed(errorMessage));
    
    // Show error message
    toast({
      title: "Error al agendar la cita",
      description: errorMessage,
      variant: "destructive"
    });
    
    return null;
  }
};

/**
 * Update an existing appointment
 */
export const updateExistingAppointment = (id: string, appointmentData: UpdateAppointmentData) => async (dispatch: AppDispatch) => {
  dispatch(appointmentsActions.requestStarted());
  
  try {
    const { data, error } = await updateAppointment(id, appointmentData);
    
    if (error) throw new Error(error.message || 'Failed to update appointment');
    if (!data) throw new Error('Appointment update returned no data');
    
    dispatch(appointmentsActions.updateAppointmentSuccess(data));
    return data;
  } catch (err) {
    dispatch(appointmentsActions.requestFailed(err instanceof Error ? err.message : 'An unknown error occurred'));
    return null;
  }
};

/**
 * Cancel an appointment
 */
export const cancelExistingAppointment = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(appointmentsActions.requestStarted());
  
  try {
    // Update appointment status in database
    const { data: updatedAppointment, error: updateError } = await supabase
      .from('appointments')
      .update({ 
        status: APPOINTMENT_STATUS.CANCELLED,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (updateError) {
      console.error('Error canceling appointment:', updateError);
      throw new Error(updateError.message || 'Error al cancelar la cita');
    }
    
    if (!updatedAppointment) {
      throw new Error('No se pudo cancelar la cita');
    }
    
    dispatch(appointmentsActions.updateAppointmentSuccess(updatedAppointment));
    
    // Show success message
    toast({
      title: "Cita cancelada",
      description: "La cita ha sido cancelada exitosamente.",
      variant: "default"
    });
    
    return updatedAppointment;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cancelar la cita';
    console.error('Error canceling appointment:', err);
    
    dispatch(appointmentsActions.requestFailed(errorMessage));
    
    // Show error message
    toast({
      title: "Error al cancelar la cita",
      description: errorMessage,
      variant: "destructive"
    });
    
    return null;
  }
};

/**
 * Fetch appointments for a specific pet
 */
export const fetchPetAppointments = (petId: string) => async (dispatch: AppDispatch) => {
  dispatch(appointmentsActions.requestStarted());
  
  try {
    const { data, error } = await getAppointmentsByPet(petId);
    
    if (error) throw new Error(error.message || 'Failed to fetch pet appointments');
    
    dispatch(appointmentsActions.fetchAppointmentsSuccess(data || []));
    return data;
  } catch (err) {
    dispatch(appointmentsActions.requestFailed(err instanceof Error ? err.message : 'An unknown error occurred'));
    return null;
  }
};

/**
 * Fetch appointments for a specific veterinarian
 */
export const fetchVetAppointments = (vetId: string) => async (dispatch: AppDispatch) => {
  dispatch(appointmentsActions.requestStarted());
  
  try {
    const { data, error } = await getAppointmentsByVet(vetId);
    
    if (error) throw new Error(error.message || 'Failed to fetch vet appointments');
    
    dispatch(appointmentsActions.fetchAppointmentsSuccess(data || []));
    return data;
  } catch (err) {
    dispatch(appointmentsActions.requestFailed(err instanceof Error ? err.message : 'An unknown error occurred'));
    return null;
  }
};

/**
 * Fetch available appointment slots
 */
export const fetchAvailableSlots = (vetId: string, date: string) => async (dispatch: AppDispatch) => {
  dispatch(appointmentsActions.requestStarted());
  
  try {
    const { data, error } = await getAvailableSlots(vetId, date);
    
    if (error) throw new Error(error.message || 'Failed to fetch available slots');
    
    dispatch(appointmentsActions.fetchAvailableSlotsSuccess(data || []));
    return data;
  } catch (err) {
    dispatch(appointmentsActions.requestFailed(err instanceof Error ? err.message : 'An unknown error occurred'));
    return null;
  }
};
