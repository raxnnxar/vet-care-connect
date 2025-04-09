
/**
 * Appointment related types
 * 
 * These types define the shape of appointment data in the application
 */
import { APPOINTMENT_STATUS, APPOINTMENT_TYPES, AppointmentStatusType, AppointmentTypeType } from '@/core/constants/app.constants';

export interface Appointment {
  id: string;
  petId: string;
  vetId: string;
  date: string;
  time: string;
  status: AppointmentStatusType;
  type: AppointmentTypeType;
  notes?: string;
}

export interface AppointmentSlot {
  id: string;
  vetId: string;
  date: string;
  time: string;
  isAvailable: boolean;
}

// Data types for creating and updating appointments
export type CreateAppointmentData = Omit<Appointment, 'id'>;

export type UpdateAppointmentData = Partial<Omit<Appointment, 'id'>>;

// Filter types
export type AppointmentFilters = {
  petId?: string;
  vetId?: string;
  startDate?: string;
  endDate?: string;
  status?: AppointmentStatusType;
  type?: AppointmentTypeType;
};

// Extended appointment type with related data
export interface AppointmentWithDetails extends Appointment {
  petName?: string;
  vetName?: string;
}
