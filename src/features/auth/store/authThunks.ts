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
export const updateUserRole = ({ userId, role }: { userId: string; role: UserRoleType }) => async (dispatch: AppDispatch) => {
  dispatch(authActions.authRequestStarted());
  
  try {
    const { data, error } = await apiUpdateUserRole({ userId, role });
    
    if (error) throw new Error(error.message || 'Update role failed');
    if (!data) throw new Error('Update role returned no user data');
    
    dispatch(authActions.profileUpdateSuccess(data));
    return data;
  } catch (err) {
    dispatch(authActions.authFailed(err instanceof Error ? err.message : 'An unknown error occurred'));
    return null;
  }
};

/**
 * Update user's service type
 */
export const updateUserServiceType = ({ 
  userId, 
  serviceType 
}: { 
  userId: string; 
  serviceType: ServiceTypeType 
}) => async (dispatch: AppDispatch) => {
  dispatch(authActions.authRequestStarted());
  
  try {
    const { data, error } = await apiUpdateUserServiceType({ userId, serviceType });
    
    if (error) throw new Error(error.message || 'Update service type failed');
    if (!data) throw new Error('Update service type returned no user data');
    
    dispatch(authActions.profileUpdateSuccess(data));
    return data;
  } catch (err) {
    dispatch(authActions.authFailed(err instanceof Error ? err.message : 'An unknown error occurred'));
    return null;
  }
};

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
