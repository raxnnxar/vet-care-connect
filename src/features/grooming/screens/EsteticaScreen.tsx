import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarInferior from '@/frontend/navigation/components/NavbarInferior';
import SaludHeader from '@/features/health/components/SaludHeader';
import PetSelector from '@/features/health/components/PetSelector';
import PrimaryGrooming from '../components/PrimaryGrooming';
import GroomingTabs from '../components/GroomingTabs';
import { useGroomingData } from '../hooks/useGroomingData';
import { usePrimaryGroomingData } from '../hooks/usePrimaryGroomingData';
import { usePrimaryGrooming } from '../hooks/usePrimaryGrooming';
import LoadingSpinner from '@/frontend/ui/components/LoadingSpinner';
import { Alert, AlertTitle, AlertDescription } from '@/ui/molecules/alert';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/ui/atoms/button';
const EsteticaScreen = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('esteticas');
  const [selectedPetId, setSelectedPetId] = useState<string | undefined>(undefined);
  const {
    groomingBusinesses,
    loading: loadingGrooming,
    error: groomingError
  } = useGroomingData();
  const {
    primaryGrooming,
    loading: loadingPrimary,
    error: primaryError
  } = usePrimaryGroomingData(selectedPetId);
  const {
    setAsPrimary
  } = usePrimaryGrooming();
  const handleBackClick = () => {
    navigate('/owner');
  };
  const handleScheduleClick = (groomingId: string) => {
    console.log(`Schedule appointment with grooming ${groomingId}`);
    // TODO: Navigate to appointment booking screen for grooming
    navigate(`/owner/appointments/book-grooming/${groomingId}`);
  };
  const handleGroomingClick = (groomingId: string) => {
    console.log(`Navigate to grooming details ${groomingId}`);
    // TODO: Navigate to grooming detail screen
    navigate(`/owner/grooming/${groomingId}`);
  };
  const handleFindGroomingClick = () => {
    console.log('Focus on grooming search');
    setActiveTab('esteticas');
  };
  const handleRetry = () => {
    window.location.reload();
  };
  const handlePetChange = (petId: string) => {
    setSelectedPetId(petId);
  };
  return <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
      <SaludHeader onBackClick={handleBackClick}>
        <div className="flex items-center justify-between w-full">
          <span className="text-white font-semibold">
        </span>
          <PetSelector selectedPetId={selectedPetId} onPetChange={handlePetChange} />
        </div>
      </SaludHeader>

      <main className="flex-1 px-4 pb-24 pt-5 overflow-auto space-y-6">
        {/* Primary Grooming Section */}
        {primaryError ? <Alert variant="destructive" className="bg-red-50 rounded-md border border-red-200">
            <AlertTitle className="text-red-700 font-medium">Error</AlertTitle>
            <AlertDescription className="text-red-600">
              No se pudo cargar la estética de confianza
            </AlertDescription>
          </Alert> : <PrimaryGrooming grooming={primaryGrooming} onScheduleClick={handleScheduleClick} onFindGroomingClick={handleFindGroomingClick} loading={loadingPrimary} />}
        
        {/* Grooming List Section */}
        {loadingGrooming ? <div className="flex justify-center items-center py-10">
            <LoadingSpinner />
          </div> : groomingError ? <Alert variant="destructive" className="bg-red-50 rounded-md border border-red-200">
            <AlertTitle className="text-red-700 font-medium">{groomingError}</AlertTitle>
            <AlertDescription className="mt-2 flex justify-between items-center">
              <span className="text-red-600">Ocurrió un error al cargar las estéticas.</span>
              <Button variant="outline" size="sm" onClick={handleRetry} className="flex items-center gap-1 border-red-300 text-red-700 hover:bg-red-50">
                <RefreshCw className="h-4 w-4" />
                Reintentar
              </Button>
            </AlertDescription>
          </Alert> : <GroomingTabs activeTab={activeTab} onTabChange={setActiveTab} groomingBusinesses={groomingBusinesses} onGroomingClick={handleGroomingClick} />}
      </main>
      
      <NavbarInferior activeTab="home" />
    </div>;
};
export default EsteticaScreen;