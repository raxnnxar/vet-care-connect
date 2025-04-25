
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
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
        
        navigate(ROUTES.PROFILE_SETUP);
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
          ¿Qué tipo de servicio ofreces?
        </h1>
        
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="space-y-4">
            <div 
              onClick={() => setSelectedType(SERVICE_TYPES.VETERINARIAN)}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedType === SERVICE_TYPES.VETERINARIAN 
                  ? 'border-[#79D0B8] bg-[#F0FFFA]' 
                  : 'border-gray-200 hover:border-[#79D0B8]/50'
              }`}
            >
              <div className="flex items-center">
                <input 
                  type="radio" 
                  checked={selectedType === SERVICE_TYPES.VETERINARIAN}
                  onChange={() => setSelectedType(SERVICE_TYPES.VETERINARIAN)}
                  className="h-4 w-4 text-[#79D0B8]" 
                />
                <div className="ml-3">
                  <span className="font-medium">Veterinario</span>
                  <p className="text-sm text-gray-500">Ofrezco servicios médicos para mascotas</p>
                </div>
              </div>
            </div>
            
            <div 
              onClick={() => setSelectedType(SERVICE_TYPES.GROOMING)}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedType === SERVICE_TYPES.GROOMING 
                  ? 'border-[#79D0B8] bg-[#F0FFFA]' 
                  : 'border-gray-200 hover:border-[#79D0B8]/50'
              }`}
            >
              <div className="flex items-center">
                <input 
                  type="radio" 
                  checked={selectedType === SERVICE_TYPES.GROOMING}
                  onChange={() => setSelectedType(SERVICE_TYPES.GROOMING)}
                  className="h-4 w-4 text-[#79D0B8]" 
                />
                <div className="ml-3">
                  <span className="font-medium">Estilista</span>
                  <p className="text-sm text-gray-500">Ofrezco servicios de peluquería y estética para mascotas</p>
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => selectedType && handleServiceTypeSelection(selectedType)}
            disabled={!selectedType || isLoading}
            className={`w-full py-3 px-4 mt-8 rounded-lg text-white font-medium transition-colors ${
              selectedType && !isLoading
                ? 'bg-[#79D0B8] hover:bg-[#6ABFA9]'
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
