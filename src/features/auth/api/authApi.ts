/**
 * Authentication API service
 * 
 * Provides methods for user authentication and account management
 */
import { ApiResponse } from '../../../core/api/apiClient';
import { User, LoginCredentials, SignupData, AuthResponse } from '../types';
import { supabase, isSupabaseConfigured } from '../../../integrations/supabase/client';
import { ServiceTypeType } from '../screens/ServiceTypeSelectionScreen';
import { UserRoleType } from '@/core/constants/app.constants';

// Helper for returning a consistent error response when Supabase is not configured
const notConfiguredError = <T>(): ApiResponse<T> => ({
  data: null,
  error: new Error('Supabase is not configured. Please set up your Supabase connection first.')
});

/**
 * Log in with email and password
 */
export const login = async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
  if (!isSupabaseConfigured) {
    console.warn('Supabase not configured: login attempt');
    return notConfiguredError();
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password
    });
    
    // Transform the response to match our expected AuthResponse type
    return {
      data: data.user ? {
        user: {
          id: data.user.id,
          email: data.user.email || '',
          displayName: data.user.user_metadata?.displayName || '',
          role: data.user.user_metadata?.role,
          serviceType: data.user.user_metadata?.serviceType,
        } as User,
        token: data.session?.access_token || ''
      } : null,
      error: error ? new Error(error.message) : null
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error during login')
    };
  }
};

/**
 * Register a new user
 * This new implementation only handles basic signup without role
 */
export const signup = async (userData: SignupData): Promise<ApiResponse<AuthResponse>> => {
  if (!isSupabaseConfigured) {
    console.warn('Supabase not configured: signup attempt');
    return notConfiguredError();
  }

  try {
    // Sign up the user with basic info only - no role yet
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          displayName: userData.displayName
        }
      }
    });
    
    if (error) throw error;
    
    return {
      data: data.user ? {
        user: {
          id: data.user.id,
          email: data.user.email || '',
          displayName: userData.displayName,
        } as User,
        token: data.session?.access_token || ''
      } : null,
      error: null
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error during signup')
    };
  }
};

/**
 * Update user's role and create the appropriate role record
 */
export const updateUserRole = async ({ userId, role }: { userId: string; role: UserRoleType }): Promise<ApiResponse<User>> => {
  if (!isSupabaseConfigured) {
    console.warn('Supabase not configured: updateUserRole attempt');
    return notConfiguredError();
  }

  try {
    console.log(`Updating role for user ${userId} to ${role}`);
    
    // 1. Update the user metadata to include the role
    const { data: userData, error: userError } = await supabase.auth.updateUser({
      data: { role }
    });
    
    if (userError) throw userError;
    
    // 2. Create the role-specific record
    if (role === 'pet_owner') {
      console.log(`Creating pet_owner record for user ${userId}`);
      const { data: ownerData, error: ownerError } = await supabase
        .from('pet_owners')
        .insert({ id: userId })
        .select();
        
      if (ownerError) {
        console.error(`Error inserting into pet_owners:`, ownerError);
        throw ownerError;
      }
      
      console.log(`Successfully inserted into pet_owners:`, ownerData);
    }
    
    // For veterinarians, we create a service_providers record
    // The specific veterinarian/grooming table will be created when service type is selected
    else if (role === 'veterinarian') {
      console.log(`Creating service_providers record for user ${userId}`);
      const { data: providerData, error: providerError } = await supabase
        .from('service_providers')
        .insert({ 
          id: userId,
          provider_type: null // This will be updated when the service type is selected
        })
        .select();
        
      if (providerError) {
        console.error(`Error inserting into service_providers:`, providerError);
        throw providerError;
      }
      
      console.log(`Successfully inserted into service_providers:`, providerData);
    }
    
    return {
      data: userData.user ? {
        id: userData.user.id,
        email: userData.user.email || '',
        displayName: userData.user.user_metadata?.displayName || '',
        role: role,
      } as User : null,
      error: null
    };
  } catch (error) {
    console.error(`Error in updateUserRole:`, error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error updating user role')
    };
  }
};

/**
 * Update user's service type and create the appropriate service type record
 */
