
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
import { HOURS } from './constants';

const TimeSelect: React.FC<TimeSlotProps> = ({
  value,
  onChange,
  disabled = false,
  isStartTime = false,
  endTime,
  startTime
}) => {
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
