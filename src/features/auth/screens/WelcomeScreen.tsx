
import React, { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/ui/atoms/button';
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
    <div className="relative min-h-screen overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-100 to-primary-300 z-0"></div>
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5 z-0">
        <div className="h-full w-full bg-[radial-gradient(circle,_#ffffff_1px,_transparent_1px)] bg-[length:20px_20px]"></div>
      </div>

      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md gap-10">
          {/* Logo - significantly larger (at least 40% of screen width) */}
          <div 
            className="w-[60%] sm:w-[50%] lg:w-[40%] animate-on-mount transition-all duration-500 opacity-0 translate-y-4"
            style={{ transformOrigin: 'center' }}
          >
            <img 
              src="/lovable-uploads/915815b7-5193-4544-9de0-cab182d80456.png" 
              alt="Vett Logo" 
              className="w-full h-auto"
            />
          </div>
          
          {/* Tagline with improved typography */}
          <p 
            className="text-center text-gray-800 font-medium text-lg md:text-xl leading-relaxed max-w-sm animate-on-mount transition-all duration-500 opacity-0 translate-y-4"
            style={{ transitionDelay: '200ms' }}
          >
            Conectando dueños de mascotas con atención veterinaria
          </p>
          
          {/* Buttons container with animation */}
          <div 
            className="flex flex-col items-center gap-8 w-full mt-6 animate-on-mount transition-all duration-500 opacity-0 translate-y-4"
            style={{ transitionDelay: '300ms' }}
          >
            {/* More prominent Empezar button with shadow and arrow */}
            <Button 
              onClick={onGetStarted} 
              className={cn(
                "w-full py-7 text-lg font-medium flex items-center justify-center gap-3",
                "bg-white text-primary-600 hover:bg-gray-50",
                "shadow-lg hover:shadow-xl transition-all duration-300",
                "rounded-full"
              )}
            >
              Empezar
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            
            {/* More visible but elegant account link */}
            <button 
              onClick={onLogin} 
              className="text-white text-lg font-medium hover:underline transition-all duration-300 px-4 py-2 rounded-md hover:bg-white/10"
            >
              Ya tengo una cuenta
            </button>
          </div>
        </div>
        
        {/* Footer space/padding for mobile */}
        <div className="h-8"></div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
