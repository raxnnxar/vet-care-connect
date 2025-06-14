
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';

// Import navigators
import AuthNavigator from './AuthNavigator';
import OwnerNavigator from './OwnerNavigator';
import VetNavigator from './VetNavigator';
import GroomingNavigator from './GroomingNavigator';

// Import role check function
import { getUserRole } from '@/features/auth/utils/vetProfileUtils';

const AppNavigator = () => {
  const { user, session } = useSelector((state: RootState) => state.auth);
  const isAuthenticated = !!session && !!user;

  console.log('AppNavigator - User state:', { user, isAuthenticated });

  // If not authenticated, show auth navigator
  if (!isAuthenticated || !user) {
    console.log('No user found in AppNavigator');
    return <AuthNavigator />;
  }

  // Get user role to determine which navigator to show
  const userRole = getUserRole(user);
  console.log('AppNavigator - User role:', userRole);

  // Route based on user role
  switch (userRole) {
    case 'pet_owner':
      return <OwnerNavigator />;
    case 'service_provider':
      // Check provider type
      const providerType = user.raw_user_meta_data?.provider_type;
      if (providerType === 'grooming') {
        return <GroomingNavigator />;
      } else {
        return <VetNavigator />;
      }
    default:
      // Default to owner navigator for now
      return <OwnerNavigator />;
  }
};

export default AppNavigator;
