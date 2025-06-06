
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { supabase } from '@/integrations/supabase/client';
import { GroomingProfile } from '@/features/auth/types/groomingTypes';
import { toast } from 'sonner';
import GroomingProfileHeader from '../components/profile/GroomingProfileHeader';
import GroomingProfilePreview from '../components/profile/GroomingProfilePreview';
import GroomingProfileLoading from '../components/profile/GroomingProfileLoading';

const GroomingProfileScreen: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [profileData, setProfileData] = useState<GroomingProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const userId = user?.id || '';

  const loadProfileData = async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('pet_grooming')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      const groomingProfile: GroomingProfile = {
        business_name: data.business_name || '',
        profile_image_url: data.profile_image_url || '',
        animals_accepted: Array.isArray(data.animals_accepted) ? data.animals_accepted : [],
        availability: data.availability || {},
        services_offered: Array.isArray(data.services_offered) ? data.services_offered : []
      };

      setProfileData(groomingProfile);
    } catch (err: any) {
      console.error('Error loading grooming profile:', err);
      toast.error('Error al cargar el perfil');
      
      // Set default profile if error
      setProfileData({
        business_name: '',
        profile_image_url: '',
        animals_accepted: [],
        availability: {},
        services_offered: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSection = async (sectionData: Partial<GroomingProfile>, sectionName: string) => {
    if (!userId || !profileData) {
      toast.error('No se pudo identificar al usuario o cargar los datos del perfil');
      return;
    }

    setIsSaving(true);
    try {
      const updatedProfileData = {
        ...profileData,
        ...sectionData
      };
      
      setProfileData(updatedProfileData);
      
      const { error } = await supabase
        .from('pet_grooming')
        .update(sectionData)
        .eq('id', userId);

      if (error) throw error;

      toast.success(`${sectionName} actualizado con éxito`);
      await loadProfileData(); // Refresh data
    } catch (error: any) {
      toast.error(`Error al actualizar ${sectionName}: ${error.message}`);
      setProfileData(profileData); // Revert changes
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, [userId]);

  if (isLoading || !profileData) {
    return (
      <LayoutBase
        header={<GroomingProfileHeader />}
        footer={<NavbarInferior activeTab="profile" />}
      >
        <GroomingProfileLoading />
      </LayoutBase>
    );
  }

  return (
    <LayoutBase
      header={<GroomingProfileHeader />}
      footer={<NavbarInferior activeTab="profile" />}
    >
      <div className="pb-24">
        <GroomingProfilePreview 
          profileData={profileData}
          userId={userId}
          isLoading={isSaving}
          onSaveSection={handleSaveSection}
        />
      </div>
    </LayoutBase>
  );
};

export default GroomingProfileScreen;
