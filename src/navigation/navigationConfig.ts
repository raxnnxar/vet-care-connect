
// Navigation configuration for the application

// VetNavigator routes
export const VET_ROUTES = {
  DASHBOARD: '/',
  APPOINTMENTS: '/appointments',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  PATIENTS: '/patients',
  SCHEDULE: '/schedule'
};

export type VetRouteType = keyof typeof VET_ROUTES;
