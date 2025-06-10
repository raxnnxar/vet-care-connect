
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
  const [profileData, setProfileData] = useState<(GroomingProfile & { location?: string; latitude?: number; longitude?: number }) | null>(null);
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

      // Safe type conversion with proper defaults
      const groomingProfile: GroomingProfile & { location?: string; latitude?: number; longitude?: number } = {
        business_name: data.business_name || '',
        profile_image_url: data.profile_image_url || '',
        location: data.location || '',
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        animals_accepted: Array.isArray(data.animals_accepted) 
          ? (data.animals_accepted as string[])
          : [],
        availability: (data.availability && typeof data.availability === 'object') 
          ? (data.availability as Record<string, any>)
          : {},
        services_offered: Array.isArray(data.services_offered) 
          ? (data.services_offered as any[])
          : []
      };

      setProfileData(groomingProfile);
    } catch (err: any) {
      console.error('Error loading grooming profile:', err);
      toast.error('Error al cargar el perfil');
      
      // Set default profile if error
      setProfileData({
        business_name: '',
        profile_image_url: '',
        location: '',
        latitude: null,
        longitude: null,
        animals_accepted: [],
        availability: {},
        services_offered: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSection = async (sectionData: Partial<GroomingProfile & { latitude?: number; longitude?: number }>, sectionName: string) => {
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
      
      // Convert the data to the format expected by Supabase
      const updateData: any = {};
      
      if (sectionData.business_name !== undefined) {
        updateData.business_name = sectionData.business_name;
      }
      if (sectionData.animals_accepted !== undefined) {
        updateData.animals_accepted = sectionData.animals_accepted;
      }
      if (sectionData.availability !== undefined) {
        updateData.availability = sectionData.availability;
      }
      if (sectionData.services_offered !== undefined) {
        updateData.services_offered = sectionData.services_offered;
      }
      if (sectionData.location !== undefined) {
        updateData.location = sectionData.location;
      }
      if (sectionData.latitude !== undefined) {
        updateData.latitude = sectionData.latitude;
      }
      if (sectionData.longitude !== undefined) {
        updateData.longitude = sectionData.longitude;
      }
      
      const { error } = await supabase
        .from('pet_grooming')
        .update(updateData)
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
