
export const SERVICE_TYPES = {
  VETERINARIAN: 'veterinarian',
  GROOMING: 'grooming',
  BOARDING: 'boarding',
} as const;

export type ServiceTypeType = (typeof SERVICE_TYPES)[keyof typeof SERVICE_TYPES];
