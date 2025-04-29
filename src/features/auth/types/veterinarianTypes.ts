
export interface VeterinarianProfile {
  id?: string;
  specialization: string;
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
}

export interface AnimalType {
  value: string;
  label: string;
}

export interface Language {
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

export const SPECIALIZATIONS = [
  { value: 'general', label: 'Medicina general' },
  { value: 'surgery', label: 'Cirugía' },
  { value: 'dermatology', label: 'Dermatología' },
  { value: 'cardiology', label: 'Cardiología' },
  { value: 'neurology', label: 'Neurología' },
  { value: 'oncology', label: 'Oncología' },
  { value: 'ophthalmology', label: 'Oftalmología' },
  { value: 'orthopedics', label: 'Ortopedia' },
  { value: 'dentistry', label: 'Odontología' },
  { value: 'internal_medicine', label: 'Medicina interna' },
  { value: 'exotic_animals', label: 'Animales exóticos' },
  { value: 'reproduction', label: 'Reproducción' }
];
