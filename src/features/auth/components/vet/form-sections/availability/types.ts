
import { Control } from "react-hook-form";
import { VeterinarianProfile, DaySchedule } from "../../../../types/veterinarianTypes";

export interface TimeSlotProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  isStartTime?: boolean;
  endTime?: string;
  startTime?: string;
}

export interface DayScheduleRowProps {
  day: {
    id: string;
    label: string;
  };
  control: Control<VeterinarianProfile>;
}

export interface AvailabilitySectionProps {
  control: Control<VeterinarianProfile>;
  errors?: any; // Use 'any' for errors until we can properly type them
}
