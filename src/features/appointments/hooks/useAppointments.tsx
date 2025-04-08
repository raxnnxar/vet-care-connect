
import { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../../../state/store';
import { 
  fetchAppointments,
  fetchAppointmentById,
  scheduleAppointment,
  updateExistingAppointment,
  cancelExistingAppointment,
  fetchPetAppointments,
  fetchVetAppointments,
  fetchAvailableSlots
} from '../store/appointmentsThunks';
import { appointmentsActions } from '../store/appointmentsSlice';
import { 
  CreateAppointmentData,
  UpdateAppointmentData,
  AppointmentFilters
} from '../types';

export const useAppointments = () => {
  const dispatch = useAppDispatch();
  const { appointments, currentAppointment, availableSlots, isLoading, error } = 
    useAppSelector(state => state.appointments);
  
  return {
    // State
    appointments,
    currentAppointment,
    availableSlots,
    isLoading,
    error,
    
    // Actions
    fetchAppointments: useCallback((filters?: AppointmentFilters) => 
      dispatch(fetchAppointments(filters)), [dispatch]),
    fetchAppointmentById: useCallback((id: string) => 
      dispatch(fetchAppointmentById(id)), [dispatch]),
    scheduleAppointment: useCallback((appointmentData: CreateAppointmentData) => 
      dispatch(scheduleAppointment(appointmentData)), [dispatch]),
    updateExistingAppointment: useCallback((id: string, appointmentData: UpdateAppointmentData) => 
      dispatch(updateExistingAppointment(id, appointmentData)), [dispatch]),
    cancelExistingAppointment: useCallback((id: string) => 
      dispatch(cancelExistingAppointment(id)), [dispatch]),
    fetchPetAppointments: useCallback((petId: string) => 
      dispatch(fetchPetAppointments(petId)), [dispatch]),
    fetchVetAppointments: useCallback((vetId: string) => 
      dispatch(fetchVetAppointments(vetId)), [dispatch]),
    fetchAvailableSlots: useCallback((vetId: string, date: string) => 
      dispatch(fetchAvailableSlots(vetId, date)), [dispatch]),
    clearErrors: useCallback(() => 
      dispatch(appointmentsActions.clearErrors()), [dispatch]),
  };
};
