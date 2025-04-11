
import React from 'react';

interface VettLogoProps {
  className?: string;
  color?: string;
}

export const VettLogo: React.FC<VettLogoProps> = ({ className = "", color = "#84D3C5" }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative h-12 w-12 mr-3">
        <img 
          src="/lovable-uploads/cde03fa6-037a-4fbd-a017-5846edb8f19f.png" 
          alt="Vett Logo" 
          className="h-full w-full object-contain"
          style={{ 
            filter: 'brightness(0) invert(1)', // This converts the image to white silhouette
            mixBlendMode: 'overlay' // This helps blend with the background
          }}
        />
      </div>
      <span className="text-4xl font-bold" style={{color: color}}>Vett</span>
    </div>
  );
};

export default VettLogo;
