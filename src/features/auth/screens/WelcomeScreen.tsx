
import React, { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ 
  onGetStarted, 
  onLogin 
}) => {
  // Animation effect when component mounts
  useEffect(() => {
    const elements = document.querySelectorAll('.animate-on-mount');
    elements.forEach((element, index) => {
      setTimeout(() => {
        (element as HTMLElement).style.opacity = '1';
        (element as HTMLElement).style.transform = 'translateY(0)';
      }, 100 * index);
    });
  }, []);

  return (
    <div className="relative min-h-screen bg-primary flex flex-col items-center justify-center px-6 py-12">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md gap-10">
        {/* Logo - white version directly on teal background */}
        <div 
          className="w-[60%] sm:w-[50%] lg:w-[40%] animate-on-mount transition-all duration-500 opacity-0 translate-y-4 mb-8"
          style={{ transformOrigin: 'center' }}
        >
          <img 
            src="/lovable-uploads/915815b7-5193-4544-9de0-cab182d80456.png" 
            alt="Vett Logo" 
            className="w-full h-auto invert" // Use invert to make the logo white
          />
        </div>
        
        {/* Tagline with clean white typography */}
        <p 
          className="text-center text-white font-medium text-lg md:text-xl leading-relaxed max-w-sm animate-on-mount transition-all duration-500 opacity-0 translate-y-4 mb-10"
          style={{ transitionDelay: '200ms' }}
        >
          Conectando dueños de mascotas con atención veterinaria
        </p>
        
        {/* Buttons container with animation */}
        <div 
          className="flex flex-col items-center gap-6 w-full mt-4 animate-on-mount transition-all duration-500 opacity-0 translate-y-4"
          style={{ transitionDelay: '300ms' }}
        >
          {/* Clean white button with teal text */}
          <button 
            onClick={onGetStarted} 
            className={cn(
              "w-full py-4 px-6 text-lg font-medium flex items-center justify-center gap-3",
              "bg-white text-primary hover:bg-gray-50 transition-all duration-300",
              "rounded-lg shadow-md"
            )}
          >
            Empezar
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
          
          {/* Simple white text link */}
          <button 
            onClick={onLogin} 
            className="text-white text-base hover:underline transition-all duration-300"
          >
            Si ya tienes una cuenta, inicia sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
