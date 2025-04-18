
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
      
      // Check for profile completion flag
      const profileCompleted = sessionStorage.getItem('profileCompleted') === 'true';
      if (profileCompleted) {
        console.log('Profile completion flag found, bypassing role check');
      }
      
      // Skip navigation logic if user is already on profile setup or post-signup screens
      if (
        location.pathname === '/profile-setup' || 
        location.pathname === '/post-signup-role' || 
        location.pathname === '/post-signup-service-type'
      ) {
        console.log('User is on a profile setup/post-signup screen, allowing completion of flow');
        return;
      }
      
      // Skip navigation logic if user is already on the owner dashboard path and the profile was completed
      if (
        (location.pathname === '/owner/dashboard' || location.pathname.startsWith('/owner')) && 
        profileCompleted
      ) {
        console.log('User is on the dashboard with completed profile, skipping navigation');
        return;
      }
      
      // If user is authenticated but doesn't have a role yet and profile wasn't just completed, redirect to role selection
      if (!user.role || user.role === undefined) {
        if (profileCompleted) {
          console.log('Profile was completed, skipping role redirect');
          return;
        }
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
        if (user.role === USER_ROLES.PET_OWNER && user.phone && !location.pathname.includes('/owner')) {
          console.log('Pet owner profile complete, navigating to pet owner dashboard');
          navigate('/owner/dashboard');
        } else if (user.role === USER_ROLES.VETERINARIAN && user.serviceType && !location.pathname.includes('/vet')) {
          console.log('Vet profile complete, navigating to vet dashboard');
          navigate('/vet');
        }
      }
    }
  }, [user, navigate, location.pathname]);

  // Clear the profile completed flag when the component unmounts
  useEffect(() => {
    return () => {
      if (location.pathname !== '/profile-setup' && 
          location.pathname !== '/post-signup-role' && 
          location.pathname !== '/post-signup-service-type') {
        sessionStorage.removeItem('profileCompleted');
        console.log('Cleared profileCompleted flag');
      }
    };
  }, [location.pathname]);

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
