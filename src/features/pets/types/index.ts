
/**
 * Pet related types
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
