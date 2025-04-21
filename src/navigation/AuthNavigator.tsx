
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '@/frontend/shared/constants/routes';
import WelcomeScreen from '../features/auth/screens/WelcomeScreen';
import SignupScreen from '../features/auth/screens/SignupScreen';

// Update path to LoginScreen
import LoginScreen from '../features/auth/screens/LoginScreen';
import ForgotPasswordScreen from '../features/auth/screens/ForgotPasswordScreen';
import ResetPasswordScreen from '../features/auth/screens/ResetPasswordScreen';

const AuthNavigator = () => {
  return (
    <div className="relative h-full">
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path={ROUTES.LOGIN.replace('/', '')} element={<LoginScreen />} />
        <Route path={ROUTES.SIGNUP.replace('/', '')} element={<SignupScreen />} />
        <Route path={ROUTES.FORGOT_PASSWORD.replace('/', '')} element={<ForgotPasswordScreen />} />
        <Route path={ROUTES.RESET_PASSWORD.replace('/', '')} element={<ResetPasswordScreen />} />
        {/* Default route redirects to welcome screen */}
        <Route path="*" element={<WelcomeScreen />} />
      </Routes>
    </div>
  );
};

export default AuthNavigator;
