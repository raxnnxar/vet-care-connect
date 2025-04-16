
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Pet } from '../types';

interface PetsState {
  pets: Pet[];
  currentPet: Pet | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: PetsState = {
  pets: [],
  currentPet: null,
  isLoading: false,
  error: null,
};

const petsSlice = createSlice({
  name: 'pets',
  initialState,
  reducers: {
    requestStarted(state) {
      state.isLoading = true;
      state.error = null;
    },
    requestFailed(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    fetchPetsSuccess(state, action: PayloadAction<Pet[]>) {
      state.pets = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    fetchPetSuccess(state, action: PayloadAction<Pet>) {
      state.currentPet = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addPetSuccess(state, action: PayloadAction<Pet>) {
      state.pets.push(action.payload);
      state.currentPet = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    updatePetSuccess(state, action: PayloadAction<Pet>) {
      const index = state.pets.findIndex(pet => pet.id === action.payload.id);
      if (index !== -1) {
        state.pets[index] = action.payload;
      }
      if (state.currentPet && state.currentPet.id === action.payload.id) {
        state.currentPet = action.payload;
      }
      state.isLoading = false;
      state.error = null;
    },
    deletePetSuccess(state, action: PayloadAction<string>) {
      state.pets = state.pets.filter(pet => pet.id !== action.payload);
      if (state.currentPet && state.currentPet.id === action.payload) {
        state.currentPet = null;
      }
      state.isLoading = false;
      state.error = null;
    },
    updatePetProfilePictureSuccess(state, action: PayloadAction<{id: string, url: string}>) {
      const { id, url } = action.payload;
      
      // Update in the pets array
      const petIndex = state.pets.findIndex(pet => pet.id === id);
      if (petIndex !== -1) {
        state.pets[petIndex] = {
          ...state.pets[petIndex],
          profile_picture_url: url
        };
      }
      
      // Update current pet if it's the one being modified
      if (state.currentPet && state.currentPet.id === id) {
        state.currentPet = {
          ...state.currentPet,
          profile_picture_url: url
        };
      }
      
      state.isLoading = false;
      state.error = null;
    },
    clearPetError(state) {
      state.error = null;
    },
    resetPetState() {
      return initialState;
    },
  },
});

export const petsActions = petsSlice.actions;
export default petsSlice.reducer;
