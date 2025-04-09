
import { supabase } from './client';
import { User } from '@supabase/supabase-js';
import type { Database } from './types';

/**
 * Supabase Service
 * 
 * This service centralizes all database operations and authentication
 * to provide a consistent interface for working with Supabase.
 */

// Type for query options (filtering, pagination, etc.)
export type QueryOptions = {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  filters?: Record<string, any>;
};

// Generic response type
export type ServiceResponse<T> = {
  data: T | null;
  error: Error | null;
};

/**
 * Authentication methods
 */
export const authService = {
  /**
   * Sign up a new user with email and password
   */
  signUp: async (email: string, password: string, metadata?: Record<string, any>): Promise<ServiceResponse<User>> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    
    return {
      data: data?.user || null,
      error: error ? new Error(error.message) : null
    };
  },
  
  /**
   * Sign in with email and password
   */
  signIn: async (email: string, password: string): Promise<ServiceResponse<User>> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    return {
      data: data?.user || null,
      error: error ? new Error(error.message) : null
    };
  },
  
  /**
   * Sign out the current user
   */
  signOut: async (): Promise<ServiceResponse<null>> => {
    const { error } = await supabase.auth.signOut();
    
    return {
      data: null,
      error: error ? new Error(error.message) : null
    };
  },
  
  /**
   * Get the current authenticated user
   */
  getCurrentUser: async (): Promise<ServiceResponse<User>> => {
    const { data, error } = await supabase.auth.getUser();
    
    return {
      data: data?.user || null,
      error: error ? new Error(error.message) : null
    };
  },

  /**
   * Get the current session
   */
  getSession: async () => {
    return await supabase.auth.getSession();
  },

  /**
   * Setup auth state change listener
   */
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};

/**
 * Database service factory
 * Returns CRUD methods for a specific table
 */
export const createDatabaseService = <T extends keyof Database['public']['Tables']>(tableName: T) => {
  // Define type for the ID based on our database schema
  type IdType = string | number;

  return {
    /**
     * Get all records from a table with optional filtering
     */
    getAll: async <R = Database['public']['Tables'][T]['Row']>(
      options?: QueryOptions
    ): Promise<ServiceResponse<R[]>> => {
      let query = supabase
        .from(tableName)
        .select('*');
      
      // Apply filters if provided
      if (options?.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }
      
      // Apply pagination
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      
      if (options?.offset) {
        query = query.range(options.offset, (options.offset + (options.limit || 10) - 1));
      }
      
      // Apply sorting
      if (options?.orderBy) {
        query = query.order(options.orderBy, { 
          ascending: options.orderDirection !== 'desc' 
        });
      }
      
      const { data, error } = await query;
      
      return {
        data: data as R[] || [],
        error: error ? new Error(error.message) : null
      };
    },
    
    /**
     * Get a record by its ID
     */
    getById: async <R = Database['public']['Tables'][T]['Row']>(
      id: IdType
    ): Promise<ServiceResponse<R>> => {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', id)
        .single();
      
      return {
        data: data as R || null,
        error: error ? new Error(error.message) : null
      };
    },
    
    /**
     * Insert a new record
     */
    insert: async <R = Database['public']['Tables'][T]['Row']>(
      record: Omit<Database['public']['Tables'][T]['Insert'], 'id'>
    ): Promise<ServiceResponse<R>> => {
      const { data, error } = await supabase
        .from(tableName)
        .insert(record as any)
        .select()
        .single();
      
      return {
        data: data as R || null,
        error: error ? new Error(error.message) : null
      };
    },
    
    /**
     * Update an existing record
     */
    update: async <R = Database['public']['Tables'][T]['Row']>(
      id: IdType,
      changes: Partial<Database['public']['Tables'][T]['Update']>
    ): Promise<ServiceResponse<R>> => {
      const { data, error } = await supabase
        .from(tableName)
        .update(changes as any)
        .eq('id', id)
        .select()
        .single();
      
      return {
        data: data as R || null,
        error: error ? new Error(error.message) : null
      };
    },
    
    /**
     * Delete a record
     */
    delete: async (id: IdType): Promise<ServiceResponse<null>> => {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
      
      return {
        data: null,
        error: error ? new Error(error.message) : null
      };
    },

    /**
     * Custom query builder
     * For more complex queries that need multiple conditions
     */
    query: () => {
      return supabase.from(tableName);
    }
  };
};

/**
 * Pre-initialized services for common tables
 */
export const petsService = createDatabaseService('pets');
export const appointmentsService = createDatabaseService('appointments');
export const profilesService = createDatabaseService('profiles');
export const veterinariansService = createDatabaseService('veterinarians');
