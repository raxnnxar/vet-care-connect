
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import { ROUTES } from '@/frontend/shared/constants/routes';
import { VeterinarianProfile } from '../types/veterinarianTypes';
import VetProfileForm from '../components/vet/VetProfileForm';
import VetProfileLoading from '../components/vet/VetProfileLoading';
import { useVetProfileData } from '../hooks/useVetProfileData';
import { updateVeterinarianProfile } from '../services/vetProfileService';

const VetProfileSetupScreen = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  
  const userId = user?.id || '';
  const { initialData, isInitialDataLoading, defaultVetProfile } = useVetProfileData(userId);

  const handleSubmit = async (profileData: VeterinarianProfile) => {
    if (!userId) {
      toast.error('No se pudo identificar al usuario. Vuelve a iniciar sesión.');
      return;
    }

    setIsLoading(true);

    try {
      await updateVeterinarianProfile(userId, profileData);
      toast.success('Perfil actualizado con éxito');
      navigate(ROUTES.VET);
    } catch (error: any) {
      toast.error(`Error al actualizar el perfil: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitialDataLoading) {
    return <VetProfileLoading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#79D0B8] to-[#5FBFB3] py-8 px-4">
      <div className="container mx-auto max-w-3xl px-0">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Configura tu perfil profesional</h1>
          <p className="text-white/80 mt-2">
            Completa tu información para que los dueños de mascotas puedan encontrarte
          </p>
        </div>

        <VetProfileForm 
          initialData={initialData || defaultVetProfile}
          onSubmit={handleSubmit}
          isSubmitting={isLoading}
          userId={userId}
        />
      </div>
    </div>
  );
};

export default VetProfileSetupScreen;
