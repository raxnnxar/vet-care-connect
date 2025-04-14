
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SCREENS } from './navigationConfig';
import WelcomeScreen from '../features/auth/screens/WelcomeScreen';
import RoleSelectionScreen from '../features/auth/screens/RoleSelectionScreen';
import ServiceTypeSelectionScreen from '../features/auth/screens/ServiceTypeSelectionScreen';
import SignupScreen from '../features/auth/screens/SignupScreen';
import PostSignupRoleScreen from '../features/auth/screens/PostSignupRoleScreen';
import PostSignupServiceTypeScreen from '../features/auth/screens/PostSignupServiceTypeScreen';

// Placeholder screen components
const LoginScreen = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <h2 className="text-xl font-semibold">Login Screen</h2>
    </div>
  </div>
);

const ForgotPasswordScreen = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <h2 className="text-xl font-semibold">Forgot Password Screen</h2>
    </div>
  </div>
);

const AuthNavigator = () => {
  return (
    <div className="relative h-full">
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/signup" element={<SignupScreen />} />
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
        <Route path="/role-selection" element={<RoleSelectionScreen />} />
        <Route path="/service-type-selection" element={<ServiceTypeSelectionScreen />} />
        <Route path="/post-signup-role" element={<PostSignupRoleScreen />} />
        <Route path="/post-signup-service-type" element={<PostSignupServiceTypeScreen />} />
      </Routes>
    </div>
  );
};

export default AuthNavigator;
