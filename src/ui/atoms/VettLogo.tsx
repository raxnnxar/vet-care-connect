import React from 'react';

interface VettLogoProps {
  className?: string;
  color?: string;
}

const VettLogo: React.FC<VettLogoProps> = ({ className = "", color = "white" }) => {
  return (
    <div className={`flex items-center ${className}`}>
      {/* Dog Icon - Exact match from your image */}
      <svg 
        width="60" 
        height="60" 
        viewBox="0 0 200 200" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="mr-4"
      >
        <path 
          d="M140.8 40.5c-8.2-2.3-16.8 1.1-21.3 8.4-4.5-7.3-13.1-10.7-21.3-8.4-11.5 3.2-18.1 15.2-14.9 26.7 2.6 9.3 17.1 25.9 36.2 41.3 19.1-15.4 33.6-32 36.2-41.3 3.2-11.5-3.4-23.5-14.9-26.7z" 
          fill={color}
        />
        <path 
          d="M100 60c-22.1 0-40 17.9-40 40s17.9 40 40 40 40-17.9 40-40-17.9-40-40-40zm0 70c-16.5 0-30-13.5-30-30s13.5-30 30-30 30 13.5 30 30-13.5 30-30 30z" 
          fill={color}
        />
        <circle cx="85" cy="85" r="5" fill={color === "white" ? "#7ECEC4" : "white"} />
      </svg>
      
      {/* "Vett" Text */}
      <svg 
        width="140" 
        height="80" 
        viewBox="0 0 280 160" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M30 40L70 120H90L130 40H90L80 80L70 40H30Z" 
          fill={color}
        />
        <path 
          d="M140 40h50c30 0 30 30 30 35c0 5 0 35-30 35h-50V40zm50 50c7 0 7-15 7-20s0-20-7-20h-20v40h20z" 
          fill={color}
        />
        <path 
          d="M230 40h50c30 0 30 30 30 35c0 5 0 35-30 35h-50V40zm50 50c7 0 7-15 7-20s0-20-7-20h-20v40h20z" 
          fill={color}
        />
      </svg>
    </div>
  );
};

export default VettLogo;
