
import { Control } from "react-hook-form";
import { VeterinarianProfile, DaySchedule, AvailabilitySchedule } from "../../../../types/veterinarianTypes";

// Define the WeekDay type for our day identifiers
export interface WeekDay {
  id: keyof AvailabilitySchedule;
  label: string;
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
}

export interface AvailabilitySectionProps {
  control: Control<VeterinarianProfile>;
  errors?: any;
}
