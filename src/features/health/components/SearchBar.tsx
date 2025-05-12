
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/ui/atoms/input';
import { Toggle } from '@/ui/atoms/toggle';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="relative mb-5">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <Search className="w-4 h-4" />
      </div>
      <Input
        type="text"
        placeholder="Buscar por nombre o especialidad..."
        value={searchQuery}
        onChange={onSearchChange}
        className="pl-10 pr-10 py-3 rounded-xl border border-gray-200 shadow-sm bg-white focus:ring-2 focus:ring-[#79D0B8]/30 focus:border-[#79D0B8]"
      />
      <Toggle className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-1.5 hover:bg-[#79D0B8]/10 rounded-lg">
        <Filter className="text-gray-500 w-full h-full" />
      </Toggle>
    </div>
  );
};

export default SearchBar;
