
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/ui/atoms/button';
import VettLogo from '@/ui/atoms/VettLogo';

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/signup');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="relative flex flex-col h-screen overflow-hidden">
      {/* Gradient background */}
      <div 
        className="absolute inset-0 w-full h-full z-0 bg-gradient-to-b from-[#7ECEC4] to-[#79D0B8]"
      />
      
      {/* Content area with proper z-index */}
      <div className="flex flex-col items-center justify-center flex-1 z-10 px-6">
        {/* Logo with Vett text next to it */}
        <div className="animate-fade-in mb-16 flex items-center" style={{ animationDelay: "200ms" }}>
          <VettLogo size="2xl" />
          <h1 className="text-white text-4xl font-bold ml-3 tracking-wide">Vett</h1>
        </div>
        
        {/* Tagline content */}
        <div className="text-center mb-20">
          <p className="text-white text-2xl animate-fade-in" style={{ animationDelay: "400ms" }}>
            Todo para tu mascota en
          </p>
          <p className="text-white text-2xl animate-fade-in" style={{ animationDelay: "400ms" }}>
            un solo lugar
          </p>
        </div>
        
        {/* Buttons with animations */}
        <div className="w-full max-w-xs space-y-4 animate-fade-up" style={{ animationDelay: "600ms" }}>
          <Button 
            onClick={handleGetStarted}
            className="w-full py-6 bg-white text-gray-800 hover:bg-gray-100 rounded-full text-xl font-semibold flex items-center justify-center"
          >
            Empezar
          </Button>
          
          <Button 
            onClick={handleLogin}
            variant="ghost"
            className="w-full py-3 text-white hover:bg-white/10 rounded-full text-lg"
          >
            Ya tengo una cuenta
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
