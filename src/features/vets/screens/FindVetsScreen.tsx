
import React, { useState } from 'react';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { SearchIcon, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/ui/atoms/button';
import { Input } from '@/ui/atoms/input';
import VeterinariansMap from '@/features/home/components/VeterinariansMap';

const FindVetsScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchTerm);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <LayoutBase
      header={
        <div className="flex items-center justify-between p-4 bg-[#79D0B8]">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              className="text-white p-1 mr-2" 
              onClick={handleGoBack}
            >
              <ArrowLeft size={24} />
            </Button>
            <h1 className="text-xl font-medium text-white">Todo para tu mascota cerca de ti</h1>
          </div>
        </div>
      }
      footer={<NavbarInferior activeTab="home" />}
    >
      <div className="p-4 pb-20">
        {/* Mapa de veterinarios - movido desde OwnerHomeScreen */}
        <div className="mb-6">
          <VeterinariansMap />
        </div>

        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="search"
              placeholder="Buscar por nombre o especialidad"
              className="pl-10 pr-4 py-3 w-full rounded-full border border-gray-300 focus:border-[#79D0B8] focus:ring-[#79D0B8]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </form>

        {/* Placeholder for search results */}
        <div className="space-y-4">
          <p className="text-gray-500 text-center my-8">Busca veterinarios cercanos para agendar una cita</p>
        </div>
      </div>
    </LayoutBase>
  );
};

export default FindVetsScreen;
