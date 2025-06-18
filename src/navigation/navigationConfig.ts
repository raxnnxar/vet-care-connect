
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
  GROOMING_DETAIL: '/estetica/:id',
  GROOMING_REVIEW: '/estetica/:id/review',
  NOTIFICATIONS: '/notifications',
  SETTINGS: '/settings',
  CHATS: '/chats',
  INDIVIDUAL_CHAT: '/chats/:conversationId',
  TREATMENTS: '/treatments'
};

// GroomingNavigator routes
export const GROOMING_ROUTES = {
  DASHBOARD: '/',
  APPOINTMENTS: '/appointments',
  APPOINTMENT_DETAIL: '/appointments/:id',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  CHATS: '/chats',
  INDIVIDUAL_CHAT: '/chats/:conversationId',
  AGENDA: '/agenda'
};

export type VetRouteType = keyof typeof VET_ROUTES;
export type OwnerRouteType = keyof typeof OWNER_ROUTES;
export type GroomingRouteType = keyof typeof GROOMING_ROUTES;
