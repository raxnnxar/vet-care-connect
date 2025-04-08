
/**
 * Appointment related types
 * 
 * These types define the shape of appointment data in the application
 */

export interface Appointment {
  id: string;
  petId: string;
  vetId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'canceled';
  type: 'check-up' | 'vaccination' | 'emergency' | 'surgery' | 'follow-up' | 'dental-cleaning';
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
  status?: Appointment['status'];
  type?: Appointment['type'];
};

// Extended appointment type with related data
export interface AppointmentWithDetails extends Appointment {
  petName?: string;
  vetName?: string;
}
