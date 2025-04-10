
import React from 'react';

interface VettLogoProps {
  className?: string;
  color?: string;
}

const VettLogo: React.FC<VettLogoProps> = ({ className = "", color = "white" }) => {
  return (
    <div className={`flex items-center ${className}`}>
      {/* Dog Icon - Based on provided image */}
      <svg 
        width="60" 
        height="60" 
        viewBox="0 0 60 60" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="mr-4"
      >
        <path 
          d="M37.5 10C37.5 10 45 11.25 48.75 18.75C52.5 26.25 41.25 35 41.25 35C41.25 35 36.25 38.75 27.5 38.75C18.75 38.75 13.75 35 13.75 35C13.75 35 2.5 26.25 6.25 18.75C10 11.25 17.5 10 17.5 10L20 12.5C20 12.5 18.75 15 18.75 17.5C18.75 20 20 22.5 22.5 23.75C25 25 30 25 30 22.5C30 20 35 25 37.5 23.75C40 22.5 41.25 20 41.25 17.5C41.25 15 40 12.5 40 12.5L37.5 10Z" 
          fill={color}
        />
        <circle cx="23.75" cy="20" r="1.75" fill={color === "white" ? "#7ECEC4" : "white"} />
      </svg>
      
      {/* "Vett" Text */}
      <svg 
        width="120" 
        height="60" 
        viewBox="0 0 120 60" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M15 10L28 50H40L53 10H40L33.5 37.5L27 10H15Z" 
          fill={color}
        />
        <path 
          d="M60 10H73C86 10 86 27.5 86 30C86 32.5 86 50 73 50H60V10ZM73 40C77 40 77 32.5 77 30C77 27.5 77 20 73 20H69V40H73Z" 
          fill={color}
        />
        <path 
          d="M90 10H103C116 10 116 27.5 116 30C116 32.5 116 50 103 50H90V10ZM103 40C107 40 107 32.5 107 30C107 27.5 107 20 103 20H99V40H103Z" 
          fill={color}
        />
      </svg>
    </div>
  );
};

export default VettLogo;
