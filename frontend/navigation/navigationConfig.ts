
/**
 * Common navigation configuration
 */

import { ParamListBase, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

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
export const defaultScreenOptions: NativeStackNavigationOptions = {
  headerStyle: {
    backgroundColor: '#ffffff',
  },
  headerTintColor: '#333333',
  headerTitleStyle: {
    fontWeight: '600',
  },
  headerShadowVisible: false,
  animation: 'slide_from_right',
};

// Helper function to generate screen-specific options
export const getScreenOptions = <T extends ParamListBase>() => {
  return {
    screenOptions: defaultScreenOptions,
  };
};

// Navigation types
export type UserRole = 'owner' | 'vet' | 'unauthenticated';

