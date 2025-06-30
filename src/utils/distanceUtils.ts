
/**
 * Calculate the distance between two geographic points using the Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in kilometers with 1 decimal place
 */
export const calculateDistance = (
  lat1: number | null,
  lon1: number | null,
  lat2: number | null,
  lon2: number | null
): string => {
  // Check if any coordinate is null or undefined
  if (lat1 === null || lon1 === null || lat2 === null || lon2 === null) {
    return "Ubicación no disponible";
  }

  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return `${distance.toFixed(1)} km`;
};

/**
 * Convert degrees to radians
 */
const toRad = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Get user's current location
 * @returns Promise with user's coordinates or null if not available
 */
export const getUserLocation = (): Promise<{ latitude: number; longitude: number } | null> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by this browser');
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        console.warn('Error getting user location:', error.message);
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // Cache for 5 minutes
      }
    );
  });
};

/**
 * Translation map for animal types from English (DB) to Spanish (UI)
 */
export const animalTranslationMap: Record<string, string> = {
  'dog': 'Perro',
  'cat': 'Gato',
  'bird': 'Ave',
  'reptile': 'Reptil',
  'rodent': 'Roedor',
  'rabbit': 'Conejo',
  'fish': 'Pez',
  'amphibian': 'Anfibio',
  'exotic': 'Exótico',
  'farm': 'Animales de granja',
  'horse': 'Equino'
};

/**
 * Translate animal types from English to Spanish
 * @param animals Array of animal types in English
 * @returns Formatted string with animals in Spanish
 */
export const translateAnimals = (animals: string[]): string => {
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
