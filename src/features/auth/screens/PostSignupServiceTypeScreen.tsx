
import React, { useState, useEffect } from 'react';
import { Button } from '@/ui/atoms/button';
import { ArrowLeft, Stethoscope, Scissors } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/ui/atoms/radio-group';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { AppDispatch, RootState } from '@/state/store';
import { updateUserServiceType } from '../store/authThunks';
import { SERVICE_TYPES, ServiceTypeType } from './ServiceTypeSelectionScreen';

const PostSignupServiceTypeScreen: React.FC = () => {
  const [selectedServiceType, setSelectedServiceType] = useState<ServiceTypeType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoading: authLoading, error } = useSelector((state: RootState) => state.auth);
  
  // Define color variables to match the role selection screen
  const brandColor = "#79d0b8"; // Teal color for the brand
  const accentColor = "#FF8A65"; // Coral accent for warmth
  
  // Log user data for debugging on component mount
  useEffect(() => {
    console.log("PostSignupServiceTypeScreen - Current auth state:", { user, isLoading: authLoading, error });
  }, [user, authLoading, error]);
  
  const handleBackClick = () => {
    navigate('/post-signup-role');
  };
  
  const handleContinue = async () => {
    if (!selectedServiceType) {
      toast.error('Por favor selecciona un tipo de servicio');
      return;
    }
    
    if (!user || !user.id) {
      console.error("Missing required data:", { selectedServiceType, userId: user?.id });
      toast.error('Datos incompletos para actualizar el tipo de servicio');
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Dispatching updateUserServiceType with:", { 
        userId: user.id, 
        serviceType: selectedServiceType 
      });
      
      // Update the user's service type in the database
      const resultAction = await dispatch(updateUserServiceType({
        userId: user.id,
        serviceType: selectedServiceType
      }));
      
      if (updateUserServiceType.fulfilled.match(resultAction)) {
        console.log("Service type updated successfully:", resultAction.payload);
        toast.success('Tipo de servicio seleccionado con éxito');
        navigate('/vet'); // Navigate to the vet dashboard
      } else if (updateUserServiceType.rejected.match(resultAction)) {
        console.error("Service type update failed:", resultAction.payload);
        toast.error(`Hubo un problema al seleccionar el tipo de servicio: ${resultAction.payload}`);
      }
    } catch (error) {
      console.error('Error updating service type:', error);
      toast.error('Error al actualizar el tipo de servicio');
    } finally {
      setIsLoading(false);
    }
  };

  // Let's debug user data availability
  console.log("Current auth state:", { user, isLoading, error });

  return (
    <div className="relative flex flex-col h-screen overflow-hidden">
      {/* Enhanced gradient background with more depth */}
      <div 
        className="absolute inset-0 w-full h-full z-0" 
        style={{ 
          background: `radial-gradient(circle at 50% 0%, rgba(158, 229, 202, 0.8), ${brandColor} 70%)`,
        }}
      />
      
      {/* Add a subtle pattern overlay for depth */}
      <div 
        className="absolute inset-0 w-full h-full z-0 bg-vett-pattern opacity-10"
        aria-hidden="true"
      />
      
      {/* Header with back button */}
      <div className="flex items-center z-10 pt-8 px-6">
        <button 
          onClick={handleBackClick}
          className="p-3 rounded-full bg-white/30 backdrop-blur-sm transition-all hover:bg-white/40"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
      </div>
      
      {/* Main content with proper spacing */}
      <div className="flex flex-col flex-1 z-10 px-6 py-4">
        {/* Header text with enhanced styling */}
        <div className="text-center mt-6 mb-8 z-10 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <h1 className="text-white text-3xl font-bold mb-3 text-shadow-sm tracking-wide">
            Tipo de servicio
          </h1>
          <div className="w-20 h-1 bg-white/70 mx-auto rounded-full mt-1 mb-4"></div>
          <p className="text-white text-lg opacity-90">
            Selecciona qué tipo de servicio ofreces
          </p>
        </div>
        
        {/* Service type selection with better spacing */}
        <div className="flex flex-col gap-5 items-center w-full max-w-md mx-auto mt-4 z-10 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <RadioGroup 
            value={selectedServiceType || ''} 
            onValueChange={(value) => {
              setSelectedServiceType(value as ServiceTypeType);
              // Add animation effect when selecting a service type
              const targetEl = document.getElementById(`service-${value}`);
              if (targetEl) {
                targetEl.classList.add('scale-105');
                setTimeout(() => {
                  targetEl.classList.remove('scale-105');
                }, 300);
              }
            }}
            className="w-full space-y-5"
          >
            {/* Veterinarian Option */}
            <label 
              id={`service-${SERVICE_TYPES.VETERINARIAN}`}
              className={`relative flex flex-col p-6 rounded-xl transition-all transform duration-300 ${
                selectedServiceType === SERVICE_TYPES.VETERINARIAN 
                  ? 'bg-white shadow-lg border-2 border-accent1' 
                  : 'bg-[#F1F5F9] border border-white/60 hover:bg-[#F8FAFC]'
              }`}
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-lg mr-6 ${
                  selectedServiceType === SERVICE_TYPES.VETERINARIAN 
                    ? 'bg-accent1/15 text-accent1' 
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-800 text-lg">Veterinario</span>
                    <RadioGroupItem 
                      value={SERVICE_TYPES.VETERINARIAN} 
                      id="veterinarian"
                      className={`h-5 w-5 ml-4 ${selectedServiceType === SERVICE_TYPES.VETERINARIAN ? 'border-accent1 text-accent1' : ''}`}
                    />
                  </div>
                </div>
              </div>
            </label>

            {/* Grooming Option */}
            <label 
              id={`service-${SERVICE_TYPES.GROOMING}`}
              className={`relative flex flex-col p-6 rounded-xl transition-all transform duration-300 ${
                selectedServiceType === SERVICE_TYPES.GROOMING 
                  ? 'bg-white shadow-lg border-2 border-accent1' 
                  : 'bg-[#F1F5F9] border border-white/60 hover:bg-[#F8FAFC]'
              }`}
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-lg mr-6 ${
                  selectedServiceType === SERVICE_TYPES.GROOMING 
                    ? 'bg-accent1/15 text-accent1' 
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  <Scissors className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-800 text-lg">Estética canina</span>
                    <RadioGroupItem 
                      value={SERVICE_TYPES.GROOMING} 
                      id="grooming"
                      className={`h-5 w-5 ml-4 ${selectedServiceType === SERVICE_TYPES.GROOMING ? 'border-accent1 text-accent1' : ''}`}
                    />
                  </div>
                </div>
              </div>
            </label>
          </RadioGroup>
        </div>
      </div>
      
      {/* Continue button with proper spacing */}
      <div className="z-10 w-full max-w-xs mx-auto px-6 mb-10 mt-auto animate-fade-up" style={{ animationDelay: '300ms' }}>
        <Button 
          onClick={handleContinue}
          disabled={!selectedServiceType || isLoading}
          className="w-full py-6 rounded-full transition-all group"
          style={{ 
            backgroundColor: selectedServiceType ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
            color: selectedServiceType ? '#1F2937' : 'rgba(0, 0, 0, 0.6)',
            opacity: selectedServiceType ? 1 : 0.85,
            boxShadow: selectedServiceType ? "0 10px 25px -5px rgba(0,0,0,0.12)" : "none",
            fontWeight: selectedServiceType ? 600 : 500,
          }}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            </span>
          ) : (
            <span className={`text-xl ${!selectedServiceType ? 'opacity-70' : ''}`}>
              Continuar
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PostSignupServiceTypeScreen;
