
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
  AGENDA: '/agenda',
  CHATS: '/chats',
  INDIVIDUAL_CHAT: '/chats/:conversationId'
};

// OwnerNavigator routes
export const OWNER_ROUTES = {
  HOME: '/',
  APPOINTMENTS: '/appointments',
  APPOINTMENT_DETAIL: '/appointments/:id',
  BOOK_APPOINTMENT: '/appointments/book/:vetId',
  PROFILE: '/profile',
  PET_DETAIL: '/pets/:id',
  FIND_VETS: '/find-vets',
  VET_DETAIL: '/vets/:id',
  VET_REVIEW: '/vets/:id/review',
  SALUD: '/salud',
  ESTETICA: '/estetica',
  NOTIFICATIONS: '/notifications',
  SETTINGS: '/settings',
  CHATS: '/chats',
  INDIVIDUAL_CHAT: '/chats/:conversationId'
};

export type VetRouteType = keyof typeof VET_ROUTES;
export type OwnerRouteType = keyof typeof OWNER_ROUTES;
