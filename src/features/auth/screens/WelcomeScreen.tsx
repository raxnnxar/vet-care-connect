
import React from 'react';
import { Button } from '@/ui/atoms/button';
import { VettLogo } from '@/ui/atoms/VettLogo';
import { useNavigate } from 'react-router-dom';
import { PawPrint } from 'lucide-react';

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const brandColor = "#79d0b8"; // Updated to requested color
  const accentColor = "#FF8A65"; // Coral accent for warmth
  const accentTeal = "#4DA6A8"; // Deep teal blue for better contrast

  const handleGetStarted = () => {
    navigate('/role-selection');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="relative flex flex-col items-center h-screen px-6 py-12 overflow-hidden">
      {/* Background with enhanced gradient */}
      <div 
        className="absolute inset-0 w-full h-full z-0" 
        style={{ 
          background: `radial-gradient(circle at 50% 25%, #a1e2d0, ${brandColor} 70%)`,
        }}
      />
      
      {/* Top spacer for better composition */}
      <div className="h-8 w-full z-10" />
      
      {/* Content container with improved spacing */}
      <div className="flex-1 flex flex-col items-center justify-center z-10 w-full">
        {/* Logo container with proper spacing */}
        <div className="flex flex-col items-center mb-12 animate-fade-in w-full">
          <VettLogo color="white" size="2xl" className="drop-shadow-sm" />
        </div>
        
        {/* Subtitle with improved typography */}
        <p 
          className="text-white text-opacity-95 text-center px-8 text-lg font-medium tracking-wide max-w-[280px] animate-fade-in mb-4" 
          style={{ 
            animationDelay: '200ms', 
            lineHeight: '1.4',
            textShadow: '0 1px 2px rgba(0,0,0,0.1)' 
          }}
        >
          Todo para tu mascota en un solo lugar
        </p>
      </div>

      {/* Action section with improved positioning and visual hierarchy */}
      <div className="w-full max-w-xs z-10 mb-8 animate-fade-up flex flex-col items-center" style={{ animationDelay: '400ms' }}>
        <Button 
          variant="default" 
          className="w-full py-6 rounded-full bg-white hover:bg-gray-50 shadow-lg transition-all group mb-10" 
          style={{ 
            color: "#1F2937", 
            opacity: 0.96,
            boxShadow: "0 8px 20px -5px rgba(0,0,0,0.15)",
          }}
          onClick={handleGetStarted}
        >
          <div className="flex items-center justify-center gap-3">
            <PawPrint className="w-6 h-6 text-accent1 group-hover:scale-110 transition-transform" />
            <span className="text-xl font-semibold">Empezar</span>
          </div>
        </Button>
        
        <button 
          onClick={handleLogin} 
          className="text-white text-base font-medium hover:text-white hover:underline underline-offset-4 transition-all py-2 px-4"
          style={{ 
            textShadow: "0 1px 2px rgba(0,0,0,0.15)",
            letterSpacing: "0.01em"
          }}
        >
          Ya tengo una cuenta
        </button>
      </div>
      
      {/* Bottom spacer for better composition */}
      <div className="h-2 w-full z-10" />
    </div>
  );
};

export default WelcomeScreen;
