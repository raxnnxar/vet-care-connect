
import React, { useState } from 'react';
import { SCREENS } from './navigationConfig';

type AuthScreen = 'Login' | 'Signup' | 'ForgotPassword';

// Placeholder screen components
const LoginScreen = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <h2 className="text-xl font-semibold">Login Screen</h2>
    </div>
  </div>
);

const SignupScreen = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <h2 className="text-xl font-semibold">Signup Screen</h2>
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
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('Login');
  
  const renderScreen = () => {
    switch (currentScreen) {
      case 'Login':
        return <LoginScreen />;
      case 'Signup':
        return <SignupScreen />;
      case 'ForgotPassword':
        return <ForgotPasswordScreen />;
      default:
        return <LoginScreen />;
    }
  };
  
  return (
    <div className="relative h-full">
      <div className="bg-white p-4 shadow-sm border-b">
        <h1 className="text-lg font-semibold">
          {currentScreen === 'Login' ? 'Sign In' : 
           currentScreen === 'Signup' ? 'Create Account' : 'Reset Password'}
        </h1>
      </div>
      
      {renderScreen()}
      
      <nav className="fixed bottom-20 left-0 right-0 p-4 flex justify-center gap-4">
        <button 
          className={`px-4 py-2 rounded ${currentScreen === 'Login' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setCurrentScreen('Login')}
        >
          Login
        </button>
        <button 
          className={`px-4 py-2 rounded ${currentScreen === 'Signup' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setCurrentScreen('Signup')}
        >
          Signup
        </button>
        <button 
          className={`px-4 py-2 rounded ${currentScreen === 'ForgotPassword' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setCurrentScreen('ForgotPassword')}
        >
          Forgot Password
        </button>
      </nav>
    </div>
  );
};

export default AuthNavigator;
