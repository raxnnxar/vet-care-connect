
/**
 * Environment configuration
 * 
 * This file handles loading and validating environment variables
 */

// Define the shape of our environment variables
interface EnvVariables {
  apiBaseUrl: string;
  environment: 'development' | 'test' | 'staging' | 'production';
  debug: boolean;
}

// Get values from environment with appropriate fallbacks
export const env: EnvVariables = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  environment: (import.meta.env.VITE_ENVIRONMENT || 'development') as EnvVariables['environment'],
  debug: import.meta.env.VITE_DEBUG === 'true' || import.meta.env.MODE !== 'production',
};

// Utility functions for environment checks
export const isDevelopment = () => env.environment === 'development';
export const isTest = () => env.environment === 'test';
export const isStaging = () => env.environment === 'staging';
export const isProduction = () => env.environment === 'production';
