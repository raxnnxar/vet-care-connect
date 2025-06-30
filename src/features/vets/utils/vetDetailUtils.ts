
import { animalTranslationMap } from '@/utils/distanceUtils';

// Dictionary for translating specializations from English to Spanish
const SPECIALIZATION_LABELS_ES: Record<string, string> = {
  general: "Medicina general",
  internal_medicine: "Medicina interna", 
  surgery: "Cirugía",
  dermatology: "Dermatología",
  ophthalmology: "Oftalmología",
  dentistry: "Odontología",
  anesthesiology: "Anestesiología",
  oncology: "Oncología",
  cardiology: "Cardiología",
  neurology: "Neurología",
  exotic_medicine: "Medicina de animales exóticos",
  large_animals: "Medicina de animales grandes",
  emergency: "Emergencias y cuidados críticos",
  rehabilitation: "Rehabilitación y fisioterapia",
  behavior: "Etología",
  pathology: "Patología",
  sports_medicine: "Medicina deportiva para animales",
  nutrition: "Nutriología",
  preventive_medicine: "Medicina preventiva y bienestar animal",
};

// Helper function to translate specialization to human-readable format
export const translateSpecialization = (spec: string): string => {
  return SPECIALIZATION_LABELS_ES[spec.toLowerCase()] || spec;
};

// Helper function to format animals treated using centralized translation
export const formatAnimalsTreated = (animals: string[]) => {
  if (!animals || animals.length === 0) {
    return "Información no disponible";
  }
  
  const translatedAnimals = animals
    .map(animal => animalTranslationMap[animal.toLowerCase()] || animal)
    .filter(Boolean);
  
  if (translatedAnimals.length === 0) {
    return "Información no disponible";
  }
  
  return translatedAnimals.join(', ');
};

// Generate initials for the avatar
export const getInitials = (displayName: string): string => {
  if (!displayName) return '';
  
  const nameParts = displayName.split(' ');
  if (nameParts.length >= 2) {
    return `${nameParts[0].charAt(0).toUpperCase()}${nameParts[1].charAt(0).toUpperCase()}`;
  } else if (nameParts.length === 1) {
    return nameParts[0].substring(0, 2).toUpperCase();
  }
  return '';
};

// Export the specialization dictionary for use in other components
export { SPECIALIZATION_LABELS_ES };
