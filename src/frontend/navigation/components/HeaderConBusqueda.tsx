
import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface HeaderConBusquedaProps {
  title?: string;
  onSearch?: (query: string) => void;
}

const HeaderConBusqueda: React.FC<HeaderConBusquedaProps> = ({ 
  title = 'Find Vets',
  onSearch
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <div className="px-4 py-3">
      {title && <h1 className="text-xl font-semibold mb-3">{title}</h1>}
      
      <form onSubmit={handleSubmit} className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          className="pl-10 pr-4 py-2 w-full bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Search veterinarians, specialties..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>
    </div>
  );
};

export default HeaderConBusqueda;
