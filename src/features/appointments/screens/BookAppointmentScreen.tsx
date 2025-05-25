
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { Button } from '@/ui/atoms/button';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import PetSelectionStep from '@/features/pets/components/PetSelectionStep';
import DateTimeSelector from '@/features/appointments/components/booking/DateTimeSelector';
import StepsIndicator from '@/features/appointments/components/booking/StepsIndicator';
import VeterinarianCard from '@/features/appointments/components/booking/VeterinarianCard';
import ServiceSelectionStep from '@/features/appointments/components/booking/ServiceSelectionStep';
import ConfirmationStep from '@/features/appointments/components/booking/ConfirmationStep';
import NavigationButtons from '@/features/appointments/components/booking/NavigationButtons';
import { Pet } from '@/features/pets/types';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';

const BookAppointmentScreen: React.FC = () => {
  const { vetId } = useParams<{ vetId: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [veterinarian, setVeterinarian] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchVetDetails = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('veterinarians')
          .select(`
            id,
            service_providers (
              business_name,
              profiles (
                display_name
              )
            ),
            services_offered,
            availability
          `)
          .eq('id', vetId)
          .maybeSingle();

        if (error) throw error;
        setVeterinarian(data);
      } catch (error) {
        console.error('Error fetching veterinarian details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (vetId) {
      fetchVetDetails();
    }
  }, [vetId]);

  const goBack = () => {
    navigate(-1);
  };

  const handleContinue = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Here would be API call to book appointment
      navigate(`/owner/appointments`);
    }
  };

  const handleGoBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PetSelectionStep 
            selectedPet={selectedPet} 
            onPetSelect={setSelectedPet}
          />
        );
      case 2:
        return (
          <ServiceSelectionStep
            veterinarian={veterinarian}
            selectedService={selectedService}
            onServiceSelect={setSelectedService}
          />
        );
      case 3:
        return (
          <DateTimeSelector
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onDateSelect={setSelectedDate}
            onTimeSelect={setSelectedTime}
            onContinue={handleContinue}
            onGoBack={handleGoBack}
          />
        );
      case 4:
        return (
          <ConfirmationStep
            selectedPet={selectedPet}
            selectedService={selectedService}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            veterinarian={veterinarian}
          />
        );
      default:
        return null;
    }
  };

  return (
    <LayoutBase
      header={
        <div className="flex items-center px-4 py-3 bg-[#79D0B8]">
          <Button variant="ghost" size="icon" className="text-white" onClick={goBack}>
            <ArrowLeft />
          </Button>
          <h1 className="text-white font-medium text-lg ml-2">Agendar Cita</h1>
        </div>
      }
      footer={<NavbarInferior activeTab="appointments" />}
    >
      <div className="p-4 bg-gray-50 min-h-screen">
        <StepsIndicator currentStep={currentStep} totalSteps={4} />
        
        <VeterinarianCard 
          veterinarian={veterinarian}
          isLoading={isLoading}
          currentStep={currentStep}
        >
          {renderStepContent()}
        </VeterinarianCard>
        
        {/* Only show navigation buttons if not on step 3 */}
        {currentStep !== 3 && (
          <NavigationButtons
            currentStep={currentStep}
            selectedPet={selectedPet}
            selectedService={selectedService}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onGoBack={handleGoBack}
            onContinue={handleContinue}
          />
        )}
      </div>
    </LayoutBase>
  );
};

export default BookAppointmentScreen;
