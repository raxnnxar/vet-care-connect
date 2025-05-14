
/**
 * Utility functions for vet detail display
 */

/**
 * Get initials from a name
 * @param name Full name
 * @returns First and last initial
 */
export const getInitials = (name: string): string => {
  if (!name) return '??';
  
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Map specialization codes to Spanish display names
 * @param specialization Specialization code
 * @returns Spanish display name
 */
export const translateSpecialization = (specialization: string): string => {
  const specializationMap: Record<string, string> = {
    'general': 'Medicina General',
    'surgery': 'Cirugía',
    'internal_medicine': 'Medicina Interna',
    'dermatology': 'Dermatología',
    'ophthalmology': 'Oftalmología',
    'dentistry': 'Odontología',
    'anesthesiology': 'Anestesiología',
    'oncology': 'Oncología',
    'cardiology': 'Cardiología',
    'neurology': 'Neurología',
    'exotic_animals': 'Medicina de Animales Exóticos',
    'large_animals': 'Medicina de Animales Grandes',
    'emergency_care': 'Emergencias y Cuidados Críticos',
    'rehabilitation': 'Rehabilitación y Fisioterapia',
    'ethology': 'Etología',
    'pathology': 'Patología',
    'sports_medicine': 'Medicina deportiva para animales',
    'nutrition': 'Nutriología',
    'preventive_medicine': 'Medicina preventiva y bienestar animal'
  };
  
  return specializationMap[specialization] || specialization;
};
