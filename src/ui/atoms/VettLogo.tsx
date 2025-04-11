
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
  
  return (
    <div className={`flex items-center justify-center ${className}`}>
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
