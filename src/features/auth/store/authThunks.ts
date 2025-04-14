import { AppDispatch } from '../../../state/store';
import { authActions } from './authSlice';
import {
  login as apiLogin,
  signup as apiSignup,
  logout as apiLogout,
  getCurrentUser,
  updateUserProfile,
  requestPasswordReset,
  resetPassword,
  updateUserRole as apiUpdateUserRole,
  updateUserServiceType as apiUpdateUserServiceType
} from '../api/authApi';
import { User, LoginCredentials, SignupData, ResetPasswordData } from '../types';
import { UserRoleType } from '@/core/constants/app.constants';
import { ServiceTypeType } from '../screens/ServiceTypeSelectionScreen';
import { createAsyncThunk } from '@reduxjs/toolkit';

/**
 * Login a user with email and password
 */
export const login = (credentials: LoginCredentials) => async (dispatch: AppDispatch) => {
  dispatch(authActions.authRequestStarted());
  
  try {
    const { data, error } = await apiLogin(credentials);
    
    if (error) throw new Error(error.message || 'Login failed');
    if (!data || !data.user) throw new Error('Authentication returned no user data');
    
    // Save auth token to localStorage
    localStorage.setItem('auth_token', data.token);
    
    dispatch(authActions.authSuccess(data.user));
    return data.user;
  } catch (err) {
    dispatch(authActions.authFailed(err instanceof Error ? err.message : 'An unknown error occurred'));
    return null;
  }
};

/**
 * Register a new user - simplified to not include role yet
 */
export const signup = (userData: SignupData) => async (dispatch: AppDispatch) => {
  dispatch(authActions.authRequestStarted());
  
  try {
    const { data, error } = await apiSignup(userData);
    
    if (error) throw new Error(error.message || 'Signup failed');
    if (!data || !data.user) throw new Error('Authentication returned no user data');
    
    // Save auth token to localStorage
    localStorage.setItem('auth_token', data.token);
    
    dispatch(authActions.authSuccess(data.user));
    return data.user;
  } catch (err) {
    dispatch(authActions.authFailed(err instanceof Error ? err.message : 'An unknown error occurred'));
    return null;
  }
};

/**
 * Update user's role
 */
export const updateUserRole = createAsyncThunk(
  'auth/updateUserRole',
  async ({ userId, role }: { userId: string; role: UserRoleType }, { rejectWithValue }) => {
    try {
      console.log(`Calling apiUpdateUserRole with:`, { userId, role });
      
      const { data, error } = await apiUpdateUserRole({ userId, role });
      
      if (error) {
        console.error(`Error in apiUpdateUserRole:`, error);
        return rejectWithValue(error.message || 'Update role failed');
      }
      
      if (!data) {
        console.error(`No data returned from apiUpdateUserRole`);
        return rejectWithValue('Update role returned no user data');
      }
      
      console.log(`Successfully updated role:`, data);
      return data;
    } catch (err) {
      console.error(`Error in updateUserRole thunk:`, err);
      return rejectWithValue(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  }
);

/**
 * Update user's service type
 */
export const updateUserServiceType = createAsyncThunk(
  'auth/updateUserServiceType',
  async ({ userId, serviceType }: { userId: string; serviceType: ServiceTypeType }, { rejectWithValue }) => {
    try {
      console.log(`Calling apiUpdateUserServiceType with:`, { userId, serviceType });
      
      const { data, error } = await apiUpdateUserServiceType({ userId, serviceType });
      
      if (error) {
        console.error(`Error in apiUpdateUserServiceType:`, error);
        return rejectWithValue(error.message || 'Update service type failed');
      }
      
      if (!data) {
        console.error(`No data returned from apiUpdateUserServiceType`);
        return rejectWithValue('Update service type returned no user data');
      }
      
      console.log(`Successfully updated service type:`, data);
      return data;
    } catch (err) {
      console.error(`Error in updateUserServiceType thunk:`, err);
      return rejectWithValue(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  }
);

/**
 * Logout the current user
 */
export const logout = () => async (dispatch: AppDispatch) => {
  dispatch(authActions.authRequestStarted());
  
  try {
    await apiLogout();
    
    // Remove auth token from localStorage
    localStorage.removeItem('auth_token');
    
    dispatch(authActions.logoutSuccess());
  } catch (err) {
    console.error('Error during logout:', err);
    // Still clear the user data even if API call fails
    localStorage.removeItem('auth_token');
    dispatch(authActions.logoutSuccess());
  }
};

/**
 * Check if user is already authenticated and load their profile
 */
export const checkAuth = () => async (dispatch: AppDispatch) => {
  const token = localStorage.getItem('auth_token');
  
  if (!token) return null;
  
  dispatch(authActions.authRequestStarted());
  
  try {
    const { data, error } = await getCurrentUser();
    
    if (error) throw new Error(error.message || 'Failed to get user data');
    if (!data) throw new Error('No user data found');
    
    dispatch(authActions.authSuccess(data));
    return data;
  } catch (err) {
    // If getting the current user fails, clear the token and reset auth state
    localStorage.removeItem('auth_token');
    dispatch(authActions.logoutSuccess());
    return null;
  }
};

/**
 * Update the user's profile
 */
export const updateProfile = (userData: Partial<User>) => async (dispatch: AppDispatch) => {
  dispatch(authActions.authRequestStarted());
  
  try {
    const { data, error } = await updateUserProfile(userData);
    
    if (error) throw new Error(error.message || 'Failed to update profile');
    if (!data) throw new Error('Profile update returned no data');
    
    dispatch(authActions.profileUpdateSuccess(data));
    return data;
  } catch (err) {
    dispatch(authActions.authFailed(err instanceof Error ? err.message : 'An unknown error occurred'));
    return null;
  }
};

/**
 * Request a password reset
 */
export const forgotPassword = (email: string) => async (dispatch: AppDispatch) => {
  dispatch(authActions.authRequestStarted());
  
  try {
    const { data, error } = await requestPasswordReset(email);
    
    if (error) throw new Error(error.message || 'Failed to request password reset');
    
    dispatch(authActions.authRequestStarted());
    return data;
  } catch (err) {
    dispatch(authActions.authFailed(err instanceof Error ? err.message : 'An unknown error occurred'));
    return null;
  }
};

/**
 * Reset password with token
 */
export const resetUserPassword = (resetData: ResetPasswordData) => async (dispatch: AppDispatch) => {
  dispatch(authActions.authRequestStarted());
  
  try {
    // Call resetPassword with the email (using the token from resetData)
    // This is a simplified implementation as we don't fully implement token-based reset
    const { data, error } = await resetPassword(resetData.token);
    
    if (error) throw new Error(error.message || 'Failed to reset password');
    
    dispatch(authActions.authRequestStarted());
    return data;
  } catch (err) {
    dispatch(authActions.authFailed(err instanceof Error ? err.message : 'An unknown error occurred'));
    return null;
  }
};
