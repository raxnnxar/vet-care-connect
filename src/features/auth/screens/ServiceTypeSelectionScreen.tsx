import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/state/store';
import { authActions } from '../store/authSlice';
import { SERVICE_TYPES, ServiceTypeType } from '../types/serviceTypes';
import { updateServiceType } from '../store/authThunks';
import { ROUTES } from '@/frontend/shared/constants/routes';

const ServiceTypeSelectionScreen: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);

  const handleServiceTypeSelection = async (serviceType: ServiceTypeType) => {
    if (!user?.id) {
      toast.error('Usuario no autenticado');
      return;
    }

    try {
      const result = await dispatch(updateServiceType({ 
        userId: user!.id,
        serviceType
      }));
      
      if (updateServiceType.fulfilled.match(result)) {
        toast.success('Tipo de servicio actualizado con éxito');
        dispatch(authActions.profileUpdateSuccess({
          ...user,
          serviceType: serviceType
        } as any));
        navigate(ROUTES.PROFILE_SETUP);
      } else {
        toast.error((result.payload as string) || 'Error al actualizar el tipo de servicio');
      }
    } catch (error) {
      console.error('Service type update error:', error);
      toast.error('Error al actualizar el tipo de servicio');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Selecciona tu tipo de servicio
        </h1>
        <div className="space-y-4">
          <button
            className="w-full py-3 px-5 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={() => handleServiceTypeSelection(SERVICE_TYPES.VETERINARIAN)}
          >
            Veterinario
          </button>
          <button
            className="w-full py-3 px-5 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            onClick={() => handleServiceTypeSelection(SERVICE_TYPES.GROOMING)}
          >
            Peluquería Canina
          </button>
          <button
            className="w-full py-3 px-5 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
            onClick={() => handleServiceTypeSelection(SERVICE_TYPES.BOARDING)}
          >
            Guardería
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceTypeSelectionScreen;
