/**
 * Supabase service wrapper
 * 
 * Provides a unified interface for interacting with Supabase services
 */
import { supabase, isSupabaseConfigured } from './client';

// Define types for RPC parameters to avoid TypeScript errors
interface RpcParams {
  [key: string]: any;
}

/**
 * Supabase service that integrates with the client
 */
export const supabaseService = {
  // Basic methods for user profile management
  async getUserProfile(userId: string) {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured: getUserProfile');
      return { data: null, error: new Error('Supabase not configured') };
    }
    
    // First check if user is a pet owner
    let { data: petOwnerData, error: petOwnerError } = await supabase
      .from('pet_owners')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (petOwnerData) {
      return { data: { ...petOwnerData, role: 'pet_owner' }, error: null };
    }
    
    // If not a pet owner, check if user is a service provider
    let { data: serviceProviderData, error: serviceProviderError } = await supabase
      .from('service_providers')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (serviceProviderData) {
      return { data: { ...serviceProviderData, role: 'service_provider' }, error: null };
    }
    
    // User not found in either table
    return { data: null, error: new Error('User profile not found') };
  },
  
  async updateUserProfile() {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured: updateUserProfile');
      return null;
    }
    
    // Implementation will be added when Supabase is configured
    return null;
  },
  
  async getCurrentUserWithProfile() {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured: getCurrentUserWithProfile');
      return { data: null, error: new Error('Supabase not configured') };
    }
    
    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      return { data: null, error: userError || new Error('No user logged in') };
    }
    
    // Get user profile with role
    const { data: profileData, error: profileError } = await this.getUserProfile(userData.user.id);
    
    if (profileError) {
      return { data: null, error: profileError };
    }
    
    // Return combined user and profile data
    return { 
      data: { 
        user: userData.user, 
        profile: profileData 
      }, 
      error: null 
    };
  },
  
  async uploadFile() {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured: uploadFile');
      return null;
    }
    
    // Implementation will be added when Supabase is configured
    return null;
  },
  
  getPublicUrl() {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured: getPublicUrl');
      return '';
    }
    
    // Implementation will be added when Supabase is configured
    return '';
  },
  
  // Database helper functions that bypass RLS with stored procedures
  async createPetOwner(ownerId: string) {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured: createPetOwner');
      return { data: null, error: new Error('Supabase not configured') };
    }
    
    console.log("Creating pet owner with ID:", ownerId);
    const params: RpcParams = { owner_id: ownerId };
    return await supabase.rpc('create_pet_owner', params);
  },
  
  async createServiceProvider(providerId: string) {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured: createServiceProvider');
      return { data: null, error: new Error('Supabase not configured') };
    }
    
    console.log("Creating service provider with ID:", providerId);
    const params: RpcParams = { provider_id: providerId };
    return await supabase.rpc('create_service_provider', params);
  },
  
  async createVeterinarian(vetId: string) {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured: createVeterinarian');
      return { data: null, error: new Error('Supabase not configured') };
    }
    
    console.log("Creating veterinarian with ID:", vetId);
    const params: RpcParams = { vet_id: vetId };
    return await supabase.rpc('create_veterinarian', params);
  },
  
  async createPetGrooming(groomerId: string) {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured: createPetGrooming');
      return { data: null, error: new Error('Supabase not configured') };
    }
    
    console.log("Creating pet grooming with ID:", groomerId);
    const params: RpcParams = { groomer_id: groomerId };
    return await supabase.rpc('create_pet_grooming', params);
  },
  
  async updateProviderType(providerId: string, providerType: string) {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured: updateProviderType');
      return { data: null, error: new Error('Supabase not configured') };
    }
    
    console.log("Updating provider type:", { providerId, providerType });
    const params: RpcParams = { 
      provider_id: providerId, 
      provider_type_val: providerType 
    };
    return await supabase.rpc('update_provider_type', params);
  },
  
  async createUserWithRole(userId: string, role: 'pet_owner' | 'service_provider', providerType?: string) {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured: createUserWithRole');
      return { data: null, error: new Error('Supabase not configured') };
    }
    
    try {
      let result;
      
      if (role === 'pet_owner') {
        // Create pet owner
        const params: RpcParams = { owner_id: userId };
        result = await supabase.rpc('create_pet_owner', params);
      } else if (role === 'service_provider') {
        // Create service provider
        const params: RpcParams = { provider_id: userId };
        result = await supabase.rpc('create_service_provider', params);
        
        // If provider type is specified, update it
        if (providerType && (providerType === 'veterinarian' || providerType === 'pet_grooming')) {
          const typeParams: RpcParams = { 
            provider_id: userId, 
            provider_type_val: providerType 
          };
          await supabase.rpc('update_provider_type', typeParams);
          
          // Create specific provider type record
          if (providerType === 'veterinarian') {
            const vetParams: RpcParams = { vet_id: userId };
            await supabase.rpc('create_veterinarian', vetParams);
          } else if (providerType === 'pet_grooming') {
            const groomerParams: RpcParams = { groomer_id: userId };
            await supabase.rpc('create_pet_grooming', groomerParams);
          }
        }
      }
      
      return result || { data: null, error: new Error('Invalid role specified') };
    } catch (error) {
      console.error('Error creating user with role:', error);
      return { data: null, error };
    }
  },
  
  // Auth methods 
  auth: {
    async signInWithPassword(credentials) {
      if (!isSupabaseConfigured) {
        console.warn('Supabase not configured: signInWithPassword');
        return { data: null, error: new Error('Supabase not configured') };
      }
      return await supabase.auth.signInWithPassword(credentials);
    },
    
    async signUp(signUpData, userRole, providerType) {
      if (!isSupabaseConfigured) {
        console.warn('Supabase not configured: signUp');
        return { data: null, error: new Error('Supabase not configured') };
      }
      
      try {
        // First create the auth user
        const { data, error } = await supabase.auth.signUp(signUpData);
        
        if (error) throw error;
        
        if (data?.user) {
          // Then create the appropriate role-based profile
          const roleResult = await supabaseService.createUserWithRole(
            data.user.id, 
            userRole, 
            providerType
          );
          
          if (roleResult.error) throw roleResult.error;
          
          return { data: { auth: data, profile: roleResult.data }, error: null };
        }
        
        return { data, error: null };
      } catch (error) {
        console.error('Error during sign up:', error);
        return { data: null, error };
      }
    },
    
    async signOut() {
      if (!isSupabaseConfigured) {
        console.warn('Supabase not configured: signOut');
        return { data: null, error: null };
      }
      return await supabase.auth.signOut();
    },
    
    async getUser() {
      if (!isSupabaseConfigured) {
        console.warn('Supabase not configured: getUser');
        return { data: null, error: null };
      }
      return await supabase.auth.getUser();
    },
    
    async resetPasswordForEmail(email) {
      if (!isSupabaseConfigured) {
        console.warn('Supabase not configured: resetPasswordForEmail');
        return { data: null, error: null };
      }
      return await supabase.auth.resetPasswordForEmail(email);
    },
    
    onAuthStateChange(callback) {
      if (!isSupabaseConfigured) {
        console.warn('Supabase not configured: onAuthStateChange');
        // Return a dummy subscription with unsubscribe method
        return { data: { subscription: { unsubscribe: () => {} } } };
      }
      return supabase.auth.onAuthStateChange(callback);
    }
  }
};

// Export the Supabase client
export { supabase };
