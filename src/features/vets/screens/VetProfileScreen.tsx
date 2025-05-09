
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { useVetProfileData } from '@/features/auth/hooks/useVetProfileData';
import VetProfileForm from '@/features/auth/components/vet/VetProfileForm';
import { updateVeterinarianProfile } from '@/features/auth/services/vetProfileService';
import { VeterinarianProfile } from '@/features/auth/types/veterinarianTypes';
import VetProfileHeader from '../components/profile/VetProfileHeader';
import VetProfileLoading from '@/features/auth/components/vet/VetProfileLoading';
import { toast } from 'sonner';

const VetProfileScreen: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = React.useState(false);
  const userId = user?.id || '';
  
  const { initialData, isInitialDataLoading, defaultVetProfile } = useVetProfileData(userId);

  React.useEffect(() => {
    // Log to debug navigation issues
    console.log('VetProfileScreen mounted. User ID:', userId);
  }, [userId]);

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
        header={<VetProfileHeader />}
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
