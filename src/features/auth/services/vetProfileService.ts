
import { supabase } from '@/integrations/supabase/client';
import { VeterinarianProfile } from '../types/veterinarianTypes';
import { toast } from '@/hooks/use-toast';

export const updateVeterinarianProfile = async (
  userId: string,
  profileData: VeterinarianProfile
): Promise<boolean> => {
  try {
    // Ensure all required fields have values
    const completeProfile: VeterinarianProfile = {
      ...profileData,
      // Provide defaults for required fields that might be missing
      specializations: profileData.specializations || ['general'],
      license_number: profileData.license_number || '',
      years_of_experience: profileData.years_of_experience || 0,
      bio: profileData.bio || '',
      // Ensure arrays and objects are properly initialized
      availability: profileData.availability || {},
      education: profileData.education || [],
      certifications: profileData.certifications || [],
      animals_treated: profileData.animals_treated || [],
      services_offered: profileData.services_offered || [],
      languages_spoken: profileData.languages_spoken || ['spanish'],
      emergency_services: profileData.emergency_services || false
    };

    // Update veterinarian record - convert types to match database requirements
    const { error: updateError } = await supabase
      .from('veterinarians')
      .update({
        specialization: completeProfile.specializations as any,
        license_number: completeProfile.license_number,
        license_document_url: completeProfile.license_document_url,
        years_of_experience: completeProfile.years_of_experience,
        bio: completeProfile.bio,
        availability: completeProfile.availability as any,
        education: completeProfile.education as any,
        certifications: completeProfile.certifications as any,
        animals_treated: completeProfile.animals_treated as any,
        services_offered: completeProfile.services_offered as any,
        profile_image_url: completeProfile.profile_image_url,
        languages_spoken: completeProfile.languages_spoken as any,
        emergency_services: completeProfile.emergency_services
      })
      .eq('id', userId);

    if (updateError) {
      throw updateError;
    }

    // Also update the service provider record to ensure consistency
    await supabase
      .from('service_providers')
      .update({
        provider_type: 'veterinarian',
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    return true;
  } catch (error: any) {
    console.error('Error updating vet profile:', error);
    throw error;
  }
};
