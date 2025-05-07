import { Json } from '@/integrations/supabase/types';
import { 
  VeterinarianProfile, 
  AvailabilitySchedule, 
  EducationEntry, 
  CertificationEntry, 
  ServiceOffered,
  TimeRange
} from '../types/veterinarianTypes';

// Helper functions to safely convert JSON data to typed objects
export const parseAvailability = (json: any): AvailabilitySchedule => {
  if (!json || typeof json !== 'object') return {} as AvailabilitySchedule;
  
  // Convertir el formato antiguo al nuevo si es necesario
  const result: AvailabilitySchedule = {};
  
  for (const [day, value] of Object.entries(json)) {
    if (!value || typeof value !== 'object') {
      result[day as keyof AvailabilitySchedule] = { isAvailable: false, schedules: [] };
      continue;
    }
    
    // Verificar si es el formato antiguo (con startTime y endTime directamente en el objeto)
    if ('startTime' in value || 'endTime' in value) {
      const isAvailable = value.isAvailable === true;
      const schedules: TimeRange[] = [];
      
      if (isAvailable && value.startTime && value.endTime) {
        schedules.push({
          startTime: value.startTime,
          endTime: value.endTime
        });
      }
      
      result[day as keyof AvailabilitySchedule] = {
        isAvailable,
        schedules
      };
    } 
    // Formato nuevo con array de horarios
    else {
      const isAvailable = value.isAvailable === true;
      let schedules: TimeRange[] = [];
      
      if (Array.isArray(value.schedules)) {
        schedules = value.schedules.map((schedule: any) => ({
          startTime: schedule.startTime || '09:00',
          endTime: schedule.endTime || '18:00'
        }));
      }
      
      result[day as keyof AvailabilitySchedule] = {
        isAvailable,
        schedules
      };
    }
  }
  
  return result;
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
    description: String(entry?.description || '')
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
    return {
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
