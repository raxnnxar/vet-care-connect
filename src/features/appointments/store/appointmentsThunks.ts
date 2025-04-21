
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
 * Schedule a new appointment
 */
export const scheduleAppointment = (appointmentData: CreateAppointmentData) => async (dispatch: AppDispatch) => {
  dispatch(appointmentsActions.requestStarted());
  
  try {
    const { data, error } = await createAppointment(appointmentData);
    
    if (error) throw new Error(error.message || 'Failed to schedule appointment');
    if (!data) throw new Error('Appointment creation returned no data');
    
    dispatch(appointmentsActions.createAppointmentSuccess(data));
    return data;
  } catch (err) {
    dispatch(appointmentsActions.requestFailed(err instanceof Error ? err.message : 'An unknown error occurred'));
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
    const { data, error } = await cancelAppointment(id);
    
    if (error) throw new Error(error.message || 'Failed to cancel appointment');
    if (!data) throw new Error('Appointment cancellation returned no data');
    
    dispatch(appointmentsActions.updateAppointmentSuccess({ ...data, status: 'canceled' }));
    return data;
  } catch (err) {
    dispatch(appointmentsActions.requestFailed(err instanceof Error ? err.message : 'An unknown error occurred'));
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
