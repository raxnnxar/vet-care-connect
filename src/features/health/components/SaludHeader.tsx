
import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface SaludHeaderProps {
  onBackClick: () => void;
  children?: React.ReactNode;
}

const SaludHeader: React.FC<SaludHeaderProps> = ({ onBackClick, children }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-[#79D0B8] text-white shadow-sm">
      <div className="flex items-center">
        <button 
          onClick={onBackClick}
          className="p-1 mr-3 rounded-full hover:bg-[#5FBFB3] transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold">Salud</h1>
      </div>
      {children}
    </div>
  );
};

export default SaludHeader;
