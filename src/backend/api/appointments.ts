
import appointmentsData from '../data/appointments.json';
import availableSlotsData from '../data/available-slots.json';
import { Appointment, AppointmentSlot } from '../../features/appointments/types';

export const getAppointments = async (userId: string, role: 'pet_owner' | 'veterinarian'): Promise<Appointment[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // If it's a pet owner, filter by pet ownership
  if (role === 'pet_owner') {
    // In a real app, we'd first get the pets owned by this user
    // Here we'll just hardcode pet1 and pet2 to user1 for simplicity
    const userPetIds = userId === 'user1' ? ['pet1', 'pet2'] : ['pet3', 'pet4'];
    return (appointmentsData as unknown as Appointment[]).filter(apt => userPetIds.includes(apt.petId));
  }
  
  // If it's a veterinarian, filter by vet ID
  return (appointmentsData as unknown as Appointment[]).filter(apt => apt.vetId === userId);
};

export const getAppointment = async (appointmentId: string): Promise<Appointment | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const appointment = (appointmentsData as unknown as Appointment[]).find(a => a.id === appointmentId);
  return appointment || null;
};

export const getAvailableSlots = async (vetId: string, date?: string): Promise<AppointmentSlot[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let slots = availableSlotsData.filter(slot => slot.vetId === vetId && slot.isAvailable);
  
  if (date) {
    slots = slots.filter(slot => slot.date === date);
  }
  
  return slots;
};

export const bookAppointment = async (appointmentData: Omit<Appointment, 'id' | 'status'>): Promise<Appointment> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real app, this would:
  // 1. Check if the slot is available
  // 2. Update the slot availability
  // 3. Create the appointment
  
  // Here we just return with a generated ID
  const newAppointment: Appointment = {
    ...appointmentData,
    id: `apt${Date.now()}`,
    status: 'scheduled'
  };
  
  return newAppointment;
};

export const updateAppointmentStatus = async (
  appointmentId: string, 
  status: 'scheduled' | 'completed' | 'canceled'
): Promise<Appointment> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const appointment = (appointmentsData as unknown as Appointment[]).find(a => a.id === appointmentId);
  
  if (!appointment) {
    throw new Error('Appointment not found');
  }
  
  // In a real app, this would update the database
  // Here we just return the updated appointment
  return {
    ...appointment,
    status
  };
};
