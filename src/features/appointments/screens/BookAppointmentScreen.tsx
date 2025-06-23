
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { Button } from '@/ui/atoms/button';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import PetSelectionStep from '@/features/pets/components/PetSelectionStep';
import DateTimeSelector from '@/features/appointments/components/booking/DateTimeSelector';
import StepsIndicator from '@/features/appointments/components/booking/StepsIndicator';
import VeterinarianCard from '@/features/appointments/components/booking/VeterinarianCard';
import ServiceSelectionStep from '@/features/appointments/components/booking/ServiceSelectionStep';
import ServiceSizeSelectionStep from '@/features/appointments/components/booking/ServiceSizeSelectionStep';
import ConfirmationStep from '@/features/appointments/components/booking/ConfirmationStep';
import NavigationButtons from '@/features/appointments/components/booking/NavigationButtons';
import { useCreateAppointment } from '@/features/appointments/hooks/useCreateAppointment';
import { Pet } from '@/features/pets/types';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';

const BookAppointmentScreen: React.FC = () => {
  const { vetId } = useParams<{ vetId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [provider, setProvider] = useState<any>(null);
  const [providerType, setProviderType] = useState<'vet' | 'grooming' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedServiceSize, setSelectedServiceSize] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);
  const { createAppointment, isLoading: isCreatingAppointment } = useCreateAppointment();

  useEffect(() => {
    const fetchProviderDetails = async () => {
      try {
        setIsLoading(true);
        
        // Get the type from search params
        const typeParam = searchParams.get('type');
        console.log('Type from URL params:', typeParam);
        
        if (typeParam === 'grooming') {
          // Fetch from pet_grooming table
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
            console.log('Successfully fetched grooming provider:', groomingData);
          } else {
            throw new Error('Grooming provider not found');
          }
        } else {
          // Try to fetch from veterinarians table (default behavior)
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
            console.log('Successfully fetched vet provider:', vetData);
          } else {
            throw new Error('Veterinarian not found');
          }
        }
      } catch (error) {
        console.error('Error fetching provider details:', error);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (vetId) {
      fetchProviderDetails();
    }
  }, [vetId, searchParams]);

  const goBack = () => {
    navigate(-1);
  };

  const handleServiceSelect = (service: any) => {
    setSelectedService(service);
    setCurrentStep(currentStep + 1);
  };

  const handleContinue = async () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Create appointment in database
      if (selectedPet && selectedService && selectedDate && selectedTime && vetId && user?.id) {
        // Prepare service data - now we handle expanded services differently
        let serviceData;
        if (selectedService.isExpandedSize) {
          // Service with size selection
          serviceData = {
            id: selectedService.id,
            nombre: selectedService.name,
            tipo: selectedService.sizeType,
            precio: selectedService.price,
            description: selectedService.description
          };
        } else {
          // Regular service without sizes
          serviceData = {
            id: selectedService.id,
            name: selectedService.name,
            price: selectedService.price,
            description: selectedService.description
          };
        }

        const appointmentData = {
          petId: selectedPet.id,
          providerId: vetId,
          appointmentDate: {
            date: selectedDate.toISOString().split('T')[0],
            time: selectedTime
          },
          serviceType: serviceData,
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
            onServiceSelect={handleServiceSelect}
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

  // Determine if we can continue based on current step and selections
  const canContinue = () => {
    switch (currentStep) {
      case 1:
        return !!selectedPet;
      case 2:
        return !!selectedService;
      case 3:
        return !!selectedDate && !!selectedTime;
      case 4:
        return !!selectedPet && !!selectedService && !!selectedDate && !!selectedTime;
      default:
        return false;
    }
  };

  // Check if we should show navigation buttons
  const shouldShowNavigationButtons = () => {
    // Don't show on step 3 (DateTimeSelector has its own buttons)
    return currentStep !== 3;
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
      <div className="flex flex-col h-full bg-gray-50">
        <div className="p-4">
          <StepsIndicator currentStep={currentStep} totalSteps={4} />
        </div>
        
        <div className="flex-1 flex flex-col min-h-0 px-4">
          <VeterinarianCard 
            veterinarian={provider}
            isLoading={isLoading}
            currentStep={currentStep}
            providerType={providerType}
          >
            <div className="flex-1 min-h-0">
              {renderStepContent()}
            </div>
          </VeterinarianCard>
        </div>
        
        {shouldShowNavigationButtons() && (
          <div className="p-4 border-t bg-white">
            <NavigationButtons
              currentStep={currentStep}
              selectedPet={selectedPet}
              selectedService={selectedService}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onGoBack={handleGoBack}
              onContinue={handleContinue}
              isLoading={isCreatingAppointment}
              canContinue={canContinue()}
            />
          </div>
        )}
      </div>
    </LayoutBase>
  );
};

export default BookAppointmentScreen;
