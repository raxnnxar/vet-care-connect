import { supabase } from '@/integrations/supabase/client';
import { User, LoginCredentials, SignupData } from '../types';

// Authentication API interface
interface AuthResponse {
  user: User | null;
  error: string | null;
}

export const authApi = {
  // Login with email and password
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (!data || !data.user) {
        return { user: null, error: 'Failed to authenticate' };
      }

      // Map response to app user model
      const user: User = {
        id: data.user.id,
        email: data.user.email || '',
        displayName: data.user.user_metadata?.displayName || '',
        role: data.user.user_metadata?.role,
        serviceType: data.user.user_metadata?.serviceType
      };

      return { user, error: null };
    } catch (error) {
      if (error instanceof Error) {
        return { user: null, error: error.message };
      }
      return { user: null, error: 'An unknown error occurred' };
    }
  },

  // Sign up with email, password, and name
  async signup(userData: { email: string; password: string; name: string }): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            displayName: userData.name,
          },
        },
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (!data || !data.user) {
        return { user: null, error: 'Failed to create account' };
      }

      // Map response to app user model
      const user: User = {
        id: data.user.id,
        email: data.user.email || '',
        displayName: userData.name,
        // Role will be set in the post-signup flow
      };

      return { user, error: null };
    } catch (error) {
      if (error instanceof Error) {
        return { user: null, error: error.message };
      }
      return { user: null, error: 'An unknown error occurred' };
    }
  },

  // Logout user
  async logout(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'An unknown error occurred' };
    }
  },

  // Create pet owner record
  async createPetOwner(ownerId: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.rpc('create_pet_owner', { owner_id: ownerId });
      
      if (error) {
        console.error('Error creating pet owner with RPC:', error);
        // Try direct insertion as fallback
        const insertResult = await supabase
          .from('pet_owners')
          .insert({ id: ownerId });
        
        if (insertResult.error) {
          return { error: insertResult.error.message };
        }
      }
      
      return { error: null };
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'An unknown error occurred' };
    }
  },

  // Create service provider record
  async createServiceProvider(providerId: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.rpc('create_service_provider', { provider_id: providerId });
      
      if (error) {
        console.error('Error creating service provider with RPC:', error);
        
        // Try with 'veterinarian' as a temporary value
        const insertResult = await supabase
          .from('service_providers')
          .insert({ 
            id: providerId,
            provider_type: 'veterinarian' // Temporary value, will be updated in next screen
          });
        
        if (insertResult.error) {
          return { error: insertResult.error.message };
        }
      }
      
      return { error: null };
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'An unknown error occurred' };
    }
  },

  // Update user role
  async updateUserRole(userId: string, role: string): Promise<{ error: string | null, role: string }> {
    try {
      // Update user metadata
      const { error: userError } = await supabase.auth.updateUser({
        data: { role }
      });
      
      if (userError) {
        return { error: userError.message, role };
      }
      
      // Update profiles table
      const profileUpdate = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId);
      
      if (profileUpdate.error) {
        return { error: profileUpdate.error.message, role };
      }
      
      if (role === 'pet_owner') {
        await this.createPetOwner(userId);
      } else if (role === 'service_provider') {
        await this.createServiceProvider(userId);
      }
      
      return { error: null, role };
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message, role };
      }
      return { error: 'An unknown error occurred', role };
    }
  },

  // Update provider type
  async updateProviderType(providerId: string, providerType: string): Promise<{ error: string | null, providerType: string }> {
    try {
      // Update user metadata
      const { error: userError } = await supabase.auth.updateUser({
        data: { serviceType: providerType }
      });
      
      if (userError) {
        return { error: userError.message, providerType };
      }
      
      // Update provider type
      const { error } = await supabase.rpc('update_provider_type', { 
        provider_id: providerId, 
        provider_type_val: providerType 
      });

      if (error) {
        return { error: error.message, providerType };
      }

      // Create specific provider record
      if (providerType === 'veterinarian') {
        const { error: vetError } = await supabase.rpc('create_veterinarian', { vet_id: providerId });
        if (vetError) {
          console.error('Error creating veterinarian record:', vetError);
        }
      } else if (providerType === 'grooming') {
        const { error: groomError } = await supabase.rpc('create_pet_grooming', { groomer_id: providerId });
        if (groomError) {
          console.error('Error creating pet grooming record:', groomError);
        }
      }

      return { error: null, providerType };
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message, providerType };
      }
      return { error: 'An unknown error occurred', providerType };
    }
  },

  // Get current user
  async getCurrentUser(): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        return { user: null, error: error.message };
      }

      if (!data || !data.user) {
        return { user: null, error: 'No authenticated user found' };
      }

      // Map response to app user model
      const user: User = {
        id: data.user.id,
        email: data.user.email || '',
        displayName: data.user.user_metadata?.displayName || '',
        role: data.user.user_metadata?.role,
        serviceType: data.user.user_metadata?.serviceType
      };

      return { user, error: null };
    } catch (error) {
      if (error instanceof Error) {
        return { user: null, error: error.message };
      }
      return { user: null, error: 'An unknown error occurred' };
    }
  }
};
