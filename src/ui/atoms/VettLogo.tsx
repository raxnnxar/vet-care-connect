
import React from 'react';

interface VettLogoProps {
  className?: string;
  color?: string;
}

const VettLogo: React.FC<VettLogoProps> = ({ className = "", color = "white" }) => {
  return (
    <div className={`flex items-center ${className}`}>
      {/* Dog Icon */}
      <svg 
        width="40" 
        height="40" 
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="mr-3"
      >
        <path 
          d="M30 6.67C30 6.67 35 7.5 37.5 12.5C40 17.5 32.5 23.33 32.5 23.33C32.5 23.33 29.17 25.83 23.33 25.83C17.5 25.83 14.17 23.33 14.17 23.33C14.17 23.33 6.67 17.5 9.17 12.5C11.67 7.5 16.67 6.67 16.67 6.67L18.33 8.33C18.33 8.33 17.5 10 17.5 11.67C17.5 13.33 18.33 15 20 15.83C21.67 16.67 25 16.67 25 15C25 13.33 28.33 16.67 30 15.83C31.67 15 32.5 13.33 32.5 11.67C32.5 10 31.67 8.33 31.67 8.33L30 6.67Z" 
          fill={color}
        />
        <circle cx="19.17" cy="13.33" r="1.17" fill={color === "white" ? "#7ECEC4" : "white"} />
      </svg>
      
      {/* "VETT" Text */}
      <svg 
        width="80" 
        height="32" 
        viewBox="0 0 80 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M10 5.33L18.67 26.67H23.33L32 5.33H23.33L20.67 18.33L18 5.33H10Z" 
          fill={color}
        />
        <path 
          d="M35.33 5.33H46.67C55.33 5.33 55.33 14.67 55.33 16C55.33 17.33 55.33 26.67 46.67 26.67H35.33V5.33ZM46.67 21.33C48.67 21.33 48.67 17.33 48.67 16C48.67 14.67 48.67 10.67 46.67 10.67H42V21.33H46.67Z" 
          fill={color}
        />
        <path 
          d="M60 5.33H71.33C80 5.33 80 14.67 80 16C80 17.33 80 26.67 71.33 26.67H60V5.33ZM71.33 21.33C73.33 21.33 73.33 17.33 73.33 16C73.33 14.67 73.33 10.67 71.33 10.67H66.67V21.33H71.33Z" 
          fill={color}
        />
      </svg>
    </div>
  );
};

export default VettLogo;
