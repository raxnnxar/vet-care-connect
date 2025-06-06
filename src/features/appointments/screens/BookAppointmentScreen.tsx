
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
import { useCreateAppointment } from '@/features/appointments/hooks/useCreateAppointment';
import { Pet } from '@/features/pets/types';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';

const BookAppointmentScreen: React.FC = () => {
  const { vetId } = useParams<{ vetId: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [provider, setProvider] = useState<any>(null);
  const [providerType, setProviderType] = useState<'vet' | 'grooming' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);
  const { createAppointment, isLoading: isCreatingAppointment } = useCreateAppointment();

  useEffect(() => {
    const fetchProviderDetails = async () => {
      try {
        setIsLoading(true);
        
        // First try to fetch from veterinarians table
        const { data: vetData, error: vetError } = await supabase
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

        if (vetData && !vetError) {
          setProvider(vetData);
          setProviderType('vet');
        } else {
          // If not found in veterinarians, try pet_grooming
          const { data: groomingData, error: groomingError } = await supabase
            .from('pet_grooming')
            .select(`
              id,
              business_name,
              services_offered,
              availability
            `)
            .eq('id', vetId)
            .maybeSingle();

          if (groomingData && !groomingError) {
            setProvider(groomingData);
            setProviderType('grooming');
          } else {
            throw new Error('Provider not found');
          }
        }
      } catch (error) {
        console.error('Error fetching provider details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (vetId) {
      fetchProviderDetails();
    }
  }, [vetId]);

  const goBack = () => {
    navigate(-1);
  };

  const handleContinue = async () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Create appointment in database
      if (selectedPet && selectedService && selectedDate && selectedTime && vetId && user?.id) {
        const appointmentData = {
          petId: selectedPet.id,
          providerId: vetId,
          appointmentDate: {
            date: selectedDate.toISOString().split('T')[0],
            time: selectedTime
          },
          serviceType: {
            id: selectedService.id,
            name: selectedService.name || selectedService.nombre,
            price: selectedService.price || selectedService.precio,
            description: selectedService.description
          },
          ownerId: user.id,
          providerType: providerType
        };

        console.log('Attempting to create appointment:', appointmentData);

        const result = await createAppointment(appointmentData);
        
        if (result) {
          navigate('/owner/appointments');
        }
      }
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
            veterinarian={provider}
            selectedService={selectedService}
            onServiceSelect={setSelectedService}
            providerType={providerType}
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
            providerId={vetId}
            providerType={providerType}
          />
        );
      case 4:
        return (
          <ConfirmationStep
            selectedPet={selectedPet}
            selectedService={selectedService}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            veterinarian={provider}
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
          veterinarian={provider}
          isLoading={isLoading}
          currentStep={currentStep}
          providerType={providerType}
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
            isLoading={isCreatingAppointment}
          />
        )}
      </div>
    </LayoutBase>
  );
};

export default BookAppointmentScreen;
