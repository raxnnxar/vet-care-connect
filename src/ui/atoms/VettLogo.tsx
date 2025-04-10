import React from 'react';

interface VettLogoProps {
  className?: string;
  color?: string;
}

const VettLogo: React.FC<VettLogoProps> = ({ className = "", color = "white" }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <svg 
        width="60" 
        height="60" 
        viewBox="0 0 1320 1000" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="mr-3"
      >
        <path 
          d="M212.070648,517.831299 
          C214.114563,507.475433 215.537659,497.375427 218.261078,487.639130 
          C223.295120,469.642487 234.308243,456.109436 250.961594,447.357269 
          C253.380524,446.085968 255.552429,444.920563 257.687469,448.275055 
          C272.592865,471.693665 285.983551,495.786682 291.365295,523.434326 
          C292.344238,528.463562 292.527588,533.666443 292.821655,538.803894 
          C293.037903,542.582031 291.096069,544.924194 287.408630,546.160339 
          C261.198914,554.947144 229.576401,544.849182 213.381577,522.340271 
          C212.582443,521.229614 212.469116,519.625610 212.070648,517.831299 
          z" 
          fill={color}
        />
        
        <path 
          d="M345.509644,558.989441 
          C375.753601,550.237183 397.128448,533.326355 400.498352,499.619812 
          C401.319885,491.403015 396.291077,485.384796 388.028656,485.107910 
          C380.885681,484.868500 373.689575,484.829987 366.629669,483.872009 
          C359.078888,482.847473 350.864380,481.772247 347.257294,473.616669" 
          fill={color}
        />
        
        <path 
          d="M328.985931,421.697174 
          C325.929779,420.399292 322.962708,418.795410 319.796997,417.873779 
          C314.791992,416.416748 309.830658,418.550690 307.775055,422.567566 
          C305.592712,426.832092 306.890930,431.072723 311.682800,434.641174" 
          fill={color}
        />
      </svg>
      
      <span className="text-4xl font-bold" style={{color: color}}>Vett</span>
    </div>
  );
};

export default VettLogo;
