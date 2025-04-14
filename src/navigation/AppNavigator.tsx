
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AuthNavigator from './AuthNavigator';
import OwnerNavigator from './OwnerNavigator';
import VetNavigator from './VetNavigator';
import { UserRoleType, USER_ROLES } from '@/core/constants/app.constants';

const AppNavigator = () => {
  const { user } = useSelector((state: any) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      console.log('Current user state in AppNavigator:', user);
      console.log('Current path:', location.pathname);
      
      // If user is authenticated but doesn't have a role yet, redirect to role selection
      if (!user.role && !location.pathname.includes('/post-signup-')) {
        console.log('User has no role, redirecting to role selection');
        navigate('/post-signup-role');
        return;
      }

      // If user is a service provider but doesn't have a service type, redirect to service type selection
      if (user.role === USER_ROLES.VETERINARIAN && !user.serviceType && 
          !location.pathname.includes('/post-signup-service-type')) {
        console.log('Service provider has no service type, redirecting to service type selection');
        navigate('/post-signup-service-type');
        return;
      }

      // If user has complete profile, navigate to the appropriate dashboard
      if (user.role && (user.role !== USER_ROLES.VETERINARIAN || user.serviceType)) {
        if (user.role === USER_ROLES.PET_OWNER) {
          console.log('Navigating to pet owner dashboard');
          navigate('/owner');
        } else if (user.role === USER_ROLES.VETERINARIAN) {
          console.log('Navigating to vet dashboard');
          navigate('/vet');
        }
      }
    }
  }, [user, navigate, location.pathname]);

  // Determine which navigator to show based on user role
  if (!user) {
    return <AuthNavigator />;
  }

  // Show appropriate navigator based on role
  if (user.role === USER_ROLES.PET_OWNER) {
    return <OwnerNavigator />;
  } else if (user.role === USER_ROLES.VETERINARIAN) {
    return <VetNavigator />;
  }
  
  // Default to auth navigator for incomplete profiles
  return <AuthNavigator />;
};

export default AppNavigator;
