
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Pet } from '../types';

// Define the state structure for the pets feature
interface PetsState {
  pets: Pet[];
  currentPet: Pet | null;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: PetsState = {
  pets: [],
  currentPet: null,
  isLoading: false,
  error: null,
};

// Create the pets slice with reducers
const petsSlice = createSlice({
  name: 'pets',
  initialState,
  reducers: {
    // Start loading
    requestStarted: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    
    // Handle pet list fetch success
    fetchPetsSuccess: (state, action: PayloadAction<Pet[]>) => {
      state.pets = action.payload;
      state.isLoading = false;
    },
    
    // Handle single pet fetch success
    fetchPetSuccess: (state, action: PayloadAction<Pet>) => {
      state.currentPet = action.payload;
      state.isLoading = false;
    },
    
    // Handle pet creation success
    addPetSuccess: (state, action: PayloadAction<Pet>) => {
      state.pets.push(action.payload);
      state.currentPet = action.payload;
      state.isLoading = false;
    },
    
    // Handle pet update success
    updatePetSuccess: (state, action: PayloadAction<Pet>) => {
      state.pets = state.pets.map(pet => 
        pet.id === action.payload.id ? action.payload : pet
      );
      state.currentPet = action.payload;
      state.isLoading = false;
    },
    
    // Handle pet delete success
    deletePetSuccess: (state, action: PayloadAction<string>) => {
      state.pets = state.pets.filter(pet => pet.id !== action.payload);
      if (state.currentPet?.id === action.payload) {
        state.currentPet = null;
      }
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
export const petsActions = petsSlice.actions;
export default petsSlice.reducer;
