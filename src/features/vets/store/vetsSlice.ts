
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Veterinarian } from '../types';

// Define the state structure for the vets feature
interface VetsState {
  veterinarians: Veterinarian[];
  currentVet: Veterinarian | null;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: VetsState = {
  veterinarians: [],
  currentVet: null,
  isLoading: false,
  error: null,
};

// Create the vets slice with reducers
const vetsSlice = createSlice({
  name: 'vets',
  initialState,
  reducers: {
    // Start loading
    requestStarted: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    
    // Handle veterinarian list fetch success
    fetchVetsSuccess: (state, action: PayloadAction<Veterinarian[]>) => {
      state.veterinarians = action.payload;
      state.isLoading = false;
    },
    
    // Handle single veterinarian fetch success
    fetchVetSuccess: (state, action: PayloadAction<Veterinarian>) => {
      state.currentVet = action.payload;
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
export const vetsActions = vetsSlice.actions;
export default vetsSlice.reducer;
