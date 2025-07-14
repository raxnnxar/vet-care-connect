import React from 'react';
import { ChevronLeft } from 'lucide-react';
interface SaludHeaderProps {
  onBackClick: () => void;
  children?: React.ReactNode;
}
const SaludHeader: React.FC<SaludHeaderProps> = ({
  onBackClick,
  children
}) => {
  return <div className="vett-header flex items-center justify-between shadow-sm">
      <div className="flex items-center">
        <button onClick={onBackClick} className="p-1 mr-3 rounded-full hover:bg-[#5FBFB3] transition-colors" aria-label="Volver">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-medium">Estética</h1>
      </div>
      <div className="ml-auto">
        {children}
      </div>
    </div>;
};
export default SaludHeader;