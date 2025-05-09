export interface VeterinarianProfile {
  id?: string;
  specializations: string[];
  license_number: string;
  license_document_url?: string;
  years_of_experience: number;
  bio: string;
  availability: AvailabilitySchedule;
  education: EducationEntry[];
  certifications: CertificationEntry[];
  animals_treated: string[];
  services_offered: ServiceOffered[];
  profile_image_url?: string;
  languages_spoken: string[];
  emergency_services: boolean;
  average_rating?: number;  // Added missing property
  total_reviews?: number;   // Added missing property
}

export interface AvailabilitySchedule {
  monday?: DaySchedule;
  tuesday?: DaySchedule;
  wednesday?: DaySchedule;
  thursday?: DaySchedule;
  friday?: DaySchedule;
  saturday?: DaySchedule;
  sunday?: DaySchedule;
}

export interface DaySchedule {
  isAvailable: boolean;
  startTime?: string;
  endTime?: string;
}

export interface EducationEntry {
  id: string;
  degree: string;
  institution: string;
  year: number;
  document_url?: string;
}

export interface CertificationEntry {
  id: string;
  title: string;
  organization: string;
  issue_date: string;
  expiry_date?: string;
  document_url?: string;
}

export interface ServiceOffered {
  id: string;
  name: string;
  description: string;
  price?: number; // Agregado el campo de precio
}

export interface AnimalType {
  value: string;
  label: string;
}

export interface Language {
  value: string;
  label: string;
}

export interface Specialization {
  value: string;
  label: string;
}

export const ANIMAL_TYPES: AnimalType[] = [
  { value: 'dog', label: 'Perros' },
  { value: 'cat', label: 'Gatos' },
  { value: 'bird', label: 'Aves' },
  { value: 'reptile', label: 'Reptiles' },
  { value: 'rodent', label: 'Roedores' },
  { value: 'rabbit', label: 'Conejos' },
  { value: 'fish', label: 'Peces' },
  { value: 'amphibian', label: 'Anfibios' },
  { value: 'exotic', label: 'Exóticos' },
  { value: 'farm_animal', label: 'Animales de granja' },
  { value: 'equine', label: 'Equinos' }
];

export const LANGUAGES: Language[] = [
  { value: 'spanish', label: 'Español' },
  { value: 'english', label: 'Inglés' },
  { value: 'french', label: 'Francés' },
  { value: 'portuguese', label: 'Portugués' },
  { value: 'german', label: 'Alemán' },
  { value: 'italian', label: 'Italiano' },
  { value: 'russian', label: 'Ruso' },
  { value: 'chinese', label: 'Chino' },
  { value: 'japanese', label: 'Japonés' },
  { value: 'arabic', label: 'Árabe' }
];

export const SPECIALIZATIONS: Specialization[] = [
  { value: 'general', label: 'Medicina general' },
  { value: 'internal_medicine', label: 'Medicina Interna' },
  { value: 'surgery', label: 'Cirugía' },
  { value: 'dermatology', label: 'Dermatología' },
  { value: 'ophthalmology', label: 'Oftalmología' },
  { value: 'dentistry', label: 'Odontología' },
  { value: 'anesthesiology', label: 'Anestesiología' },
  { value: 'oncology', label: 'Oncología' },
  { value: 'cardiology', label: 'Cardiología' },
  { value: 'neurology', label: 'Neurología' },
  { value: 'exotic_animals', label: 'Medicina de Animales Exóticos' },
  { value: 'large_animals', label: 'Medicina de Animales Grandes' },
  { value: 'emergency_care', label: 'Emergencias y Cuidados Críticos' },
  { value: 'rehabilitation', label: 'Rehabilitación y Fisioterapia' },
  { value: 'ethology', label: 'Etología' },
  { value: 'pathology', label: 'Patología' },
  { value: 'sports_medicine', label: 'Medicina deportiva para animales' },
  { value: 'nutrition', label: 'Nutriología' },
  { value: 'preventive_medicine', label: 'Medicina preventiva y bienestar animal' }
];
