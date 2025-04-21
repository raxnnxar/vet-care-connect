
/**
 * App Constants
 * 
 * Core constants used throughout the application
 */

// User roles in the system
export const USER_ROLES = {
  PET_OWNER: 'pet_owner',
  VETERINARIAN: 'veterinarian',
  SERVICE_PROVIDER: 'service_provider', // Added this role
  ADMIN: 'admin',
} as const;

export type UserRoleType = (typeof USER_ROLES)[keyof typeof USER_ROLES];

// Provider types (veterinary specialties)
export const PROVIDER_TYPES = {
  GENERAL_PRACTITIONER: 'general_practitioner',
  SURGEON: 'surgeon',
  DERMATOLOGIST: 'dermatologist',
  CARDIOLOGIST: 'cardiologist',
  NEUROLOGIST: 'neurologist',
  OPHTHALMOLOGIST: 'ophthalmologist',
  DENTIST: 'dentist',
  EMERGENCY: 'emergency',
  BEHAVIORIST: 'behaviorist',
  NUTRITIONIST: 'nutritionist',
} as const;

export type ProviderTypeType = (typeof PROVIDER_TYPES)[keyof typeof PROVIDER_TYPES];

// Appointment status types
export const APPOINTMENT_STATUS = {
  SCHEDULED: 'scheduled',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELED: 'canceled',
  MISSED: 'missed',
  RESCHEDULED: 'rescheduled',
  PENDING_PAYMENT: 'pending_payment',
} as const;

export type AppointmentStatusType = (typeof APPOINTMENT_STATUS)[keyof typeof APPOINTMENT_STATUS];

// Appointment types
export const APPOINTMENT_TYPES = {
  CHECK_UP: 'check-up',
  VACCINATION: 'vaccination',
  EMERGENCY: 'emergency',
  SURGERY: 'surgery',
  FOLLOW_UP: 'follow-up',
  DENTAL_CLEANING: 'dental-cleaning',
  GROOMING: 'grooming',
  CONSULTATION: 'consultation',
} as const;

export type AppointmentTypeType = (typeof APPOINTMENT_TYPES)[keyof typeof APPOINTMENT_TYPES];

// Gender types for pets
export const PET_GENDER = {
  MALE: 'male',
  FEMALE: 'female',
  UNKNOWN: 'unknown',
} as const;

export type PetGenderType = (typeof PET_GENDER)[keyof typeof PET_GENDER];

// Pet categories
export const PET_CATEGORIES = {
  DOG: 'dog',
  CAT: 'cat',
  BIRD: 'bird',
  REPTILE: 'reptile',
  FISH: 'fish',
  SMALL_MAMMAL: 'small_mammal',
  OTHER: 'other',
} as const;

export type PetCategoryType = (typeof PET_CATEGORIES)[keyof typeof PET_CATEGORIES];
