
import React from 'react';
import { Button } from '@/ui/atoms/button';
import { VettLogo } from '@/ui/atoms/VettLogo';
import { useNavigate } from 'react-router-dom';

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const brandColor = "#91CFC2"; // Updated background color

  const handleGetStarted = () => {
    navigate('/signup');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div 
      className="flex flex-col items-center justify-between h-screen p-8" 
      style={{ backgroundColor: brandColor }}
    >
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="mb-10">
          <VettLogo color="white" className="scale-150" />
        </div>
        
        <p className="text-white text-center text-lg font-light tracking-wide mb-6">
          Todo para tu mascota en un solo lugar
        </p>
      </div>

      <div className="w-full max-w-md space-y-6 mb-4">
        <Button 
          variant="default" 
          className="w-full py-6 rounded-full bg-white hover:bg-gray-50 shadow-md transition-all"
          style={{ color: brandColor }}
          onClick={handleGetStarted}
        >
          <span className="text-lg font-medium">Empezar</span>
        </Button>
        
        <div className="flex justify-center">
          <button 
            onClick={handleLogin} 
            className="text-white text-base opacity-90 hover:opacity-100 transition-opacity font-light"
          >
            Ya tengo una cuenta
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
