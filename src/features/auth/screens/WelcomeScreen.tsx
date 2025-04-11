
import React from 'react';
import { Button } from '@/ui/atoms/button';
import { VettLogo } from '@/ui/atoms/VettLogo';
import { useNavigate } from 'react-router-dom';
import { PawPrint } from 'lucide-react';

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const brandColor = "#91CFC2"; // Primary teal color
  const accentColor = "#FF8A65"; // Coral accent for warmth

  const handleGetStarted = () => {
    navigate('/signup');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="relative flex flex-col items-center justify-between h-screen px-8 py-12 overflow-hidden">
      {/* Background with soft radial gradient */}
      <div 
        className="absolute inset-0 w-full h-full z-0" 
        style={{ 
          background: `radial-gradient(circle at 50% 40%, #9DDBD0, ${brandColor})`,
        }}
      />
      
      <div className="flex-1 flex flex-col items-center justify-center z-10 relative">
        <div className="mb-8 animate-fade-in">
          <VettLogo color="white" size="xl" className="mb-3" />
        </div>
        
        <p className="text-white text-opacity-90 text-center text-lg font-light tracking-wide mb-10 max-w-xs animate-fade-in" 
          style={{ animationDelay: '200ms' }}>
          Todo para tu mascota en un solo lugar
        </p>
      </div>

      <div className="w-full max-w-sm space-y-7 mb-4 z-10 relative animate-fade-up" style={{ animationDelay: '400ms' }}>
        <Button 
          variant="default" 
          className="w-full py-6 rounded-full bg-white hover:bg-gray-50 shadow-lg transition-all group"
          style={{ 
            color: "#1F2937", 
            opacity: 0.9,
            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -5px rgba(0,0,0,0.04)",
          }}
          onClick={handleGetStarted}
        >
          <div className="flex items-center justify-center gap-2">
            <PawPrint className="w-5 h-5 text-accent1 opacity-90 group-hover:scale-110 transition-transform" />
            <span className="text-lg font-medium">Empezar</span>
          </div>
        </Button>
        
        <div className="flex justify-center">
          <button 
            onClick={handleLogin} 
            className="text-white text-opacity-80 text-base hover:text-opacity-100 transition-opacity font-light hover:text-accent2"
          >
            Ya tengo una cuenta
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
