
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { RootState } from '@/state/store';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { useVetProfileData } from '@/features/auth/hooks/useVetProfileData';
import VetProfileForm from '@/features/auth/components/vet/VetProfileForm';
import { updateVeterinarianProfile } from '@/features/auth/services/vetProfileService';
import { VeterinarianProfile } from '@/features/auth/types/veterinarianTypes';
import VetProfileHeader from '../components/profile/VetProfileHeader';
import VetProfileLoading from '@/features/auth/components/vet/VetProfileLoading';

const VetProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const userId = user?.id || '';
  
  const { initialData, isInitialDataLoading, defaultVetProfile } = useVetProfileData(userId);

  useEffect(() => {
    if (!user) {
      toast.error('Necesitas iniciar sesión para ver tu perfil');
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSubmit = async (profileData: VeterinarianProfile) => {
    if (!userId) {
      toast.error('No se pudo identificar al usuario. Vuelve a iniciar sesión.');
      return;
    }

    setIsLoading(true);
    try {
      // Make sure we're not passing undefined arrays
      const safeProfileData = {
        ...profileData,
        specializations: Array.isArray(profileData.specializations) ? profileData.specializations : [],
        education: Array.isArray(profileData.education) ? profileData.education : [],
        certifications: Array.isArray(profileData.certifications) ? profileData.certifications : [],
        animals_treated: Array.isArray(profileData.animals_treated) ? profileData.animals_treated : [],
        services_offered: Array.isArray(profileData.services_offered) ? profileData.services_offered : [],
        languages_spoken: Array.isArray(profileData.languages_spoken) ? profileData.languages_spoken : [],
        availability: profileData.availability || {}
      };
      
      await updateVeterinarianProfile(userId, safeProfileData);
      toast.success('Perfil actualizado con éxito');
    } catch (error: any) {
      toast.error(`Error al actualizar el perfil: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitialDataLoading) {
    return (
      <LayoutBase
        header={
          <div className="flex justify-between items-center px-4 py-3 bg-[#79D0B8]">
            <h1 className="text-white font-medium text-lg">Mi Perfil</h1>
          </div>
        }
        footer={<NavbarInferior activeTab="profile" />}
      >
        <VetProfileLoading />
      </LayoutBase>
    );
  }

  // Make sure we have safe initial data 
  const safeData = initialData || defaultVetProfile;

  return (
    <LayoutBase
      header={<VetProfileHeader />}
      footer={<NavbarInferior activeTab="profile" />}
    >
      <div className="pb-24">
        <VetProfileForm 
          initialData={safeData}
          onSubmit={handleSubmit}
          isSubmitting={isLoading}
          userId={userId}
        />
      </div>
    </LayoutBase>
  );
};

export default VetProfileScreen;
