
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
      className="flex flex-col items-center justify-between h-screen px-8 py-12" 
      style={{ backgroundColor: brandColor }}
    >
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="mb-10 animate-fade-in">
          <VettLogo color="white" size="xl" className="mb-3" />
        </div>
        
        <p className="text-white text-opacity-85 text-center text-lg font-light tracking-wide mb-10 max-w-xs">
          Todo para tu mascota en un solo lugar
        </p>
      </div>

      <div className="w-full max-w-sm space-y-7 mb-4">
        <Button 
          variant="default" 
          className="w-full py-6 rounded-full bg-white hover:bg-gray-50 shadow-lg transition-all"
          style={{ color: brandColor }}
          onClick={handleGetStarted}
        >
          <span className="text-lg font-medium">Empezar</span>
        </Button>
        
        <div className="flex justify-center">
          <button 
            onClick={handleLogin} 
            className="text-white text-opacity-80 text-base hover:text-opacity-100 transition-opacity font-light"
          >
            Ya tengo una cuenta
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
