
/**
 * Pet related types
 * 
 * These types define the shape of pet data in the application
 */

export interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: number;
  weight: number;
  ownerId: string;
  imageUrl?: string;
  medicalHistory?: MedicalRecord[];
}

export interface MedicalRecord {
  id: string;
  date: string;
  diagnosis: string;
  treatment: string;
  veterinarianId: string;
  notes?: string;
}

// Data types for creating and updating pets

export type CreatePetData = Omit<Pet, 'id' | 'medicalHistory'> & {
  medicalHistory?: Omit<MedicalRecord, 'id'>[];
};

export type UpdatePetData = Partial<Omit<Pet, 'id' | 'medicalHistory'>> & {
  medicalHistory?: Omit<MedicalRecord, 'id'>[];
};

// Query response types
export type PetsResponse = {
  pets: Pet[];
  count: number;
};

// Filter types
export type PetFilters = {
  type?: string;
  breed?: string;
  ownerId?: string;
  ageRange?: [number, number];
};
