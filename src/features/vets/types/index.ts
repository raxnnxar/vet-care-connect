
/**
 * Veterinarian related types
 * 
 * These types define the shape of veterinarian data in the application
 */

export interface Veterinarian {
  id: string;
  name: string;
  specialization: string[];
  clinic: string;
  address: string;
  rating: number;
  reviewCount: number;
  availableDays: string[];
  imageUrl: string;
  description: string;
  experience: number;
  languages: string[];
  fees: {
    consultation: number;
    followUp: number;
  };
}

// Filter types for searching veterinarians
export interface VetFilters {
  specialization?: string[];
  clinic?: string;
  minRating?: number;
  languages?: string[];
  availableOn?: string;
  searchQuery?: string;
}

// Data for creating or updating veterinarian profiles
export type VetProfileData = Omit<Veterinarian, 'id' | 'rating' | 'reviewCount'>;

// Response types for veterinarian lists
export interface VetSearchResults {
  vets: Veterinarian[];
  total: number;
}
