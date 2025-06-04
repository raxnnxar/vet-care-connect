import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Stethoscope, Scissors } from 'lucide-react';
import { AppDispatch, RootState } from '@/state/store';
import { updateServiceType } from '../store/authThunks';
import { SERVICE_TYPES, ServiceTypeType } from '../types/serviceTypes';
import { ROUTES } from '@/frontend/shared/constants/routes';

const PostSignupServiceTypeScreen: React.FC = () => {
  const [selectedType, setSelectedType] = useState<ServiceTypeType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Define the colors
  const brandColor = "#79d0b8"; // Teal color for the brand
  const accentColor = "#FF8A65"; // Coral accent for warmth
  
  const handleServiceTypeSelection = async (serviceType: ServiceTypeType) => {
    if (!serviceType) {
      toast.error('Por favor, selecciona un tipo de servicio para continuar');
      return;
    }
    
    if (!user || !user.id) {
      console.error('Missing user data:', { user });
      toast.error('Información de usuario no disponible. Por favor, inicia sesión de nuevo.');
      navigate('/login');
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Starting updateServiceType with:', { userId: user.id, serviceType });
      
      const result = await dispatch(updateServiceType({ 
        userId: user.id,
        serviceType
      }));
      
      if (updateServiceType.fulfilled.match(result)) {
        console.log('Service type selection successful:', result.payload);
        toast.success('Tipo de servicio seleccionado con éxito');
        
        // Mejorado: Asegurar que la navegación sea correcta según el tipo de servicio
        if (serviceType === SERVICE_TYPES.VETERINARIAN) {
          console.log('Redirecting to VET_PROFILE_SETUP');
          navigate(ROUTES.VET_PROFILE_SETUP);
        } else if (serviceType === SERVICE_TYPES.GROOMING) {
          console.log('Redirecting to GROOMING_PROFILE_SETUP');
          navigate(ROUTES.GROOMING_PROFILE_SETUP);
        } else {
          console.log('Redirecting to PROFILE_SETUP');
          navigate(ROUTES.PROFILE_SETUP);
        }
      } else {
        console.error('Service type selection failed:', result.error);
        toast.error('Hubo un problema al seleccionar el tipo de servicio. Por favor intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error in service type selection:', error);
      toast.error('Error al actualizar el tipo de servicio. Por favor intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

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
      
      {/* Main content - adjusted position */}
      <div className="flex flex-col flex-1 z-10 px-6">
        {/* Header text with improved styling and prominence */}
        <div className="text-center mt-10 mb-6 z-10 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <h1 className="text-white text-3xl font-bold mb-2 text-shadow-sm tracking-wide">
            Selecciona el tipo de servicio que ofreces
          </h1>
          <div className="w-16 h-1 bg-white/70 mx-auto rounded-full mt-1"></div>
        </div>
        
        {/* Service type selection with enhanced visual appeal */}
        <div className="flex flex-col gap-6 items-center w-full max-w-md mx-auto mt-8 z-10 animate-fade-in" style={{ animationDelay: '200ms' }}>
          {/* Veterinario Option with improved text alignment and spacing */}
          <label 
            onClick={() => {
              console.log('Selected service type: veterinarian');
              setSelectedType(SERVICE_TYPES.VETERINARIAN);
              // Add animation effect when selecting a service type
              const targetEl = document.getElementById('service-veterinarian');
              if (targetEl) {
                targetEl.classList.add('scale-105');
                setTimeout(() => {
                  targetEl.classList.remove('scale-105');
                }, 300);
              }
            }}
            id="service-veterinarian"
            className={`relative flex flex-col p-7 rounded-xl transition-all transform duration-300 cursor-pointer ${
              selectedType === SERVICE_TYPES.VETERINARIAN 
                ? 'bg-white shadow-lg border-2 border-accent1' 
                : 'bg-[#F1F5F9] border border-white/60 hover:bg-[#F8FAFC]'
            }`}
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg mr-5 ${
                selectedType === SERVICE_TYPES.VETERINARIAN 
                  ? 'bg-accent1/15 text-accent1' 
                  : 'bg-gray-100 text-gray-500'
              }`}>
                <Stethoscope className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-gray-800 text-lg block">Veterinario</span>
                    <span className="text-sm text-gray-600">Ofrezco servicios médicos y de salud para mascotas</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 ml-4 flex items-center justify-center ${
                    selectedType === SERVICE_TYPES.VETERINARIAN 
                      ? 'border-accent1 bg-accent1' 
                      : 'border-gray-300'
                  }`}>
                    {selectedType === SERVICE_TYPES.VETERINARIAN && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </label>

          {/* Estética Option with improved text alignment and spacing */}
          <label 
            onClick={() => {
              console.log('Selected service type: grooming');
              setSelectedType(SERVICE_TYPES.GROOMING);
              // Add animation effect when selecting a service type
              const targetEl = document.getElementById('service-grooming');
              if (targetEl) {
                targetEl.classList.add('scale-105');
                setTimeout(() => {
                  targetEl.classList.remove('scale-105');
                }, 300);
              }
            }}
            id="service-grooming"
            className={`relative flex flex-col p-7 rounded-xl transition-all transform duration-300 cursor-pointer ${
              selectedType === SERVICE_TYPES.GROOMING 
                ? 'bg-white shadow-lg border-2 border-accent1' 
                : 'bg-[#F1F5F9] border border-white/60 hover:bg-[#F8FAFC]'
            }`}
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg mr-5 ${
                selectedType === SERVICE_TYPES.GROOMING 
                  ? 'bg-accent1/15 text-accent1' 
                  : 'bg-gray-100 text-gray-500'
              }`}>
                <Scissors className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-gray-800 text-lg block">Estética</span>
                    <span className="text-sm text-gray-600">Ofrezco servicios de peluquería, baño y grooming para mascotas</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 ml-4 flex items-center justify-center ${
                    selectedType === SERVICE_TYPES.GROOMING 
                      ? 'border-accent1 bg-accent1' 
                      : 'border-gray-300'
                  }`}>
                    {selectedType === SERVICE_TYPES.GROOMING && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </label>
        </div>
      </div>
      
      {/* Continue button with enhanced styling and positioning */}
      <div className="flex flex-col items-center mt-auto mb-14 z-10 w-full max-w-xs mx-auto px-6 animate-fade-up" style={{ animationDelay: '300ms' }}>
        <button 
          onClick={() => selectedType && handleServiceTypeSelection(selectedType)}
          disabled={!selectedType || isLoading}
          className="w-full py-7 rounded-full transition-all group"
          style={{ 
            backgroundColor: selectedType ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
            color: selectedType ? '#1F2937' : 'rgba(0, 0, 0, 0.6)',
            opacity: selectedType ? 1 : 0.85,
            boxShadow: selectedType ? "0 10px 25px -5px rgba(0,0,0,0.12)" : "none",
            fontWeight: selectedType ? 600 : 500,
          }}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            </span>
          ) : (
            <span className={`text-xl ${!selectedType ? 'opacity-70' : ''}`}>
              Continuar
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default PostSignupServiceTypeScreen;
