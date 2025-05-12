
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarInferior from '@/frontend/navigation/components/NavbarInferior';
import SaludHeader from '../components/SaludHeader';
import PrimaryVet from '../components/PrimaryVet';
import VetTabs from '../components/VetTabs';
import { useVeterinariansData } from '../hooks/useVeterinariansData';
import LoadingSpinner from '@/frontend/ui/components/LoadingSpinner';

// Temporary mock data for primary vet until we implement the functionality
// to select a primary vet
const primaryVet = {
  id: 'primary-vet',
  name: 'Veterinario de Cabecera',
  specialization: 'Selecciona tu veterinario de confianza',
  imageUrl: 'https://randomuser.me/api/portraits/women/10.jpg',
};

const SaludScreen = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('veterinarios');
  const { vets, loading, error } = useVeterinariansData();
  
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

  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
      <SaludHeader onBackClick={handleBackClick} />

      <main className="flex-1 px-4 pb-24 pt-5 overflow-auto space-y-6">
        <PrimaryVet vet={primaryVet} onScheduleClick={handleScheduleClick} />
        
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 rounded-md border border-red-200 text-red-700">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 text-sm underline"
            >
              Reintentar
            </button>
          </div>
        ) : (
          <VetTabs 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            vets={vets}
            onVetClick={handleVetClick}
          />
        )}
      </main>
      
      <NavbarInferior activeTab="home" />
    </div>
  );
};

export default SaludScreen;
