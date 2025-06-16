
import React, { useEffect } from 'react';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AuthNavigator from './AuthNavigator';
import OwnerNavigator from './OwnerNavigator';
import VetNavigator from './VetNavigator';
import GroomingNavigator from './GroomingNavigator';
import { UserRoleType, USER_ROLES } from '@/core/constants/app.constants';
import PostSignupRoleScreen from '../features/auth/screens/PostSignupRoleScreen';
import PostSignupServiceTypeScreen from '../features/auth/screens/PostSignupServiceTypeScreen';
import ProfileSetupScreen from '../features/auth/screens/ProfileSetupScreen';
import LocationSetupScreen from '../features/auth/screens/LocationSetupScreen';
import VetProfileSetupScreen from '../features/auth/screens/VetProfileSetupScreen';
import VetLocationSetupScreen from '../features/auth/screens/VetLocationSetupScreen';
import PetGroomingProfileSetupScreen from '../features/auth/screens/PetGroomingProfileSetupScreen';
import GroomingLocationSetupScreen from '../features/auth/screens/GroomingLocationSetupScreen';
import { ROUTES } from '@/frontend/shared/constants/routes';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';

const AppNavigator = () => {
  const { user } = useSelector((state: any) => state.auth);
  const { userRole, providerType } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      console.log('Current user state in AppNavigator:', user);
      console.log('Current role info:', { userRole, providerType });
      console.log('Current path:', location.pathname);
      
      // Skip navigation logic if user is already on specific screens or vet routes
      if (
        location.pathname === ROUTES.PROFILE_SETUP || 
        location.pathname === '/location-setup' ||
        location.pathname === ROUTES.VET_PROFILE_SETUP ||
        location.pathname === ROUTES.GROOMING_PROFILE_SETUP ||
        location.pathname === ROUTES.GROOMING_LOCATION_SETUP ||
        location.pathname === '/vet-location-setup' ||
        location.pathname === ROUTES.POST_SIGNUP_ROLE || 
        location.pathname === ROUTES.POST_SIGNUP_SERVICE_TYPE ||
        location.pathname.includes('/profile') ||
        location.pathname.includes('/chats') ||
        location.pathname.includes('/review') ||
        location.pathname.includes('/detalles-cita') ||
        location.pathname.includes('/appointments') ||
        location.pathname.includes('/agenda')
      ) {
        console.log('User is on a setup/profile/chat/review/vet screen, allowing completion of flow');
        return;
      }
      
      // If user is already in the owner, vet, or grooming section, don't redirect
      if (
        location.pathname.startsWith('/owner') || 
        location.pathname.startsWith('/vet') ||
        location.pathname.startsWith('/grooming')
      ) {
        console.log('User is in a section, no redirect needed');
        return;
      }
      
      // Si el usuario no tiene rol, enviarlo a la selección de rol
      if (!userRole) {
        console.log('User has no role, redirecting to role selection');
        navigate(ROUTES.POST_SIGNUP_ROLE);
        return;
      }
      
      // Si el usuario es proveedor de servicios pero sin tipo, redirigir a selección de tipo
      if (userRole === 'service_provider' && !providerType) {
        console.log('Service provider has no type, redirecting to service type selection');
        navigate(ROUTES.POST_SIGNUP_SERVICE_TYPE);
        return;
      }
      
      // Mejorado: Redirigir según el rol y tipo de usuario SOLO si está en la raíz
      if (location.pathname === '/') {
        if (userRole === 'pet_owner') {
          console.log('Redirecting pet owner to owner home');
          navigate(ROUTES.OWNER);
        } else if (userRole === 'service_provider') {
          if (providerType === 'veterinarian') {
            console.log('Redirecting vet to vet home');
            navigate(ROUTES.VET);
          } else if (providerType === 'grooming') {
            console.log('Redirecting groomer to grooming home');
            navigate(ROUTES.GROOMING);
          } else {
            console.log('Redirecting service provider to appropriate home page');
            navigate(ROUTES.VET);
          }
        }
      }
    } else {
      console.log('No user found in AppNavigator');
      
      // If no user and not on auth routes, redirect to login
      if (
        !location.pathname.startsWith('/login') && 
        !location.pathname.startsWith('/signup') &&
        !location.pathname.startsWith('/forgot-password') &&
        !location.pathname.startsWith('/reset-password') &&
        location.pathname !== '/'
      ) {
        console.log('No user and not on auth route, redirecting to login');
        navigate(ROUTES.LOGIN);
      }
    }
  }, [user, userRole, providerType, navigate, location.pathname]);

  return (
    <Routes>
      {/* Auth and onboarding routes */}
      <Route path={ROUTES.POST_SIGNUP_ROLE} element={<PostSignupRoleScreen />} />
      <Route path={ROUTES.POST_SIGNUP_SERVICE_TYPE} element={<PostSignupServiceTypeScreen />} />
      <Route path={ROUTES.PROFILE_SETUP} element={<ProfileSetupScreen />} />
      <Route path="/location-setup" element={<LocationSetupScreen />} />
      <Route path={ROUTES.VET_PROFILE_SETUP} element={<VetProfileSetupScreen />} />
      <Route path={ROUTES.GROOMING_PROFILE_SETUP} element={<PetGroomingProfileSetupScreen />} />
      <Route path={ROUTES.GROOMING_LOCATION_SETUP} element={<GroomingLocationSetupScreen />} />
      <Route path="/vet-location-setup" element={<VetLocationSetupScreen />} />
      
      {/* Nested navigators */}
      <Route path={`${ROUTES.OWNER}/*`} element={<OwnerNavigator />} />
      <Route path={`${ROUTES.VET}/*`} element={<VetNavigator />} />
      <Route path={`${ROUTES.GROOMING}/*`} element={<GroomingNavigator />} />
      
      {/* Auth routes - should be last to catch all other routes when not authenticated */}
      <Route path="/*" element={<AuthNavigator />} />
    </Routes>
  );
};

export default AppNavigator;
