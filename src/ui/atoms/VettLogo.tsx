
import React from 'react';

interface VettLogoProps {
  className?: string;
  color?: string;
}

const VettLogo: React.FC<VettLogoProps> = ({ className = "", color = "white" }) => {
  return (
    <svg 
      className={className}
      width="100%" 
      height="100%" 
      viewBox="0 0 240 80" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Dog Icon - simplified version of the provided image */}
      <path 
        d="M46 15C39.5 17 36.5 22.5 36 26C35.5 29.5 33.5 33 29 37C24.5 41 21.5 46.5 24 54C26.5 61.5 34 65 42 65C50 65 57.5 61.5 60 54C62.5 46.5 59.5 41 55 37C50.5 33 48.5 29.5 48 26C47.5 22.5 44.5 17 38 15C37.5 14.9 36.5 14.9 36 15"
        fill={color}
        stroke={color}
        strokeWidth="1"
      />
      <circle cx="41" cy="35" r="2.5" fill={color === "white" ? "#7ECEC4" : "white"} />

      {/* "Vett" Text with more rounded, friendly font style */}
      <path 
        d="M80 30L90 60H100L110 30H100L95 50L90 30H80Z" 
        fill={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path 
        d="M120 30C115 30 112 33 112 38V52C112 57 115 60 120 60C125 60 128 57 128 52V48H121V52C121 53 120.5 54 120 54C119.5 54 119 53 119 52V38C119 37 119.5 36 120 36C120.5 36 121 37 121 38V40H128V38C128 33 125 30 120 30Z" 
        fill={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path 
        d="M140 30C135 30 132 33 132 38V52C132 57 135 60 140 60C145 60 148 57 148 52V48H141V52C141 53 140.5 54 140 54C139.5 54 139 53 139 52V38C139 37 139.5 36 140 36C140.5 36 141 37 141 38V40H148V38C148 33 145 30 140 30Z" 
        fill={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path 
        d="M160 30C155 30 152 33 152 38V52C152 57 155 60 160 60C165 60 168 57 168 52V48H161V52C161 53 160.5 54 160 54C159.5 54 159 53 159 52V38C159 37 159.5 36 160 36C160.5 36 161 37 161 38V40H168V38C168 33 165 30 160 30Z" 
        fill={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default VettLogo;
