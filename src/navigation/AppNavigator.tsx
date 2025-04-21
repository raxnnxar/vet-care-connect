import React, { useEffect } from 'react';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AuthNavigator from './AuthNavigator';
import OwnerNavigator from './OwnerNavigator';
import VetNavigator from './VetNavigator';
import { UserRoleType, USER_ROLES } from '@/core/constants/app.constants';
import PostSignupRoleScreen from '../features/auth/screens/PostSignupRoleScreen';
import PostSignupServiceTypeScreen from '../features/auth/screens/PostSignupServiceTypeScreen';
import ProfileSetupScreen from '../features/auth/screens/ProfileSetupScreen';
import { ROUTES } from '@/frontend/shared/constants/routes';

const AppNavigator = () => {
  const { user } = useSelector((state: any) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      console.log('Current user state in AppNavigator:', user);
      console.log('Current path:', location.pathname);
      
      // Skip navigation logic if user is already on profile setup or post-signup screens
      if (
        location.pathname === ROUTES.PROFILE_SETUP || 
        location.pathname === ROUTES.POST_SIGNUP_ROLE || 
        location.pathname === ROUTES.POST_SIGNUP_SERVICE_TYPE
      ) {
        console.log('User is on a profile setup/post-signup screen, allowing completion of flow');
        return;
      }
      
      // If user has no role yet, direct them to role selection
      if (!user.role) {
        console.log('User has no role, redirecting to role selection');
        navigate(ROUTES.POST_SIGNUP_ROLE);
        return;
      }
      
      // If user is on the root path, redirect based on role
      if (location.pathname === '/') {
        if (user.role === 'pet_owner') {
          console.log('Redirecting pet owner to owner home');
          navigate(ROUTES.OWNER);
        } else if (user.role === 'service_provider') {
          console.log('Redirecting service provider to vet home');
          navigate(ROUTES.VET);
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
  }, [user, navigate, location.pathname]);

  return (
    <Routes>
      {/* Auth and onboarding routes */}
      <Route path={ROUTES.POST_SIGNUP_ROLE} element={<PostSignupRoleScreen />} />
      <Route path={ROUTES.POST_SIGNUP_SERVICE_TYPE} element={<PostSignupServiceTypeScreen />} />
      <Route path={ROUTES.PROFILE_SETUP} element={<ProfileSetupScreen />} />
      
      {/* Nested navigators */}
      <Route path={`${ROUTES.OWNER}/*`} element={<OwnerNavigator />} />
      <Route path={`${ROUTES.VET}/*`} element={<VetNavigator />} />
      
      {/* Auth routes - should be last to catch all other routes when not authenticated */}
      <Route path="/*" element={<AuthNavigator />} />
    </Routes>
  );
};

export default AppNavigator;
