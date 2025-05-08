
import React from 'react';
import { Clock } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/molecules/select';
import { TimeSlotProps } from './types';

const TimeSelect: React.FC<TimeSlotProps> = ({
  value,
  onChange,
  disabled = false,
  isStartTime = false,
  endTime,
  startTime
}) => {
  // Import hours from constants
  const HOURS = [
    '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'
  ];

  return (
    <Select
      disabled={disabled}
      value={value}
      onValueChange={onChange}
    >
      <SelectTrigger className="w-full">
        <div className="flex items-center">
          <Clock className="mr-2 h-3 w-3 text-gray-400" />
          <SelectValue placeholder={isStartTime ? "Inicio" : "Fin"} />
        </div>
      </SelectTrigger>
      <SelectContent>
        {HOURS.map((hour) => (
          <SelectItem 
            key={hour} 
            value={hour}
            disabled={isStartTime 
              ? (endTime && hour >= endTime) 
              : (startTime && hour <= startTime)
            }
          >
            {hour}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TimeSelect;
