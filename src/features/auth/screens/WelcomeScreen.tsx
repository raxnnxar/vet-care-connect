import React from 'react';
import { Button } from '../atoms/Button';
import { VettLogo } from '../atoms/VettLogo';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted, onLogin }) => {
  return (
    <div className="flex flex-col items-center justify-between h-screen bg-teal-300 p-8">
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Ensure proper sizing and spacing for the logo */}
        <div className="mb-8">
          <VettLogo color="white" className="scale-150" />
        </div>
        
        <p className="text-white text-center text-lg mb-12">
          Todo para tu mascota en un solo lugar
        </p>
      </div>

      <div className="w-full max-w-md">
        <Button 
          variant="primary" 
          className="w-full mb-4 bg-white text-teal-500 hover:bg-gray-100"
          onClick={onGetStarted}
        >
          Empezar
        </Button>
        
        <p className="text-white text-center">
          Si ya tienes una cuenta, <button onClick={onLogin} className="underline">inicia sesión</button>
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
