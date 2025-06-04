
import React from 'react';
import { Search, User } from 'lucide-react';
import { Input } from '@/ui/atoms/input';

interface GroomingSearchHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const GroomingSearchHeader: React.FC<GroomingSearchHeaderProps> = ({
  searchQuery,
  setSearchQuery
}) => {
  return (
    <div className="bg-[#79D0B8] px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-white text-xl font-bold">Hola, Estética!</h1>
          <p className="text-white/90 text-sm">Gestiona tus citas de hoy</p>
        </div>
        <div className="bg-white/20 p-2 rounded-full">
          <User size={24} className="text-white" />
        </div>
      </div>
      
      <div className="relative">
        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar clientes o mascotas..."
          className="pl-10 bg-white/90 border-0 focus:bg-white transition-colors"
        />
      </div>
    </div>
  );
};

export default GroomingSearchHeader;
