
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';
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

  // Add debugging to see what data we're getting
  console.log('VetProfileSetupScreen - initialData:', initialData);
  console.log('VetProfileSetupScreen - defaultVetProfile:', defaultVetProfile);
  console.log('VetProfileSetupScreen - isInitialDataLoading:', isInitialDataLoading);

  const handleSubmit = async (profileData: VeterinarianProfile) => {
    if (!userId) {
      toast.error('No se pudo identificar al usuario. Vuelve a iniciar sesión.');
      return;
    }

    setIsLoading(true);
    console.log("Submitting profile data:", profileData);

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
      // Redirect to vet location setup screen
      navigate('/vet-location-setup');
    } catch (error: any) {
      console.error("Error details:", error);
      toast.error(`Error al actualizar el perfil: ${error.message}`);
      setIsLoading(false);
    }
  };

  if (isInitialDataLoading) {
    return <VetProfileLoading />;
  }

  // Make sure we have safe initial data 
  const safeData = initialData || defaultVetProfile;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#79D0B8] to-[#5FBFB3] py-8 px-4">
      <div className="container mx-auto max-w-3xl px-0">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Configura tu perfil profesional</h1>
          <p className="text-white/80 mt-2">
            Completa la información que desees para tu perfil profesional
          </p>
        </div>

        <VetProfileForm 
          initialData={safeData}
          onSubmit={handleSubmit}
          isSubmitting={isLoading}
          userId={userId}
        />
      </div>
    </div>
  );
};

export default VetProfileSetupScreen;
