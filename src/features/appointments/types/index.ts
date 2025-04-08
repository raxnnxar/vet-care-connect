
/**
 * Appointment related types
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
