
import React from 'react';

interface VettLogoProps {
  className?: string;
  color?: string;
  showText?: boolean;
}

export const VettLogo: React.FC<VettLogoProps> = ({ 
  className = "", 
  color = "#FFFFFF", 
  showText = true 
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/lovable-uploads/b9a82cb0-b95f-426c-ac6c-37aa534c9530.png" 
        alt="Vett Logo" 
        className="h-12 w-auto"
      />
      {showText && (
        <span className="text-5xl font-bold ml-2" style={{color: color}}>Vett</span>
      )}
    </div>
  );
};

export default VettLogo;
