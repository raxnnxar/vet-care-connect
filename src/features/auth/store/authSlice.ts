import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types';
import { assignUserRole, updateProviderType } from './authThunks';
import { USER_ROLES, UserRoleType } from '@/core/constants/app.constants';
import { ServiceTypeType } from '../screens/ServiceTypeSelectionScreen';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authRequestStarted(state) {
      state.isLoading = true;
      state.error = null;
    },
    authSuccess(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    authFailed(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    logoutSuccess(state) {
      state.user = null;
      state.isLoading = false;
      state.error = null;
    },
    profileUpdateSuccess(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    clearErrors(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(assignUserRole.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(assignUserRole.fulfilled, (state, action) => {
        if (state.user) {
          state.user = {
            ...state.user,
            role: action.payload.role as UserRoleType
          };
        }
        state.isLoading = false;
        state.error = null;
      })
      .addCase(assignUserRole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      .addCase(updateProviderType.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProviderType.fulfilled, (state, action) => {
        if (state.user) {
          state.user = {
            ...state.user,
            serviceType: action.payload.providerType as ServiceTypeType
          };
        }
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateProviderType.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
