
import React, { useState } from 'react';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { SearchIcon, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/ui/atoms/button';
import { Input } from '@/ui/atoms/input';
import SaludHeader from '../components/SaludHeader';
import PetSelector from '../components/PetSelector';
import VetTabs from '../components/VetTabs';
import VeterinariansTab from '../components/VeterinariansTab';
import HospitalesTab from '../components/HospitalesTab';

const SaludScreen = () => {
  const [activeTab, setActiveTab] = useState('veterinarios');
  const navigate = useNavigate();

  const handleSearchClick = () => {
    navigate('/owner/search-vets');
  };

  return (
    <LayoutBase
      header={<SaludHeader />}
      footer={<NavbarInferior activeTab="salud" />}
    >
      <div className="p-4 pb-20">
        <PetSelector />
        
        {/* Search Bar - Now Pressable */}
        <div className="mb-6" onClick={handleSearchClick}>
          <div className="relative flex gap-2 cursor-pointer">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="search"
                placeholder="Buscar por nombre o especialidad..."
                className="pl-10 pr-4 py-3 w-full rounded-full border border-gray-300 focus:border-[#79D0B8] focus:ring-[#79D0B8] cursor-pointer"
                value=""
                readOnly
                onClick={handleSearchClick}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              className="px-4 py-3 rounded-full border border-gray-300"
              onClick={handleSearchClick}
            >
              <Filter size={20} />
            </Button>
          </div>
        </div>

        <VetTabs activeTab={activeTab} onTabChange={setActiveTab} />
        
        {activeTab === 'veterinarios' && <VeterinariansTab />}
        {activeTab === 'hospitales' && <HospitalesTab />}
      </div>
    </LayoutBase>
  );
};

export default SaludScreen;
