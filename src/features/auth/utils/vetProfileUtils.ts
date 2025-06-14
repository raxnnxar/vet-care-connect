
import { Json } from '@/integrations/supabase/types';
import { 
  VeterinarianProfile, 
  AvailabilitySchedule, 
  EducationEntry, 
  CertificationEntry, 
  ServiceOffered 
} from '../types/veterinarianTypes';

// Define defaultVetProfile
export const defaultVetProfile: VeterinarianProfile = {
  specializations: ['general'],
  license_number: '',
  years_of_experience: 0,
  bio: '',
  availability: {},
  education: [],
  certifications: [],
  animals_treated: [],
  services_offered: [],
  languages_spoken: ['spanish'],
  emergency_services: false
};

// Function to get user role from user object
export const getUserRole = (user: any): string => {
  if (!user) return 'pet_owner';
  
  // Check in raw_user_meta_data first
  if (user.raw_user_meta_data?.role) {
    return user.raw_user_meta_data.role;
  }
  
  // Check in user_metadata as fallback
  if (user.user_metadata?.role) {
    return user.user_metadata.role;
  }
  
  // Default to pet_owner
  return 'pet_owner';
};

// Helper functions to safely convert JSON data to typed objects
export const parseAvailability = (json: any): AvailabilitySchedule => {
  if (!json || typeof json !== 'object') return {} as AvailabilitySchedule;
  return json as AvailabilitySchedule;
};

export const parseEducation = (json: any): EducationEntry[] => {
  if (!json || !Array.isArray(json)) return [];
  return json.map(entry => ({
    id: String(entry?.id || ''),
    degree: String(entry?.degree || ''),
    institution: String(entry?.institution || ''),
    year: Number(entry?.year || new Date().getFullYear()),
    document_url: entry?.document_url ? String(entry.document_url) : undefined
  }));
};

export const parseCertifications = (json: any): CertificationEntry[] => {
  if (!json || !Array.isArray(json)) return [];
  return json.map(entry => ({
    id: String(entry?.id || ''),
    title: String(entry?.title || ''),
    organization: String(entry?.organization || ''),
    issue_date: String(entry?.issue_date || ''),
    expiry_date: entry?.expiry_date ? String(entry.expiry_date) : undefined,
    document_url: entry?.document_url ? String(entry.document_url) : undefined
  }));
};

export const parseAnimals = (json: any): string[] => {
  if (!json || !Array.isArray(json)) return [];
  return json.map(item => String(item || ''));
};

export const parseServices = (json: any): ServiceOffered[] => {
  if (!json || !Array.isArray(json)) return [];
  return json.map(entry => ({
    id: String(entry?.id || ''),
    name: String(entry?.name || ''),
    description: String(entry?.description || ''),
    price: entry?.price !== undefined ? Number(entry.price) : undefined
  }));
};

export const parseLanguages = (json: any): string[] => {
  if (!json || !Array.isArray(json)) return ['spanish'];
  return json.map(item => String(item || ''));
};

export const parseSpecializations = (json: any): string[] => {
  if (!json || !Array.isArray(json)) return ['general'];
  return json.map(item => String(item || ''));
};

// Main function to parse all vet profile data from database
export const parseVetProfileData = (vetData: any): VeterinarianProfile => {
  // Add defensive checks to make sure we have vetData
  if (!vetData) {
    console.error('Cannot parse undefined or null vetData');
    return defaultVetProfile;
  }

  return {
    specializations: parseSpecializations(vetData.specialization),
    license_number: vetData.license_number || '',
    license_document_url: vetData.license_document_url,
    years_of_experience: vetData.years_of_experience || 0,
    bio: vetData.bio || '',
    availability: parseAvailability(vetData.availability),
    education: parseEducation(vetData.education),
    certifications: parseCertifications(vetData.certifications),
    animals_treated: parseAnimals(vetData.animals_treated),
    services_offered: parseServices(vetData.services_offered),
    profile_image_url: vetData.profile_image_url,
    languages_spoken: parseLanguages(vetData.languages_spoken),
    emergency_services: !!vetData.emergency_services
  };
};
