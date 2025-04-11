
import React from 'react';

interface VettLogoProps {
  className?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
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
    xl: "text-6xl"
  };
  
  const iconSizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
    xl: "h-12 w-12"
  };
  
  return (
    <div className={`flex items-center gap-2 ${className} animate-slide-in-top`}>
      <img 
        src="/lovable-uploads/053f0f17-f20a-466e-b7fe-5f6b4edbd41b.png" 
        alt="Vett Logo" 
        className={`${iconSizes[size]}`}
        style={{
          filter: color === "#FFFFFF" ? "brightness(0) invert(1)" : "none"
        }}
      />
      <span 
        className={`font-bold tracking-wider ${sizeClasses[size]}`} 
        style={{color: color}}
      >
        Vett
      </span>
    </div>
  );
};

export default VettLogo;
