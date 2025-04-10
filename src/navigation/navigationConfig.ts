
/**
 * Navigation configuration for the application
 */

// Screen names constants to avoid typos and enable auto-completion
export const SCREENS = {
  // Welcome/Splash screen
  WELCOME: 'Welcome',
  
  // Auth screens
  LOGIN: 'Login',
  SIGNUP: 'Signup',
  FORGOT_PASSWORD: 'ForgotPassword',
  RESET_PASSWORD: 'ResetPassword',
  ROLE_SELECTION: 'RoleSelection',
  
  // Owner screens
  OWNER_HOME: 'OwnerHome',
  OWNER_DASHBOARD: 'OwnerDashboard',
  OWNER_PETS: 'OwnerPets',
  OWNER_PET_DETAIL: 'OwnerPetDetail',
  OWNER_ADD_PET: 'OwnerAddPet',
  OWNER_APPOINTMENTS: 'OwnerAppointments',
  OWNER_APPOINTMENT_DETAIL: 'OwnerAppointmentDetail',
  OWNER_BOOK_APPOINTMENT: 'OwnerBookAppointment',
  OWNER_PROFILE: 'OwnerProfile',
  OWNER_SETTINGS: 'OwnerSettings',
  OWNER_FIND_VETS: 'OwnerFindVets',
  OWNER_VET_DETAIL: 'OwnerVetDetail',
  OWNER_NOTIFICATIONS: 'OwnerNotifications',
  
  // Vet screens
  VET_DASHBOARD: 'VetDashboard',
  VET_APPOINTMENTS: 'VetAppointments',
  VET_APPOINTMENT_DETAIL: 'VetAppointmentDetail',
  VET_SCHEDULE: 'VetSchedule',
  VET_PATIENTS: 'VetPatients',
  VET_PATIENT_DETAIL: 'VetPatientDetail',
  VET_PROFILE: 'VetProfile',
  VET_SETTINGS: 'VetSettings',
  VET_NOTIFICATIONS: 'VetNotifications',
};

// Default screen options that can be reused across navigators
export const defaultScreenOptions = {
  headerStyle: {
    backgroundColor: '#7ECEC4', // Updated to use the primary teal color
  },
  headerTintColor: '#FFFFFF', // Updated to use white for better contrast
  headerTitleStyle: {
    fontWeight: '600',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  headerShadowVisible: false,
};

// Navigation types
export type UserRole = 'pet_owner' | 'veterinarian' | 'unauthenticated';

// Tab navigation configuration
export const TAB_CONFIG = {
  PET_OWNER: [
    { name: SCREENS.OWNER_HOME, icon: 'home', label: 'Home' },
    { name: SCREENS.OWNER_PETS, icon: 'paw', label: 'My Pets' },
    { name: SCREENS.OWNER_APPOINTMENTS, icon: 'calendar', label: 'Appointments' },
    { name: SCREENS.OWNER_FIND_VETS, icon: 'search', label: 'Find Vets' },
    { name: SCREENS.OWNER_PROFILE, icon: 'user', label: 'Profile' },
  ],
  VETERINARIAN: [
    { name: SCREENS.VET_DASHBOARD, icon: 'home', label: 'Dashboard' },
    { name: SCREENS.VET_APPOINTMENTS, icon: 'calendar', label: 'Appointments' },
    { name: SCREENS.VET_PATIENTS, icon: 'users', label: 'Patients' },
    { name: SCREENS.VET_PROFILE, icon: 'user', label: 'Profile' },
  ],
};
