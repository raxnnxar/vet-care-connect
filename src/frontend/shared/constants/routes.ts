
/**
 * Application route definitions
 */

export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password/:token',
  
  // Common routes
  PROFILE: '/profile',
  SETTINGS: '/settings',
  NOTIFICATIONS: '/notifications',
  
  // Pet owner routes
  OWNER_DASHBOARD: '/owner/dashboard',
  PETS: '/pets',
  PET_DETAIL: '/pets/:id',
  ADD_PET: '/pets/add',
  EDIT_PET: '/pets/:id/edit',
  
  // Veterinarian routes
  VET_DASHBOARD: '/vet/dashboard',
  VET_SCHEDULE: '/vet/schedule',
  
  // Appointment routes
  APPOINTMENTS: '/appointments',
  APPOINTMENT_DETAIL: '/appointments/:id',
  APPOINTMENT_BOOKING: '/appointments/book/:vetId',
  APPOINTMENT_RESCHEDULE: '/appointments/:id/reschedule',
  
  // Search and discovery
  VETS: '/vets',
  VET_DETAIL: '/vets/:id',
  CLINICS: '/clinics',
  CLINIC_DETAIL: '/clinics/:id',
  
  // Reviews and feedback
  REVIEWS: '/reviews',
  WRITE_REVIEW: '/reviews/write/:appointmentId',
  
  // Help and support
  HELP: '/help',
  FAQ: '/faq',
  CONTACT: '/contact',
};

/**
 * Route groups by user role for authorization
 */
export const ROUTE_GROUPS = {
  PUBLIC: [
    ROUTES.HOME,
    ROUTES.LOGIN,
    ROUTES.REGISTER,
    ROUTES.FORGOT_PASSWORD,
    ROUTES.RESET_PASSWORD,
    ROUTES.HELP,
    ROUTES.FAQ,
    ROUTES.CONTACT,
  ],
  
  PET_OWNER: [
    ROUTES.OWNER_DASHBOARD,
    ROUTES.PETS,
    ROUTES.PET_DETAIL,
    ROUTES.ADD_PET,
    ROUTES.EDIT_PET,
    ROUTES.APPOINTMENTS,
    ROUTES.APPOINTMENT_DETAIL,
    ROUTES.APPOINTMENT_BOOKING,
    ROUTES.APPOINTMENT_RESCHEDULE,
    ROUTES.VETS,
    ROUTES.VET_DETAIL,
    ROUTES.CLINICS,
    ROUTES.CLINIC_DETAIL,
    ROUTES.REVIEWS,
    ROUTES.WRITE_REVIEW,
    ROUTES.PROFILE,
    ROUTES.SETTINGS,
    ROUTES.NOTIFICATIONS,
  ],
  
  VETERINARIAN: [
    ROUTES.VET_DASHBOARD,
    ROUTES.VET_SCHEDULE,
    ROUTES.APPOINTMENTS,
    ROUTES.APPOINTMENT_DETAIL,
    ROUTES.PROFILE,
    ROUTES.SETTINGS,
    ROUTES.NOTIFICATIONS,
  ],
};
