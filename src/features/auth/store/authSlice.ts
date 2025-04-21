import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types';
import { 
  assignUserRole, 
  updateProviderType, 
  updateProfile, 
  checkAuthThunk, 
  loginUser, 
  signupUser,
  logoutUser 
} from './authThunks';
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
      state.user = {
        ...state.user,
        ...action.payload
      };
      state.isLoading = false;
      state.error = null;
    },
    clearErrors(state) {
      state.error = null;
    },
    // New reducer to explicitly set user role
    setUserRole(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Check auth thunk cases
      .addCase(checkAuthThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuthThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        // User state is updated via the authSuccess action dispatched in the thunk
      })
      .addCase(checkAuthThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Login thunk cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.isLoading = false;
        // User state is updated via the authSuccess action dispatched in the thunk
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Signup thunk cases
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.isLoading = false;
        // User state is updated via the authSuccess action dispatched in the thunk
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Logout thunk cases
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Role assignment cases
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
      
      // Provider type cases
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
      })
      
      // Profile update cases
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        if (state.user) {
          state.user = {
            ...state.user,
            phone: action.payload.phone,
            profileImage: action.payload.profileImage
          };
        }
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
