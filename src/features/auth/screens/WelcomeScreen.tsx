
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
      <div className="flex flex-col items-center justify-center flex-1 z-10">
        <div className="flex flex-col items-center max-w-md px-6 py-10">
          {/* Logo with animation */}
          <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
            <VettLogo width={180} height={180} />
          </div>
          
          {/* Text content */}
          <div className="text-center mt-8 mb-12">
            <h1 className="text-white text-4xl font-bold mb-4 animate-fade-in" style={{ animationDelay: "400ms" }}>
              Vett
            </h1>
            <p className="text-white text-xl animate-fade-in" style={{ animationDelay: "600ms" }}>
              Conectando dueños de mascotas con atención veterinaria
            </p>
          </div>
          
          {/* Buttons with animations */}
          <div className="w-full space-y-4 animate-fade-up" style={{ animationDelay: "800ms" }}>
            <Button 
              onClick={handleGetStarted}
              className="w-full py-6 bg-white text-gray-800 hover:bg-gray-100 rounded-full text-xl font-semibold"
            >
              Empezar
            </Button>
            
            <Button 
              onClick={handleLogin}
              variant="outline" 
              className="w-full py-6 text-white border-white hover:bg-white/10 rounded-full text-xl font-semibold"
            >
              Ya tengo una cuenta
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
