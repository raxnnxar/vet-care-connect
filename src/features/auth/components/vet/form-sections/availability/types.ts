
import { Control, UseFormSetValue } from "react-hook-form";
import { VeterinarianProfile, DaySchedule } from "../../../../types/veterinarianTypes";

// Define the AvailabilityMap type to match what's used in VeterinarianProfile
export interface AvailabilityMap {
  monday?: DaySchedule;
  tuesday?: DaySchedule;
  wednesday?: DaySchedule;
  thursday?: DaySchedule;
  friday?: DaySchedule;
  saturday?: DaySchedule;
  sunday?: DaySchedule;
}

export interface TimeSlotProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  isStartTime?: boolean;
  endTime?: string;
  startTime?: string;
}

export interface WeekDay {
  id: keyof AvailabilityMap;
  label: string;
}

export interface DayScheduleRowProps {
  day: WeekDay;
  control: Control<VeterinarianProfile>;
}

export interface AvailabilitySectionProps {
  control: Control<VeterinarianProfile>;
  errors?: any;
}
