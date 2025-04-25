
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
  
  async createServiceProvider(providerId: string, providerType: string = 'veterinarian') {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured: createServiceProvider');
      return { data: null, error: new Error('Supabase not configured') };
    }
    
    console.log("Creating service provider with ID:", providerId);
    
    // First check if the record already exists
    const { data, error: checkError } = await supabase
      .from('service_providers')
      .select('id')
      .eq('id', providerId)
      .maybeSingle();
      
    if (checkError) {
      console.error("Error checking service provider:", checkError);
      return { data: null, error: checkError };
    }
    
    // If record doesn't exist, create it
    if (!data) {
      const { data: insertData, error } = await supabase
        .from('service_providers')
        .insert({ 
          id: providerId, 
          provider_type: providerType 
        });
      
      if (error) {
        console.error("Error creating service provider:", error);
        return { data: insertData, error };
      }
      
      console.log("Service provider created successfully");
      return { data: insertData, error: null };
    }
    
    console.log("Service provider already exists");
    return { data, error: null };
  },
  
  async createVeterinarian(vetId: string) {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured: createVeterinarian');
      return { data: null, error: new Error('Supabase not configured') };
    }
    
    console.log("Creating veterinarian with ID:", vetId);
    
    // Check if record already exists
    const { data, error: checkError } = await supabase
      .from('veterinarians')
      .select('id')
      .eq('id', vetId)
      .maybeSingle();
      
    if (checkError) {
      console.error("Error checking veterinarian:", checkError);
      return { data: null, error: checkError };
    }
    
    // If record doesn't exist, create it
    if (!data) {
      const { data: insertData, error } = await supabase
        .from('veterinarians')
        .insert({ id: vetId });
      
      if (error) {
        console.error("Error creating veterinarian:", error);
        return { data: insertData, error };
      }
      
      console.log("Veterinarian created successfully");
      return { data: insertData, error: null };
    }
    
    console.log("Veterinarian already exists");
    return { data, error: null };
  },
  
  async createPetGrooming(groomerId: string) {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured: createPetGrooming');
      return { data: null, error: new Error('Supabase not configured') };
    }
    
    console.log("Creating pet grooming with ID:", groomerId);
    
    // Check if record already exists
    const { data, error: checkError } = await supabase
      .from('pet_grooming')
      .select('id')
      .eq('id', groomerId)
      .maybeSingle();
      
    if (checkError) {
      console.error("Error checking pet grooming:", checkError);
      return { data: null, error: checkError };
    }
    
    // If record doesn't exist, create it
    if (!data) {
      const { data: insertData, error } = await supabase
        .from('pet_grooming')
        .insert({ id: groomerId });
      
      if (error) {
        console.error("Error creating pet grooming:", error);
        return { data: insertData, error };
      }
      
      console.log("Pet grooming created successfully");
      return { data: insertData, error: null };
    }
    
    console.log("Pet grooming already exists");
    return { data, error: null };
  },
  
  async updateProviderType(providerId: string, providerType: string) {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured: updateProviderType');
      return { data: null, error: new Error('Supabase not configured') };
    }
    
    console.log("Updating provider type:", { providerId, providerType });
    
    // Check if service provider exists
    const { data, error: checkError } = await supabase
      .from('service_providers')
      .select('id, provider_type')
      .eq('id', providerId)
      .maybeSingle();
      
    if (checkError) {
      console.error("Error checking service provider:", checkError);
      return { data: null, error: checkError };
    }
    
    // If not exists, create it
    if (!data) {
      return await this.createServiceProvider(providerId, providerType);
    }
    
    // Update provider type
    const { data: updateData, error } = await supabase
      .from('service_providers')
      .update({ provider_type: providerType })
      .eq('id', providerId);
      
    if (error) {
      console.error("Error updating provider type:", error);
      return { data: updateData, error };
    }
    
    console.log("Provider type updated successfully");
    return { data: updateData, error: null };
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
