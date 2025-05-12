
import { Control } from "react-hook-form";
import { VeterinarianProfile, DaySchedule, AvailabilityMap } from "../../../../types/veterinarianTypes";

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
