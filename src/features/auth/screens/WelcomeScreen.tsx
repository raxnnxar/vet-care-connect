
import React from 'react';
import { Button } from '@/ui/atoms/button';
import { VettLogo } from '@/ui/atoms/VettLogo';
import { useNavigate } from 'react-router-dom';

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/signup');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center justify-between h-screen p-8" style={{ backgroundColor: '#84D3C5' }}>
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
          variant="default" 
          className="w-full mb-4 bg-white text-[#84D3C5] hover:bg-gray-100"
          onClick={handleGetStarted}
        >
          Empezar
        </Button>
        
        <p className="text-white text-center">
          Si ya tienes una cuenta, <button onClick={handleLogin} className="underline">inicia sesión</button>
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
