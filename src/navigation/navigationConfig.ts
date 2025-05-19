
// Navigation configuration for the application

// VetNavigator routes
export const VET_ROUTES = {
  DASHBOARD: '/',
  APPOINTMENTS: '/appointments',
  APPOINTMENT_DETAIL: '/appointments/:id',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  PATIENTS: '/patients',
  SCHEDULE: '/schedule',
  REVIEW: '/review/:id'
};

export type VetRouteType = keyof typeof VET_ROUTES;
