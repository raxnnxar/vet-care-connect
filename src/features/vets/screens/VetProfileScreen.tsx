
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { useVetProfileData } from '@/features/auth/hooks/useVetProfileData';
import { updateVeterinarianProfile } from '@/features/auth/services/vetProfileService';
import { VeterinarianProfile } from '@/features/auth/types/veterinarianTypes';
import VetProfileHeader from '../components/profile/VetProfileHeader';
import VetProfilePreview from '../components/profile/VetProfilePreview';
import VetProfileLoading from '@/features/auth/components/vet/VetProfileLoading';
import { toast } from 'sonner';

const VetProfileScreen: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const userId = user?.id || '';
  
  const { initialData, isInitialDataLoading, defaultVetProfile } = useVetProfileData(userId);
  const [profileData, setProfileData] = useState<VeterinarianProfile | null>(null);

  // Set profile data once initial data is loaded
  React.useEffect(() => {
    if (initialData) {
      setProfileData(initialData);
    }
  }, [initialData]);

  React.useEffect(() => {
    // Log to debug navigation issues
    console.log('VetProfileScreen mounted. User ID:', userId);
  }, [userId]);

  const handleSaveSection = async (sectionData: Partial<VeterinarianProfile>, sectionName: string) => {
    if (!userId || !profileData) {
      toast.error('No se pudo identificar al usuario o cargar los datos del perfil');
      return;
    }

    setIsLoading(true);
    try {
      // Merge the current profile data with the updated section data
      const updatedProfileData = {
        ...profileData,
        ...sectionData
      };
      
      // Update the profile data in the state
      setProfileData(updatedProfileData);
      
      // Save to the database
      await updateVeterinarianProfile(userId, updatedProfileData);
      toast.success(`Sección ${sectionName} actualizada con éxito`);
    } catch (error: any) {
      toast.error(`Error al actualizar la sección ${sectionName}: ${error.message}`);
      // Revert to the previous state if there's an error
      setProfileData(initialData);
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitialDataLoading || !profileData) {
    return (
      <LayoutBase
        header={<VetProfileHeader />}
        footer={<NavbarInferior activeTab="profile" />}
      >
        <VetProfileLoading />
      </LayoutBase>
    );
  }

  return (
    <LayoutBase
      header={<VetProfileHeader />}
      footer={<NavbarInferior activeTab="profile" />}
    >
      <div className="pb-24">
        <VetProfilePreview 
          profileData={profileData}
          userId={userId}
          isLoading={isLoading}
          onSaveSection={handleSaveSection}
        />
      </div>
    </LayoutBase>
  );
};

export default VetProfileScreen;
