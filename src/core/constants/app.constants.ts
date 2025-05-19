
// Define app-wide constants

// User roles
export const USER_ROLES = {
  PET_OWNER: 'pet_owner',
  SERVICE_PROVIDER: 'service_provider', 
  VETERINARIAN: 'veterinarian', // Adding VETERINARIAN role for backward compatibility
  ADMIN: 'admin'
} as const;

export type UserRoleType = (typeof USER_ROLES)[keyof typeof USER_ROLES];

// Pet Categories
export const PET_CATEGORIES = {
  DOG: 'dog',
  CAT: 'cat',
  BIRD: 'bird',
  REPTILE: 'reptile',
  SMALL_MAMMAL: 'small_mammal',
  OTHER: 'other'
} as const;

export type PetCategoryType = (typeof PET_CATEGORIES)[keyof typeof PET_CATEGORIES];

// Pet Genders
export const PET_GENDER = {
  MALE: 'male',
  FEMALE: 'female'
} as const;

export type PetGenderType = (typeof PET_GENDER)[keyof typeof PET_GENDER];

// Appointment Constants
export const APPOINTMENT_STATUS = {
  PENDING: 'pendiente',
  CONFIRMED: 'programada',
  COMPLETED: 'completada',
  CANCELLED: 'cancelada',
  RESCHEDULED: 'reprogramada',
  NO_SHOW: 'no_asistió'
} as const;

// Ensure we include string literal type for the appointment status constants
export type AppointmentStatusType = typeof APPOINTMENT_STATUS[keyof typeof APPOINTMENT_STATUS];

export const APPOINTMENT_TYPES = {
  CHECK_UP: 'check_up',
  VACCINATION: 'vaccination',
  EMERGENCY: 'emergency',
  SURGERY: 'surgery'
} as const;

export type AppointmentTypeType = (typeof APPOINTMENT_TYPES)[keyof typeof APPOINTMENT_TYPES];

// API endpoints
export const API_ENDPOINTS = {
  AUTH: '/auth',
  USERS: '/users',
  PETS: '/pets',
  APPOINTMENTS: '/appointments',
  VETS: '/vets',
  SERVICES: '/services'
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'vett_auth_token',
  USER: 'vett_user'
};

// Error messages
export const ERROR_MESSAGES = {
  GENERIC: 'Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.',
  AUTH: {
    INVALID_CREDENTIALS: 'Correo electrónico o contraseña incorrectos.',
    WEAK_PASSWORD: 'La contraseña debe tener al menos 8 caracteres.',
    EMAIL_IN_USE: 'Este correo electrónico ya está registrado.',
    INVALID_EMAIL: 'Por favor, introduce un correo electrónico válido.'
  }
};
