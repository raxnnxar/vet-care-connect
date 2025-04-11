
import React from 'react';

interface VettLogoProps {
  className?: string;
  color?: string;
}

export const VettLogo: React.FC<VettLogoProps> = ({ className = "", color = "#84D3C5" }) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative h-20 w-20 mb-4">
        <img 
          src="/lovable-uploads/cde03fa6-037a-4fbd-a017-5846edb8f19f.png" 
          alt="Vett Logo" 
          className="h-full w-full object-contain"
          style={{ 
            filter: 'brightness(0) invert(1)', 
            mixBlendMode: 'overlay',
            transform: 'scale(1.15)'
          }}
        />
      </div>
      <span className="text-4xl font-bold tracking-wide" style={{color: color}}>Vett</span>
    </div>
  );
};

export default VettLogo;
