
import React from 'react';
import { Bell, Search } from 'lucide-react';
import VettLogo from '@/ui/atoms/VettLogo';

interface VetSearchHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const VetSearchHeader: React.FC<VetSearchHeaderProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="flex flex-col bg-[#79D0B8] px-4 py-3 space-y-2">
      <div className="flex justify-between items-center">
        <VettLogo color="#FFFFFF" height={36} />
        <button className="text-white hover:bg-white/10 p-2 rounded-full transition-colors">
          <Bell size={24} />
        </button>
      </div>
      
      <div className="relative mb-1">
        <input
          type="text"
          placeholder="Buscar"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 pl-10 bg-white rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5FBFB3] focus:border-transparent"
        />
        <span className="absolute inset-y-0 left-3 flex items-center">
          <Search className="w-5 h-5 text-gray-400" />
        </span>
      </div>
    </div>
  );
};

export default VetSearchHeader;
