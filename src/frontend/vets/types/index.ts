
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
