
/**
 * Authentication API service
 * 
 * Provides methods for user authentication and account management
 */
import { ApiResponse } from '../../../core/api/apiClient';
import { User, LoginCredentials, SignupData, AuthResponse } from '../types';
import { supabase, isSupabaseConfigured } from '../../../integrations/supabase/client';

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
          role: data.user.user_metadata?.role || 'pet_owner',
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
 */
export const signup = async (userData: SignupData): Promise<ApiResponse<AuthResponse>> => {
  if (!isSupabaseConfigured) {
    console.warn('Supabase not configured: signup attempt');
    return notConfiguredError();
  }

  try {
    // Sign up the user with role and serviceType in metadata
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          displayName: userData.displayName,
          role: userData.role,
          serviceType: userData.serviceType || null
        }
      }
    });
    
    if (error) throw error;
    
    if (data.user) {
      // After successful signup, create the appropriate role-specific record
      await createUserRoleRecord(data.user.id, userData.role, userData.serviceType);
    }
    
    return {
      data: data.user ? {
        user: {
          id: data.user.id,
          email: data.user.email || '',
          displayName: userData.displayName,
          role: userData.role,
          serviceType: userData.serviceType
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
 * Create role-specific record for the user
 */
async function createUserRoleRecord(userId: string, role: string, serviceType?: string) {
  if (!isSupabaseConfigured) {
    console.warn('Supabase not configured: createUserRoleRecord attempt');
    return;
  }

  try {
    console.log(`Creating ${role} record for user ${userId}${serviceType ? ` with service type ${serviceType}` : ''}`);
    
    // Create record based on user role
    if (role === 'pet_owner') {
      // Insert into pet_owners table
      await supabase.from('pet_owners').insert({ id: userId });
    } else if (role === 'veterinarian') {
      // Insert into veterinarians table
      await supabase.from('veterinarians').insert({ id: userId });
    } else if (serviceType === 'pet_grooming') {
      // Insert into pet_grooming table for service providers
      await supabase.from('pet_grooming').insert({ 
        id: userId, 
        service_provider_id: userId 
      });
      
      // Also insert into service_providers table
      await supabase.from('service_providers').insert({
        id: userId,
        provider_type: 'pet_grooming'
      });
    }

    console.log(`Successfully created ${role} record for user ${userId}`);
  } catch (error) {
    console.error(`Failed to create ${role} record:`, error);
    throw error;
  }
}

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
