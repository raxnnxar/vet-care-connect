
// Define a single source of truth for service types
export const SERVICE_TYPES = {
  VETERINARIAN: 'veterinarian',
  GROOMING: 'grooming',
  BOARDING: 'boarding',
  WALKING: 'walking',
} as const;

export type ServiceTypeType = (typeof SERVICE_TYPES)[keyof typeof SERVICE_TYPES];
