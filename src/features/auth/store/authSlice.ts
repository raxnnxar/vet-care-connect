
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthState } from '../types';

// Initial state
const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

// Create the auth slice with reducers
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Start loading
    authRequestStarted: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    
    // Handle login/signup success
    authSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    
    // Handle logout success
    logoutSuccess: (state) => {
      state.user = null;
      state.isLoading = false;
      state.error = null;
    },
    
    // Handle profile update success
    profileUpdateSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isLoading = false;
    },
    
    // Handle auth failures
    authFailed: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    
    // Clear errors
    clearErrors: (state) => {
      state.error = null;
    },
  },
});

// Export actions and reducer
export const authActions = authSlice.actions;
export default authSlice.reducer;
