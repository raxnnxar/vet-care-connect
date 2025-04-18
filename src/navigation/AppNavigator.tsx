
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
      
      // Skip navigation logic if user is already on the correct profile setup or post-signup screens
      // This prevents interrupting the user flow when they are completing their profile
      if (
        location.pathname === '/profile-setup' || 
        location.pathname === '/post-signup-role' || 
        location.pathname === '/post-signup-service-type'
      ) {
        console.log('User is on a profile setup/post-signup screen, allowing completion of flow');
        return;
      }

      // Skip navigation logic if user is already on the correct owner/vet path
      // and has completed all required profile information
      if (
        (user.role === USER_ROLES.PET_OWNER && user.phone && location.pathname.startsWith('/owner')) || 
        (user.role === USER_ROLES.VETERINARIAN && user.serviceType && location.pathname.startsWith('/vet'))
      ) {
        console.log('User has complete profile and is on the correct path, skipping navigation');
        return;
      }
      
      // If user is authenticated but doesn't have a role yet, redirect to role selection
      if (!user.role || user.role === undefined) {
        console.log('User has no role, redirecting to role selection');
        navigate('/post-signup-role');
        return;
      }

      // If user is a pet owner without a phone number, redirect to profile setup
      if (user.role === USER_ROLES.PET_OWNER && (!user.phone || user.phone === undefined)) {
        console.log('Pet owner has no phone, redirecting to profile setup');
        navigate('/profile-setup');
        return;
      }

      // If user is a service provider but doesn't have a service type, redirect to service type selection
      if (user.role === USER_ROLES.VETERINARIAN && (!user.serviceType || user.serviceType === undefined)) {
        console.log('Service provider has no service type, redirecting to service type selection');
        navigate('/post-signup-service-type');
        return;
      }

      // If user has complete profile, navigate to the appropriate dashboard
      if (user.role) {
        if (user.role === USER_ROLES.PET_OWNER && user.phone && !location.pathname.startsWith('/owner')) {
          console.log('Pet owner profile complete, navigating to pet owner dashboard');
          navigate(ROUTES.OWNER_HOME);
        } else if (user.role === USER_ROLES.VETERINARIAN && user.serviceType && !location.pathname.startsWith('/vet')) {
          console.log('Vet profile complete, navigating to vet dashboard');
          navigate('/vet');
        }
      }
    }
  }, [user, navigate, location.pathname]);

  return (
    <Routes>
      {/* Post-signup flow routes */}
      <Route path="/post-signup-role" element={<PostSignupRoleScreen />} />
      <Route path="/post-signup-service-type" element={<PostSignupServiceTypeScreen />} />
      <Route path="/profile-setup" element={<ProfileSetupScreen />} />

      {/* Main navigators based on user role */}
      <Route path="/owner/*" element={<OwnerNavigator />} />
      <Route path="/vet/*" element={<VetNavigator />} />
      
      {/* Default to auth navigator for all other paths */}
      <Route path="/*" element={<AuthNavigator />} />
    </Routes>
  );
};

export default AppNavigator;
