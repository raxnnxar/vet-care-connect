import { createClient } from '@supabase/supabase-js';
import { User } from '../../features/auth/types';
import { env } from '../../core/config/env';

// Create a direct Supabase client instance
const supabaseUrl = env.supabaseUrl;
const supabaseAnonKey = env.supabaseAnonKey;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Supabase service for handling database operations
 */
export const supabaseService = {
  /**
   * Get user profile by ID
   */
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data;
  },
  
  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, profileData: Partial<User>) {
    const { error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId);
    
    if (error) {
      throw new Error(error.message);
    }
    
    return true;
  },
  
  /**
   * Get current authenticated user with profile data
   */
  async getCurrentUserWithProfile() {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    if (authError || !authData.user) {
      throw new Error(authError?.message || 'User not authenticated');
    }
    
    try {
      const profileData = await this.getUserProfile(authData.user.id);
      
      return {
        ...authData.user,
        profile: profileData
      };
    } catch (error) {
      console.error('Error fetching profile:', error);
      return authData.user;
    }
  },
  
  /**
   * Upload file to storage
   */
  async uploadFile(bucket: string, path: string, file: File) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert: true
      });
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data;
  },
  
  /**
   * Get public URL for a file
   */
  getPublicUrl(bucket: string, path: string) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  },
  
  // Auth methods
  auth: {
    /**
     * Sign in with email and password
     */
    async signInWithPassword(credentials: { email: string; password: string }) {
      return await supabase.auth.signInWithPassword(credentials);
    },
    
    /**
     * Sign up a new user
     */
    async signUp(signUpData: { email: string; password: string; options?: any }) {
      return await supabase.auth.signUp(signUpData);
    },
    
    /**
     * Sign out the current user
     */
    async signOut() {
      return await supabase.auth.signOut();
    },
    
    /**
     * Get the current user
     */
    async getUser() {
      return await supabase.auth.getUser();
    },
    
    /**
     * Reset password for a user
     */
    async resetPasswordForEmail(email: string) {
      return await supabase.auth.resetPasswordForEmail(email);
    }
  }
};

// Export the supabase client directly as well
export { supabase };