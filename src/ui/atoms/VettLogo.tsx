
import React from 'react';

interface VettLogoProps {
  className?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const VettLogo: React.FC<VettLogoProps> = ({ 
  className = "", 
  color = "#FFFFFF",
  size = "lg" 
}) => {
  const sizeClasses = {
    sm: "text-3xl",
    md: "text-4xl",
    lg: "text-5xl",
    xl: "text-6xl",
    '2xl': "text-7xl"
  };
  
  const iconSizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
    '2xl': "h-20 w-20"
  };
  
  return (
    <div className={`flex items-center gap-3 ${className} animate-slide-in-top`}>
      <img 
        src="/lovable-uploads/053f0f17-f20a-466e-b7fe-5f6b4edbd41b.png" 
        alt="Vett Logo" 
        className={`${iconSizes[size]}`}
        style={{
          filter: color === "#FFFFFF" ? "brightness(0) invert(1)" : "none"
        }}
      />
      <span 
        className={`font-bold tracking-wider ${sizeClasses[size]} font-baloo`} 
        style={{color: color}}
      >
        Vett
      </span>
    </div>
  );
};

export default VettLogo;
