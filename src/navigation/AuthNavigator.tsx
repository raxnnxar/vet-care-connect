
import React, { useState } from 'react';
import { SCREENS } from './navigationConfig';
import WelcomeScreen from '../features/auth/screens/WelcomeScreen';

type AuthScreen = 'Welcome' | 'Login' | 'Signup' | 'ForgotPassword' | 'RoleSelection';

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

const RoleSelectionScreen = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <h2 className="text-xl font-semibold">Role Selection Screen</h2>
    </div>
  </div>
);

const AuthNavigator = () => {
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('Welcome');
  
  const handleGetStarted = () => {
    setCurrentScreen('RoleSelection');
  };
  
  const handleLogin = () => {
    setCurrentScreen('Login');
  };
  
  const renderScreen = () => {
    switch (currentScreen) {
      case 'Welcome':
        return <WelcomeScreen onGetStarted={handleGetStarted} onLogin={handleLogin} />;
      case 'Login':
        return <LoginScreen />;
      case 'Signup':
        return <SignupScreen />;
      case 'ForgotPassword':
        return <ForgotPasswordScreen />;
      case 'RoleSelection':
        return <RoleSelectionScreen />;
      default:
        return <WelcomeScreen onGetStarted={handleGetStarted} onLogin={handleLogin} />;
    }
  };
  
  // Only show header for auth screens other than Welcome
  const renderHeader = () => {
    if (currentScreen === 'Welcome') return null;
    
    return (
      <div className="bg-white p-4 shadow-sm border-b">
        <h1 className="text-lg font-semibold">
          {currentScreen === 'Login' ? 'Iniciar Sesión' : 
           currentScreen === 'Signup' ? 'Crear Cuenta' : 
           currentScreen === 'ForgotPassword' ? 'Recuperar Contraseña' : 
           currentScreen === 'RoleSelection' ? 'Seleccionar Rol' : ''}
        </h1>
      </div>
    );
  };
  
  return (
    <div className="relative h-full">
      {renderHeader()}
      {renderScreen()}
      
      {/* Navigation controls - only show on non-welcome screens */}
      {currentScreen !== 'Welcome' && (
        <nav className="fixed bottom-20 left-0 right-0 p-4 flex justify-center gap-4">
          <button 
            className={`px-4 py-2 rounded ${currentScreen === 'Login' ? 'bg-primary text-white' : 'bg-gray-200'}`}
            onClick={() => setCurrentScreen('Login')}
          >
            Login
          </button>
          <button 
            className={`px-4 py-2 rounded ${currentScreen === 'Signup' ? 'bg-primary text-white' : 'bg-gray-200'}`}
            onClick={() => setCurrentScreen('Signup')}
          >
            Signup
          </button>
          <button 
            className={`px-4 py-2 rounded ${currentScreen === 'ForgotPassword' ? 'bg-primary text-white' : 'bg-gray-200'}`}
            onClick={() => setCurrentScreen('ForgotPassword')}
          >
            Forgot Password
          </button>
          <button 
            className={`px-4 py-2 rounded ${currentScreen === 'RoleSelection' ? 'bg-primary text-white' : 'bg-gray-200'}`}
            onClick={() => setCurrentScreen('RoleSelection')}
          >
            Role Selection
          </button>
        </nav>
      )}
    </div>
  );
};

export default AuthNavigator;
