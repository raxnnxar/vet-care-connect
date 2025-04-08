
/**
 * Custom hook for accessing and managing appointment data
 */
import { useState, useCallback } from 'react';
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
  Appointment, 
  AppointmentSlot,
  CreateAppointmentData, 
  UpdateAppointmentData,
  AppointmentFilters
} from '../types';
import { QueryOptions } from '../../../core/api/apiClient';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null);
  const [availableSlots, setAvailableSlots] = useState<AppointmentSlot[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch all appointments with optional filtering
   */
  const fetchAppointments = useCallback(async (filters?: AppointmentFilters) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const options: QueryOptions = { 
        filters: filters as Record<string, any> 
      };
      
      const { data, error } = await getAppointments(options);
      
      if (error) throw error;
      setAppointments(data || []);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch appointments'));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Fetch a single appointment by ID
   */
  const fetchAppointmentById = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await getAppointmentById(id);
      
      if (error) throw error;
      setCurrentAppointment(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch appointment'));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Schedule a new appointment
   */
  const scheduleAppointment = useCallback(async (appointmentData: CreateAppointmentData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await createAppointment(appointmentData);
      
      if (error) throw error;
      setAppointments(prevAppointments => [...prevAppointments, data as Appointment]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to schedule appointment'));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update an existing appointment
   */
  const updateExistingAppointment = useCallback(async (id: string, appointmentData: UpdateAppointmentData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await updateAppointment(id, appointmentData);
      
      if (error) throw error;
      
      setAppointments(prevAppointments => 
        prevAppointments.map(appointment => 
          appointment.id === id ? { ...appointment, ...data } as Appointment : appointment
        )
      );
      
      if (currentAppointment?.id === id) {
        setCurrentAppointment({ ...currentAppointment, ...data } as Appointment);
      }
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update appointment'));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [currentAppointment]);

  /**
   * Cancel an appointment
   */
  const cancelExistingAppointment = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await cancelAppointment(id);
      
      if (error) throw error;
      
      setAppointments(prevAppointments => 
        prevAppointments.map(appointment => 
          appointment.id === id ? { ...appointment, status: 'canceled' } : appointment
        )
      );
      
      if (currentAppointment?.id === id) {
        setCurrentAppointment({ ...currentAppointment, status: 'canceled' });
      }
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to cancel appointment'));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [currentAppointment]);

  /**
   * Fetch appointments for a specific pet
   */
  const fetchPetAppointments = useCallback(async (petId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await getAppointmentsByPet(petId);
      
      if (error) throw error;
      setAppointments(data || []);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch pet appointments'));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Fetch appointments for a specific veterinarian
   */
  const fetchVetAppointments = useCallback(async (vetId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await getAppointmentsByVet(vetId);
      
      if (error) throw error;
      setAppointments(data || []);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch vet appointments'));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Fetch available appointment slots
   */
  const fetchAvailableSlots = useCallback(async (vetId: string, date: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await getAvailableSlots(vetId, date);
      
      if (error) throw error;
      setAvailableSlots(data || []);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch available slots'));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    appointments,
    currentAppointment,
    availableSlots,
    isLoading,
    error,
    fetchAppointments,
    fetchAppointmentById,
    scheduleAppointment,
    updateExistingAppointment,
    cancelExistingAppointment,
    fetchPetAppointments,
    fetchVetAppointments,
    fetchAvailableSlots
  };
};
