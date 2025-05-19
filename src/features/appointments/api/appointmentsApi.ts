
/**
 * Appointments API service
 * 
 * Provides methods for interacting with appointment data in the database
 */
import apiClient, { ApiResponse, QueryOptions } from '../../../core/api/apiClient';
import { Appointment, AppointmentSlot, CreateAppointmentData, UpdateAppointmentData } from '../types';
import { APPOINTMENT_STATUS } from '@/core/constants/app.constants';

/**
 * Get all appointments with optional filtering
 */
export const getAppointments = async (options?: QueryOptions): Promise<ApiResponse<Appointment[]>> => {
  return apiClient.appointments.select<Appointment>(options);
};

/**
 * Get a single appointment by ID
 */
export const getAppointmentById = async (id: string): Promise<ApiResponse<Appointment>> => {
  return apiClient.appointments.getById<Appointment>(id);
};

/**
 * Create a new appointment
 */
export const createAppointment = async (appointmentData: CreateAppointmentData): Promise<ApiResponse<Appointment>> => {
  return apiClient.appointments.insert<Appointment>(appointmentData);
};

/**
 * Update an existing appointment
 */
export const updateAppointment = async (id: string, appointmentData: UpdateAppointmentData): Promise<ApiResponse<Appointment>> => {
  return apiClient.appointments.update<Appointment>(id, appointmentData);
};

/**
 * Cancel an appointment (specialized update operation)
 */
export const cancelAppointment = async (id: string): Promise<ApiResponse<Appointment>> => {
  return apiClient.appointments.update<Appointment>(id, { status: APPOINTMENT_STATUS.CANCELLED });
};

/**
 * Get appointments by pet ID
 */
export const getAppointmentsByPet = async (petId: string): Promise<ApiResponse<Appointment[]>> => {
  return apiClient.appointments.select<Appointment>({
    filters: { petId }
  });
};

/**
 * Get appointments by veterinarian ID
 */
export const getAppointmentsByVet = async (vetId: string): Promise<ApiResponse<Appointment[]>> => {
  return apiClient.appointments.select<Appointment>({
    filters: { vetId }
  });
};

/**
 * Get available appointment slots
 */
export const getAvailableSlots = async (vetId: string, date: string): Promise<ApiResponse<AppointmentSlot[]>> => {
  return apiClient.appointments.select<AppointmentSlot>({
    filters: { vetId, date, isAvailable: true }
  });
};
