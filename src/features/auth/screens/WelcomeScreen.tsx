
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/ui/atoms/button';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ 
  onGetStarted, 
  onLogin 
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6 py-12">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md gap-8">
        {/* Logo */}
        <div className="mb-4">
          <img 
            src="/lovable-uploads/915815b7-5193-4544-9de0-cab182d80456.png" 
            alt="Vett Logo" 
            className="w-48 h-auto" 
          />
        </div>
        
        {/* Tagline */}
        <p className="text-center text-gray-700 text-lg mb-8">
          Conectando dueños de mascotas con atención veterinaria
        </p>
        
        {/* Buttons */}
        <div className="flex flex-col items-center gap-6 w-full mt-6">
          <Button 
            onClick={onGetStarted} 
            className="w-full py-6 text-lg flex items-center justify-center gap-2 bg-[#7ECEC4] hover:bg-[#6dbdb3] text-white"
          >
            Empezar
            <ArrowRight className="h-5 w-5" />
          </Button>
          
          <button 
            onClick={onLogin} 
            className="text-gray-600 hover:text-gray-900 underline text-lg"
          >
            Ya tengo una cuenta
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
