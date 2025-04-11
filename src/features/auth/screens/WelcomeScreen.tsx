
import React from 'react';
import { Button } from '@/ui/atoms/button';
import { VettLogo } from '@/ui/atoms/VettLogo';
import { useNavigate } from 'react-router-dom';
import { PawPrint } from 'lucide-react';

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const brandColor = "#7ee5c9"; // Updated to requested color
  const accentColor = "#FF8A65"; // Coral accent for warmth
  const accentTeal = "#4DA6A8"; // Deep teal blue for better contrast

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
          background: `radial-gradient(circle at 50% 40%, #aff0dc, ${brandColor})`,
        }}
      />
      
      {/* Content container moved higher with more spacing */}
      <div className="flex-1 flex flex-col items-center justify-center z-10 relative pt-0 pb-20">
        {/* Logo container with increased bottom margin for more separation from subtitle */}
        <div className="mb-20 animate-fade-in flex flex-col items-center">
          <VettLogo color="white" size="2xl" className="mb-0" />
        </div>
        
        {/* Subtitle positioning */}
        <p className="text-white text-opacity-90 text-center text-lg font-light tracking-wide max-w-xs animate-fade-in" 
          style={{ 
            animationDelay: '200ms', 
            lineHeight: '1.3' 
          }}>
          Todo para tu mascota en un solo lugar
        </p>
      </div>

      {/* Button section */}
      <div className="w-full max-w-sm space-y-7 mb-8 z-10 relative animate-fade-up" style={{ animationDelay: '400ms' }}>
        <Button 
          variant="default" 
          className="w-full py-7 rounded-full bg-white hover:bg-gray-50 shadow-lg transition-all group" 
          style={{ 
            color: "#1F2937", 
            opacity: 0.9,
            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -5px rgba(0,0,0,0.04)",
          }}
          onClick={handleGetStarted}
        >
          <div className="flex items-center justify-center gap-3">
            <PawPrint className="w-6 h-6 text-accent1 opacity-90 group-hover:scale-110 transition-transform" />
            <span className="text-xl font-medium">Empezar</span>
          </div>
        </Button>
        
        <div className="flex justify-center">
          <button 
            onClick={handleLogin} 
            className="text-white hover:text-accent3 text-opacity-80 text-base hover:text-opacity-100 transition-all font-light hover:underline underline-offset-4"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}
          >
            Ya tengo una cuenta
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
