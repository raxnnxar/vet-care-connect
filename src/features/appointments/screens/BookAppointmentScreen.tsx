import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { Button } from '@/ui/atoms/button';
import { ArrowLeft, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/ui/molecules/card';
import { Separator } from '@/ui/atoms/separator';
import PetSelectionStep from '@/features/pets/components/PetSelectionStep';
import DateTimeSelector from '@/features/appointments/components/booking/DateTimeSelector';
import { Pet } from '@/features/pets/types';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

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

  const formatPrice = (price?: number) => {
    if (price === undefined) return '';
    
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  // Helper to get veterinarian name
  const getVetName = () => {
    if (!veterinarian) return '';
    
    const displayName = veterinarian.service_providers?.profiles?.display_name 
      || veterinarian.service_providers?.business_name 
      || '';
      
    const firstNameEndsWithA = displayName.split(' ')[0].toLowerCase().endsWith('a');
    return displayName ? `Dr${firstNameEndsWithA ? 'a' : ''}. ${displayName}` : '';
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
        {/* Steps indicator */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex flex-col items-center w-1/4">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 
                    ${currentStep === step 
                      ? 'bg-[#79D0B8] text-white' 
                      : currentStep > step 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-500'}`}
                >
                  {currentStep > step ? <Check size={16} /> : step}
                </div>
                <span className="text-xs text-center">
                  {step === 1 ? 'Mascota' : step === 2 ? 'Servicio' : step === 3 ? 'Fecha y Hora' : 'Confirmar'}
                </span>
              </div>
            ))}
          </div>
          <div className="h-1 bg-gray-200 relative">
            <div 
              className="absolute h-full bg-[#79D0B8] transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <Card className="mb-6">
          <CardContent className="p-4">
            {!isLoading && currentStep !== 3 && (
              <h2 className="text-lg font-medium mb-1">{getVetName()}</h2>
            )}
            {isLoading ? (
              <div className="h-20 flex items-center justify-center">
                <div className="animate-pulse w-full">
                  <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ) : (
              <>
                {currentStep === 1 && (
                  <PetSelectionStep 
                    selectedPet={selectedPet} 
                    onPetSelect={setSelectedPet}
                  />
                )}
                
                {currentStep === 2 && (
                  <>
                    <h3 className="font-medium text-gray-700 mb-4">Selecciona un servicio</h3>
                    <div className="space-y-3">
                      {veterinarian?.services_offered?.map((service: any) => (
                        <div 
                          key={service.id}
                          onClick={() => setSelectedService(service)}
                          className={`p-3 border rounded-lg cursor-pointer transition-all ${
                            selectedService?.id === service.id 
                              ? 'border-[#79D0B8] bg-[#e8f7f3]' 
                              : 'border-gray-200 hover:border-[#79D0B8]'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium">{service.name}</h4>
                              {service.description && (
                                <p className="text-sm text-gray-600 mt-1">
                                  {service.description}
                                </p>
                              )}
                            </div>
                            {service.price !== undefined && (
                              <div className="text-green-600 font-medium whitespace-nowrap ml-2">
                                {formatPrice(service.price)}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {(!veterinarian?.services_offered || veterinarian.services_offered.length === 0) && (
                        <div className="p-4 text-center text-gray-500">
                          No hay servicios disponibles
                        </div>
                      )}
                    </div>
                  </>
                )}
                
                {currentStep === 3 && (
                  <DateTimeSelector
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    onDateSelect={setSelectedDate}
                    onTimeSelect={setSelectedTime}
                    onContinue={handleContinue}
                    onGoBack={handleGoBack}
                  />
                )}
                
                {currentStep === 4 && (
                  <>
                    <h3 className="font-medium text-gray-700 mb-4">Confirma tu cita</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm text-gray-500">Mascota</span>
                        {selectedPet && (
                          <div className="font-medium">{selectedPet.name}</div>
                        )}
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <span className="text-sm text-gray-500">Servicio</span>
                        <div className="font-medium">{selectedService?.name}</div>
                        {selectedService?.price !== undefined && (
                          <div className="text-green-600">{formatPrice(selectedService.price)}</div>
                        )}
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <span className="text-sm text-gray-500">Fecha y hora</span>
                        {selectedDate && (
                          <div className="font-medium">
                            {format(selectedDate, 'EEEE, d MMMM', { locale: es })} - {selectedTime}
                          </div>
                        )}
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <span className="text-sm text-gray-500">Veterinario</span>
                        <div className="font-medium">{getVetName()}</div>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Solo mostrar botones de navegación si no estamos en el paso 3 */}
        {currentStep !== 3 && (
          <div className="flex gap-4">
            {currentStep > 1 && (
              <Button 
                variant="outline"
                className="flex-1"
                onClick={handleGoBack}
              >
                Anterior
              </Button>
            )}
            
            <Button 
              className="flex-1 bg-[#79D0B8] hover:bg-[#5FBFB3]"
              onClick={handleContinue}
              disabled={
                (currentStep === 1 && !selectedPet) || 
                (currentStep === 2 && !selectedService) || 
                (currentStep === 3 && (!selectedDate || !selectedTime))
              }
            >
              {currentStep === 4 ? 'Confirmar Cita' : 'Continuar'}
            </Button>
          </div>
        )}
      </div>
    </LayoutBase>
  );
};

export default BookAppointmentScreen;
