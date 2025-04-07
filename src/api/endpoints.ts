
/**
 * API endpoint definitions
 * 
 * This file centralizes all API endpoints used in the application
 */

// Base paths for different resource types
export const API_PATHS = {
  AUTH: '/auth',
  USERS: '/users',
  PETS: '/pets',
  VETS: '/vets',
  APPOINTMENTS: '/appointments',
};

// Authentication endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_PATHS.AUTH}/login`,
  SIGNUP: `${API_PATHS.AUTH}/signup`,
  FORGOT_PASSWORD: `${API_PATHS.AUTH}/forgot-password`,
  RESET_PASSWORD: `${API_PATHS.AUTH}/reset-password`,
  REFRESH_TOKEN: `${API_PATHS.AUTH}/refresh-token`,
  LOGOUT: `${API_PATHS.AUTH}/logout`,
};

// User endpoints
export const USER_ENDPOINTS = {
  ME: `${API_PATHS.USERS}/me`,
  UPDATE_PROFILE: `${API_PATHS.USERS}/me`,
};

// Pet endpoints
export const PET_ENDPOINTS = {
  ALL: API_PATHS.PETS,
  SINGLE: (id: string) => `${API_PATHS.PETS}/${id}`,
  CREATE: API_PATHS.PETS,
  UPDATE: (id: string) => `${API_PATHS.PETS}/${id}`,
  DELETE: (id: string) => `${API_PATHS.PETS}/${id}`,
};

// Vet endpoints
export const VET_ENDPOINTS = {
  ALL: API_PATHS.VETS,
  SINGLE: (id: string) => `${API_PATHS.VETS}/${id}`,
  SEARCH: `${API_PATHS.VETS}/search`,
};

// Appointment endpoints
export const APPOINTMENT_ENDPOINTS = {
  ALL: API_PATHS.APPOINTMENTS,
  SINGLE: (id: string) => `${API_PATHS.APPOINTMENTS}/${id}`,
  CREATE: API_PATHS.APPOINTMENTS,
  UPDATE: (id: string) => `${API_PATHS.APPOINTMENTS}/${id}`,
  CANCEL: (id: string) => `${API_PATHS.APPOINTMENTS}/${id}/cancel`,
  AVAILABLE_SLOTS: `${API_PATHS.APPOINTMENTS}/available-slots`,
};