export const updateUserServiceType = async ({ 
  userId, 
  serviceType 
}: { 
  userId: string; 
  serviceType: ServiceTypeType 
}): Promise<ApiResponse<User>> => {
  if (!isSupabaseConfigured) {
    console.warn('Supabase not configured: updateUserServiceType attempt');
    return notConfiguredError();
  }

  try {
    console.log(`Updating service type for user ${userId} to ${serviceType}`);
    
    // 1. Update the user metadata to include the service type
    const { data: userData, error: userError } = await supabase.auth.updateUser({
      data: { serviceType }
    });
    
    if (userError) throw userError;
    
    // 2. Update the provider_type in the service_providers table
    const { data: providerData, error: providerError } = await supabase
      .from('service_providers')
      .update({ provider_type: serviceType })
      .eq('id', userId)
      .select();
      
    if (providerError) {
      console.error(`Error updating service_providers:`, providerError);
      throw providerError;
    }
    
    console.log(`Successfully updated service_providers:`, providerData);
    
    // 3. Create the specific service type record
    if (serviceType === 'veterinarian') {
      console.log(`Creating veterinarians record for user ${userId}`);
      const { data: vetData, error: vetError } = await supabase
        .from('veterinarians')
        .insert({ id: userId })
        .select();
        
      if (vetError) {
        console.error(`Error inserting into veterinarians:`, vetError);
        throw vetError;
      }
      
      console.log(`Successfully inserted into veterinarians:`, vetData);
    }
    else if (serviceType === 'grooming') {
      console.log(`Creating pet_grooming record for user ${userId}`);
      const { data: groomingData, error: groomingError } = await supabase
        .from('pet_grooming')
        .insert({ id: userId, service_provider_id: userId })
        .select();
        
      if (groomingError) {
        console.error(`Error inserting into pet_grooming:`, groomingError);
        throw groomingError;
      }
      
      console.log(`Successfully inserted into pet_grooming:`, groomingData);
    }
    
    return {
      data: userData.user ? {
        id: userData.user.id,
        email: userData.user.email || '',
        displayName: userData.user.user_metadata?.displayName || '',
        role: userData.user.user_metadata?.role,
        serviceType: serviceType
      } as User : null,
      error: null
    };
  } catch (error) {
    console.error(`Error in updateUserServiceType:`, error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error updating user service type')
    };
  }
};

/**
 * Log out the current user
 */
export const logout = async (): Promise<ApiResponse<null>> => {
  if (!isSupabaseConfigured) {
    console.warn('Supabase not configured: logout attempt');
    return notConfiguredError();
  }

  try {
    const { error } = await supabase.auth.signOut();
    
    return {
      data: null,
      error: error ? new Error(error.message) : null
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error during logout')
    };
  }
};

/**
 * Get the current authenticated user
 */
export const getCurrentUser = async (): Promise<ApiResponse<User | null>> => {
  if (!isSupabaseConfigured) {
    console.warn('Supabase not configured: getCurrentUser attempt');
    return notConfiguredError();
  }

  try {
    const { data, error } = await supabase.auth.getUser();
    
    return {
      data: data.user ? {
        id: data.user.id,
        email: data.user.email || '',
        displayName: data.user.user_metadata?.displayName || '',
        role: data.user.user_metadata?.role || 'pet_owner',
      } as User : null,
      error: error ? new Error(error.message) : null
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error getting current user')
    };
  }
};

/**
 * Reset password for a user
 */
export const resetPassword = async (email: string): Promise<ApiResponse<null>> => {
  if (!isSupabaseConfigured) {
    console.warn('Supabase not configured: resetPassword attempt');
    return notConfiguredError();
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    
    return {
      data: null,
      error: error ? new Error(error.message) : null
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error during password reset')
    };
  }
};

/**
 * Update user profile information
 */
export const updateUserProfile = async (userData: Partial<User>): Promise<ApiResponse<User>> => {
  if (!isSupabaseConfigured) {
    console.warn('Supabase not configured: updateUserProfile attempt');
    return notConfiguredError();
  }

  try {
    const { data, error } = await supabase.auth.updateUser({
      data: {
        displayName: userData.displayName,
        role: userData.role
      }
    });
    
    return {
      data: data.user ? {
        id: data.user.id,
        email: data.user.email || '',
        displayName: userData.displayName || data.user.user_metadata?.displayName || '',
        role: userData.role || data.user.user_metadata?.role || 'pet_owner',
      } as User : null,
      error: error ? new Error(error.message) : null
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error updating user profile')
    };
  }
};

/**
 * Request a password reset
 */
export const requestPasswordReset = async (email: string): Promise<ApiResponse<null>> => {
  if (!isSupabaseConfigured) {
    console.warn('Supabase not configured: requestPasswordReset attempt');
    return notConfiguredError();
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    
    return {
      data: null,
      error: error ? new Error(error.message) : null
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error requesting password reset')
    };
  }
};
