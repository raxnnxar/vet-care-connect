
import { VET_ROUTES } from '../navigationConfig';
import VetDashboard from '@/features/vets/screens/VetDashboard';
import VetAppointmentDetailScreen from '@/features/vets/screens/VetAppointmentDetailScreen';
import VetProfileScreen from '@/features/vets/screens/VetProfileScreen';
import VetScheduleScreen from '@/features/vets/screens/VetScheduleScreen';
import VetReviewScreen from '@/features/vets/screens/VetReviewScreen';
import UnderConstructionPage from '../components/UnderConstructionPage';

// Define the routes for the vet navigator
export const vetRoutes = [
  { path: VET_ROUTES.DASHBOARD, element: VetDashboard },
  { path: VET_ROUTES.APPOINTMENTS, element: UnderConstructionPage, title: "Citas" },
  { path: VET_ROUTES.APPOINTMENT_DETAIL, element: VetAppointmentDetailScreen },
  { path: VET_ROUTES.PROFILE, element: VetProfileScreen },
  { path: VET_ROUTES.SETTINGS, element: UnderConstructionPage, title: "Configuración" },
  { path: VET_ROUTES.PATIENTS, element: UnderConstructionPage, title: "Pacientes" },
  { path: VET_ROUTES.SCHEDULE, element: VetScheduleScreen },
  { path: VET_ROUTES.REVIEW, element: VetReviewScreen },
  { path: "*", element: VetDashboard }
];
