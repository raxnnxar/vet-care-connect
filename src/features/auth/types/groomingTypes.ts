
export interface ServiceWithSizes {
  nombre: string;
  tamaños: Array<{
    tipo: 'pequeño' | 'mediano' | 'grande';
    precio: number;
  }>;
}

export interface ServiceWithoutSizes {
  nombre: string;
  precio: number;
}

export type GroomingService = ServiceWithSizes | ServiceWithoutSizes;

export interface GroomingProfile {
  business_name: string;
  profile_image_url?: string;
  animals_accepted: string[];
  availability: Record<string, any>;
  services_offered: GroomingService[];
}

export const ANIMAL_TYPES = {
  DOG: 'perro',
  CAT: 'gato',
  RABBIT: 'conejo',
  OTHER: 'otro'
} as const;

export type AnimalType = (typeof ANIMAL_TYPES)[keyof typeof ANIMAL_TYPES];

export const ANIMAL_LABELS = {
  [ANIMAL_TYPES.DOG]: 'Perro',
  [ANIMAL_TYPES.CAT]: 'Gato',
  [ANIMAL_TYPES.RABBIT]: 'Conejo',
  [ANIMAL_TYPES.OTHER]: 'Otro'
};
