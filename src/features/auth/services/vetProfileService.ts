
import { supabase } from '@/integrations/supabase/client';
import { VeterinarianProfile, AvailabilitySchedule } from '../types/veterinarianTypes';
import { toast } from 'sonner';

// Helper function to ensure the availability has the correct structure
const ensureCorrectAvailabilityStructure = (availability: any): AvailabilitySchedule => {
  if (!availability) return {};
  
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const result: AvailabilitySchedule = {};
  
  days.forEach(day => {
    // If the day has isAvailable property as true, ensure it has startTime and endTime
    if (availability[day]?.isAvailable === true) {
      result[day] = {
        isAvailable: true,
        startTime: availability[day].startTime || '09:00',
        endTime: availability[day].endTime || '18:00'
      };
    } else if (availability[day]) {
      // If the day exists but isAvailable is not true, configure it as unavailable
      result[day] = { isAvailable: false };
    }
  });
  
  return result;
};

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
      // Ensure availability has the correct structure
      availability: ensureCorrectAvailabilityStructure(profileData.availability),
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
        emergency_services: completeProfile.emergency_services,
        clinic_address: completeProfile.clinic_address,
        clinic_latitude: completeProfile.clinic_latitude,
        clinic_longitude: completeProfile.clinic_longitude
      })
      .eq('id', userId);

    if (updateError) {
      throw updateError;
    }

    return true;
  } catch (error: any) {
    console.error('Error updating vet profile:', error);
    throw error;
  }
};
