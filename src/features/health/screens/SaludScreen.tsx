
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarInferior from '@/frontend/navigation/components/NavbarInferior';
import SaludHeader from '../components/SaludHeader';
import PrimaryVet from '../components/PrimaryVet';
import VetTabs from '../components/VetTabs';
import PetSelector from '../components/PetSelector';
import { useVeterinariansData } from '../hooks/useVeterinariansData';
import { usePrimaryVetData } from '../hooks/usePrimaryVetData';
import LoadingSpinner from '@/frontend/ui/components/LoadingSpinner';
import { Alert, AlertTitle, AlertDescription } from '@/ui/molecules/alert';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/ui/atoms/button';

const SaludScreen = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('veterinarios');
  const [selectedPetId, setSelectedPetId] = useState<string | undefined>(undefined);
  const { vets, loading: loadingVets, error: vetsError } = useVeterinariansData();
  const { primaryVet, loading: loadingPrimaryVet, error: primaryVetError } = usePrimaryVetData(selectedPetId);
  
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

  const handleFindVetsClick = () => {
    console.log('Navigate to find vets screen');
    navigate('/owner/find-vets');
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const handlePetChange = (petId: string) => {
    setSelectedPetId(petId);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
      <SaludHeader onBackClick={handleBackClick}>
        <div className="ml-auto">
          <PetSelector 
            selectedPetId={selectedPetId} 
            onPetChange={handlePetChange}
          />
        </div>
      </SaludHeader>

      <main className="flex-1 px-4 pb-24 pt-5 overflow-auto space-y-6">
        {/* Primary Vet Section */}
        {primaryVetError ? (
          <Alert variant="destructive" className="bg-red-50 rounded-md border border-red-200">
            <AlertTitle className="text-red-700 font-medium">Error</AlertTitle>
            <AlertDescription className="text-red-600">
              No se pudo cargar el veterinario de cabecera
            </AlertDescription>
          </Alert>
        ) : (
          <PrimaryVet 
            vet={primaryVet} 
            onScheduleClick={handleScheduleClick}
            onFindVetsClick={handleFindVetsClick}
            loading={loadingPrimaryVet}
          />
        )}
        
        {/* Vets List Section */}
        {loadingVets ? (
          <div className="flex justify-center items-center py-10">
            <LoadingSpinner />
          </div>
        ) : vetsError ? (
          <Alert variant="destructive" className="bg-red-50 rounded-md border border-red-200">
            <AlertTitle className="text-red-700 font-medium">{vetsError}</AlertTitle>
            <AlertDescription className="mt-2 flex justify-between items-center">
              <span className="text-red-600">Ocurrió un error al cargar los veterinarios.</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRetry}
                className="flex items-center gap-1 border-red-300 text-red-700 hover:bg-red-50"
              >
                <RefreshCw className="h-4 w-4" />
                Reintentar
              </Button>
            </AlertDescription>
          </Alert>
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
