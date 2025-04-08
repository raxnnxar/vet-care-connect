
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Appointment, AppointmentSlot } from '../types';

// Define the state structure for the appointments feature
interface AppointmentsState {
  appointments: Appointment[];
  currentAppointment: Appointment | null;
  availableSlots: AppointmentSlot[];
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: AppointmentsState = {
  appointments: [],
  currentAppointment: null,
  availableSlots: [],
  isLoading: false,
  error: null,
};

// Create the appointments slice with reducers
const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    // Start loading
    requestStarted: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    
    // Handle appointment list fetch success
    fetchAppointmentsSuccess: (state, action: PayloadAction<Appointment[]>) => {
      state.appointments = action.payload;
      state.isLoading = false;
    },
    
    // Handle single appointment fetch success
    fetchAppointmentSuccess: (state, action: PayloadAction<Appointment>) => {
      state.currentAppointment = action.payload;
      state.isLoading = false;
    },
    
    // Handle appointment creation success
    createAppointmentSuccess: (state, action: PayloadAction<Appointment>) => {
      state.appointments.push(action.payload);
      state.currentAppointment = action.payload;
      state.isLoading = false;
    },
    
    // Handle appointment update success
    updateAppointmentSuccess: (state, action: PayloadAction<Appointment>) => {
      state.appointments = state.appointments.map(appointment => 
        appointment.id === action.payload.id ? action.payload : appointment
      );
      state.currentAppointment = action.payload;
      state.isLoading = false;
    },
    
    // Handle available slots fetch success
    fetchAvailableSlotsSuccess: (state, action: PayloadAction<AppointmentSlot[]>) => {
      state.availableSlots = action.payload;
      state.isLoading = false;
    },
    
    // Handle any request failure
    requestFailed: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    
    // Clear any errors
    clearErrors: (state) => {
      state.error = null;
    },
  },
});

// Export actions and reducer
export const appointmentsActions = appointmentsSlice.actions;
export default appointmentsSlice.reducer;
