
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
  async getUserProfile() {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured: getUserProfile');
      return null;
    }
    
    // Implementation will be added when Supabase is configured
    return null;
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
      return null;
    }
    
    // Implementation will be added when Supabase is configured
    return null;
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
  
  // Auth methods 
  auth: {
    async signInWithPassword(credentials) {
      if (!isSupabaseConfigured) {
        console.warn('Supabase not configured: signInWithPassword');
        return { data: null, error: new Error('Supabase not configured') };
      }
      return await supabase.auth.signInWithPassword(credentials);
    },
    
    async signUp(signUpData) {
      if (!isSupabaseConfigured) {
        console.warn('Supabase not configured: signUp');
        return { data: null, error: new Error('Supabase not configured') };
      }
      return await supabase.auth.signUp(signUpData);
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
