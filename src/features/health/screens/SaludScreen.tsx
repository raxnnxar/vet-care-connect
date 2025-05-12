
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarInferior from '@/frontend/navigation/components/NavbarInferior';
import SaludHeader from '../components/SaludHeader';
import PrimaryVet from '../components/PrimaryVet';
import VetTabs from '../components/VetTabs';
import { useVeterinariansData, usePrimaryVeterinarian } from '../hooks/useVeterinariansData';
import { useAppSelector } from '@/state/store';

const SaludScreen = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('veterinarios');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get current user ID from Redux state
  const { user } = useAppSelector((state) => state.auth);
  const userId = user?.id || null;
  
  // Use our custom hooks to fetch veterinarian data
  const { veterinarians, isLoading: isLoadingVets } = useVeterinariansData(searchQuery);
  const { primaryVet, isLoading: isLoadingPrimary } = usePrimaryVeterinarian(userId);
  
  const handleBackClick = () => {
    navigate('/owner');
  };

  const handleScheduleClick = (vetId: string) => {
    console.log(`Schedule appointment with vet ${vetId}`);
    navigate(`/owner/appointments/book/${vetId}`);
  };

  const handleVetClick = (vetId: string) => {
    console.log(`Navigate to vet details ${vetId}`);
    navigate(`/owner/vets/${vetId}`);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
      <SaludHeader onBackClick={handleBackClick} />

      <main className="flex-1 px-4 pb-24 pt-5 overflow-auto space-y-6">
        {primaryVet && (
          <PrimaryVet 
            vet={primaryVet} 
            onScheduleClick={() => handleScheduleClick(primaryVet.id)} 
            isLoading={isLoadingPrimary}
          />
        )}
        
        <VetTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          vets={veterinarians}
          onVetClick={handleVetClick}
          onSearch={handleSearchChange}
          searchQuery={searchQuery}
          isLoading={isLoadingVets}
        />
      </main>
      
      <NavbarInferior activeTab="home" />
    </div>
  );
};

export default SaludScreen;
