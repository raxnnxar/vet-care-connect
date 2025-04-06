
/**
 * Common navigation configuration
 */

// Screen names constants to avoid typos and enable auto-completion
export const SCREENS = {
  // Auth screens
  LOGIN: 'Login',
  SIGNUP: 'Signup',
  FORGOT_PASSWORD: 'ForgotPassword',
  
  // Owner screens
  OWNER_HOME: 'OwnerHome',
  OWNER_PETS: 'OwnerPets',
  OWNER_APPOINTMENTS: 'OwnerAppointments',
  OWNER_PROFILE: 'OwnerProfile',
  
  // Vet screens
  VET_DASHBOARD: 'VetDashboard',
  VET_APPOINTMENTS: 'VetAppointments',
  VET_PATIENTS: 'VetPatients',
  VET_PROFILE: 'VetProfile',
};

// Default screen options that can be reused across navigators
export const defaultScreenOptions = {
  headerStyle: {
    backgroundColor: '#ffffff',
  },
  headerTintColor: '#333333',
  headerTitleStyle: {
    fontWeight: '600',
  },
  headerShadowVisible: false,
};

// Navigation types
export type UserRole = 'owner' | 'vet' | 'unauthenticated';
