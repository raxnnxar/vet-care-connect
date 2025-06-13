
/**
 * Base API client for making HTTP requests
 */

import { toast } from "sonner";

// Default API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Error types
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Response handler
const handleResponse = async (response: Response) => {
  // Handle different response types
  const contentType = response.headers.get('content-type');
  let data;
  
  if (contentType?.includes('application/json')) {
    data = await response.json();
  } else if (contentType?.includes('text/plain')) {
    data = await response.text();
  } else {
    data = await response.blob();
  }

  if (!response.ok) {
    // Handle error responses
    const message = typeof data === 'object' && data?.message 
      ? data.message 
      : 'An unexpected error occurred';
      
    throw new ApiError(message, response.status, data);
  }

  return data;
};

// Base request method
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    return await handleResponse(response);
  } catch (error) {
    if (error instanceof ApiError) {
      // Log API errors and show a toast notification
      // Only log serializable data, not complex objects
      console.error(`API Error (${error.status}):`, error.message);
      toast.error(error.message || 'An error occurred while communicating with the server');
      throw error;
    }
    
    // Handle network/other errors
    console.error('Request failed:', error instanceof Error ? error.message : 'Unknown error');
    toast.error('Network error. Please check your connection and try again.');
    throw new ApiError(
      'Network error. Please check your connection.', 
      0
    );
  }
};

// Convenience methods for different HTTP verbs
export const apiClient = {
  get: <T>(endpoint: string, options?: RequestInit) => 
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),
    
  post: <T>(endpoint: string, data?: any, options?: RequestInit) => 
    apiRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),
    
  put: <T>(endpoint: string, data?: any, options?: RequestInit) => 
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),
    
  patch: <T>(endpoint: string, data?: any, options?: RequestInit) => 
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined, 
    }),
    
  delete: <T>(endpoint: string, options?: RequestInit) => 
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};
