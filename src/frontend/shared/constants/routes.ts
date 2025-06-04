
/**
 * Application route definitions
 * Consolidated source of truth for all routes in the application
 */

export const ROUTES = {
  // Auth routes
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password/:token',
  POST_SIGNUP_ROLE: '/post-signup-role',
  POST_SIGNUP_SERVICE_TYPE: '/post-signup-service-type',
  PROFILE_SETUP: '/profile-setup',
  VET_PROFILE_SETUP: '/vet-profile-setup',
  GROOMING_PROFILE_SETUP: '/grooming-profile-setup',
  
  // Owner routes
  OWNER: '/owner',
  OWNER_HOME: '/owner',  // Base route is the home
  OWNER_PROFILE: '/owner/profile',
  OWNER_PETS: '/owner/pets',
  OWNER_PET_DETAIL: '/owner/pets/:id',
  OWNER_ADD_PET: '/owner/pets/add',
  OWNER_EDIT_PET: '/owner/pets/:id/edit',
  OWNER_APPOINTMENTS: '/owner/appointments',
  OWNER_APPOINTMENT_DETAIL: '/owner/appointments/:id',
  OWNER_BOOK_APPOINTMENT: '/owner/appointments/book/:vetId',
  OWNER_FIND_VETS: '/owner/find-vets',
  OWNER_VET_DETAIL: '/owner/vets/:id',
  OWNER_SALUD: '/owner/salud',
  OWNER_NOTIFICATIONS: '/owner/notifications',
  OWNER_SETTINGS: '/owner/settings',
  
  // Vet routes
  VET: '/vet',
  VET_HOME: '/vet',
  VET_PROFILE: '/vet/profile',
  VET_SCHEDULE: '/vet/schedule',
  VET_APPOINTMENTS: '/vet/appointments',
  VET_APPOINTMENT_DETAIL: '/vet/appointments/:id',
  VET_PATIENTS: '/vet/patients',
  VET_PATIENT_DETAIL: '/vet/patients/:id',
  VET_NOTIFICATIONS: '/vet/notifications',
  VET_SETTINGS: '/vet/settings',
  
  // Common routes
  NOTIFICATIONS: '/notifications',
  SETTINGS: '/settings',
  PROFILE: '/profile',
};
