
import { Control, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { VeterinarianProfile } from '@/features/auth/types/veterinarianTypes';

export interface WeekDay {
  id: keyof AvailabilityMap;
  label: string;
}

export interface AvailabilityMap {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

export interface TimeSlotProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  isStartTime?: boolean;
  endTime?: string;
  startTime?: string;
}

export interface DayScheduleRowProps {
  day: WeekDay;
  control: Control<VeterinarianProfile>;
  setValue: UseFormSetValue<VeterinarianProfile>;
}

export interface AvailabilitySectionProps {
  control: Control<VeterinarianProfile>;
  errors: FieldErrors<VeterinarianProfile>;
}
