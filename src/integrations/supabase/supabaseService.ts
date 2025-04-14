/**
 * Supabase service wrapper
 * 
 * Provides a unified interface for interacting with Supabase services
 */
import { supabase, isSupabaseConfigured } from './client';

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
  
  // User role management methods
  async createPetOwner(ownerId: string) {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured: createPetOwner');
      return { data: null, error: new Error('Supabase not configured') };
    }
    
    console.log("Creating pet owner with ID:", ownerId);
    console.log("Params being sent:", { owner_id: ownerId });
    const result = await supabase.rpc('create_pet_owner', { owner_id: ownerId });
    console.log("Create pet owner result:", result);
    return result;
  },
  
  async createServiceProvider(providerId: string) {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured: createServiceProvider');
      return { data: null, error: new Error('Supabase not configured') };
    }
    
    console.log("Creating service provider with ID:", providerId);
    console.log("Params being sent:", { provider_id: providerId });
    const result = await supabase.rpc('create_service_provider', { provider_id: providerId });
    console.log("Create service provider result:", result);
    return result;
  },
  
  async createVeterinarian(vetId: string) {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured: createVeterinarian');
      return { data: null, error: new Error('Supabase not configured') };
    }
    
    console.log("Creating veterinarian with ID:", vetId);
    console.log("Params being sent:", { vet_id: vetId });
    const result = await supabase.rpc('create_veterinarian', { vet_id: vetId });
    console.log("Create veterinarian result:", result);
    return result;
  },
  
  async createPetGrooming(groomerId: string) {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured: createPetGrooming');
      return { data: null, error: new Error('Supabase not configured') };
    }
    
    console.log("Creating pet grooming with ID:", groomerId);
    console.log("Params being sent:", { groomer_id: groomerId });
    const result = await supabase.rpc('create_pet_grooming', { groomer_id: groomerId });
    console.log("Create pet grooming result:", result);
    return result;
  },
  
  async updateProviderType(providerId: string, providerType: string) {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured: updateProviderType');
      return { data: null, error: new Error('Supabase not configured') };
    }
    
    console.log("Updating provider type:", { providerId, providerType });
    console.log("Params being sent:", { provider_id: providerId, provider_type_val: providerType });
    const result = await supabase.rpc('update_provider_type', { 
      provider_id: providerId, 
      provider_type_val: providerType 
    });
    console.log("Update provider type result:", result);
    return result;
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
    
    async signUp(signUpData, role = null, providerType = null) {
      if (!isSupabaseConfigured) {
        console.warn('Supabase not configured: signUp');
        return { data: null, error: new Error('Supabase not configured') };
      }
      
      // First create the user account
      const { data, error } = await supabase.auth.signUp(signUpData);
      
      if (error || !data.user) {
        return { data, error };
      }
      
      // If role is specified, create the appropriate role record
      if (role === 'pet_owner') {
        await supabaseService.createPetOwner(data.user.id);
      } else if (role === 'service_provider') {
        await supabaseService.createServiceProvider(data.user.id);
        
        // If provider type is specified, create the specific provider type
        if (providerType === 'veterinarian') {
          await supabaseService.createVeterinarian(data.user.id);
        } else if (providerType === 'grooming') {
          await supabaseService.createPetGrooming(data.user.id);
        }
        
        // Update provider type in the database
        if (providerType) {
          await supabaseService.updateProviderType(data.user.id, providerType);
        }
      }
      
      return { data, error };
    },
    
    async signOut() {
      if (!isSupabaseConfigured) {
        console.warn('Supabase not configured: signOut');
        return { error: new Error('Supabase not configured') };
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
        return { data: null, unsubscribe: () => {} };
      }
      return supabase.auth.onAuthStateChange(callback);
    }
  }
};
