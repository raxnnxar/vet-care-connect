
import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface SaludHeaderProps {
  onBackClick: () => void;
}

const SaludHeader: React.FC<SaludHeaderProps> = ({ onBackClick }) => {
  return (
    <header className="bg-[#4DA6A8] px-4 py-4 flex items-center shadow-md rounded-b-xl sticky top-0 z-10">
      <button 
        onClick={onBackClick}
        className="absolute left-4 p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <h1 className="text-xl font-semibold text-white w-full text-center">Salud</h1>
    </header>
  );
};

export default SaludHeader;
