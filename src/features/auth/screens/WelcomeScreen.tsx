
import React from 'react';
import { Button } from '@/ui/atoms/button';
import { VettLogo } from '@/ui/atoms/VettLogo';
import { useNavigate } from 'react-router-dom';
import { PawPrint } from 'lucide-react';

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const brandColor = "#91CFC2"; // Primary teal color
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
          background: `radial-gradient(circle at 50% 40%, #9DDBD0, ${brandColor})`,
        }}
      />
      
      <div className="flex-1 flex flex-col items-center justify-center z-10 relative">
        <div className="mb-12 animate-fade-in"> {/* Increased margin-bottom for better spacing */}
          <VettLogo color="white" size="2xl" className="mb-4" /> {/* Increased to 2xl size and more bottom margin */}
        </div>
        
        <p className="text-white text-opacity-90 text-center text-lg font-light tracking-wide mb-16 max-w-xs animate-fade-in" 
          style={{ animationDelay: '200ms', lineHeight: '1.4' }}> {/* Adjusted line-height and increased margin-bottom */}
          Todo para tu mascota en un solo lugar
        </p>
      </div>

      <div className="w-full max-w-sm space-y-7 mb-4 z-10 relative animate-fade-up" style={{ animationDelay: '400ms' }}>
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
          <div className="flex items-center justify-center gap-3"> {/* Increased gap for better spacing */}
            <PawPrint className="w-6 h-6 text-accent1 opacity-90 group-hover:scale-110 transition-transform" /> {/* Increased icon size */}
            <span className="text-xl font-medium">Empezar</span> {/* Increased font size */}
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
