
// Helper function to translate specialization to human-readable format
export const translateSpecialization = (spec: string): string => {
  const translations: Record<string, string> = {
    'cardiology': 'Cardiología',
    'dermatology': 'Dermatología',
    'orthopedics': 'Ortopedia',
    'neurology': 'Neurología',
    'ophthalmology': 'Oftalmología',
    'oncology': 'Oncología',
    'general': 'Medicina General',
    'surgery': 'Cirugía',
    'dentistry': 'Odontología',
    'nutrition': 'Nutrición',
    'internal_medicine': 'Medicina Interna',
    'emergency': 'Emergencias',
    'rehabilitation': 'Rehabilitación',
    'exotics': 'Animales Exóticos',
    // Add more translations as needed
  };
  
  return translations[spec.toLowerCase()] || spec;
};

// Helper function to format animals treated 
export const formatAnimalsTreated = (animals: string[]) => {
  if (!animals || animals.length === 0) {
    return "Animales domésticos";
  }
  
  return animals.join(', ');
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
