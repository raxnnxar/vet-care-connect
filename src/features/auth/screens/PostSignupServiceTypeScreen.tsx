
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
    <div className="min-h-screen p-4 bg-gradient-to-b from-[#7ECEC4] to-[#79D0B8]">
      <div className="max-w-md mx-auto pt-8">
        <h1 className="text-white text-3xl font-bold text-center mb-8">
          Selecciona el tipo de servicio que ofreces
        </h1>
        
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="space-y-4">
            {/* Veterinario Card */}
            <div 
              onClick={() => setSelectedType(SERVICE_TYPES.VETERINARIAN)}
              className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedType === SERVICE_TYPES.VETERINARIAN 
                  ? 'border-[#79D0B8] bg-[#79D0B8]/5 shadow-md' 
                  : 'border-gray-200 hover:border-[#79D0B8]/30'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-full transition-colors ${
                  selectedType === SERVICE_TYPES.VETERINARIAN 
                    ? 'bg-[#79D0B8] text-white' 
                    : 'bg-gray-100 text-[#79D0B8]'
                }`}>
                  <Stethoscope size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Veterinario
                  </h3>
                  <p className="text-sm text-gray-600">
                    Ofrezco servicios médicos y de salud para mascotas
                  </p>
                </div>
              </div>
              
              {/* Selection indicator */}
              {selectedType === SERVICE_TYPES.VETERINARIAN && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 bg-[#79D0B8] rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Estética Card */}
            <div 
              onClick={() => setSelectedType(SERVICE_TYPES.GROOMING)}
              className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedType === SERVICE_TYPES.GROOMING 
                  ? 'border-[#79D0B8] bg-[#79D0B8]/5 shadow-md' 
                  : 'border-gray-200 hover:border-[#79D0B8]/30'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-full transition-colors ${
                  selectedType === SERVICE_TYPES.GROOMING 
                    ? 'bg-[#79D0B8] text-white' 
                    : 'bg-gray-100 text-[#79D0B8]'
                }`}>
                  <Scissors size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Estética
                  </h3>
                  <p className="text-sm text-gray-600">
                    Ofrezco servicios de peluquería, baño y grooming para mascotas
                  </p>
                </div>
              </div>
              
              {/* Selection indicator */}
              {selectedType === SERVICE_TYPES.GROOMING && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 bg-[#79D0B8] rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={() => selectedType && handleServiceTypeSelection(selectedType)}
            disabled={!selectedType || isLoading}
            className={`w-full py-4 px-6 mt-8 rounded-xl text-white font-semibold text-lg transition-all duration-200 ${
              selectedType && !isLoading
                ? 'bg-[#79D0B8] hover:bg-[#6ABFA9] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando...
              </span>
            ) : (
              'Continuar'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostSignupServiceTypeScreen;
