
import React from 'react';
import { Controller, Control } from 'react-hook-form';
import TimeSelect from '../../vet/form-sections/availability/TimeSelect';
import { GroomingProfile } from '../../../types/groomingTypes';

interface DaySchedule {
  isAvailable: boolean;
  startTime: string;
  endTime: string;
}

interface GroomingMobileTimeSlotsProps {
  dayId: string;
  control: Control<GroomingProfile>;
}

const GroomingMobileTimeSlots: React.FC<GroomingMobileTimeSlotsProps> = ({ dayId, control }) => {
  const fieldPath = `availability.${dayId}` as const;
  
  return (
    <Controller
      name={fieldPath as any}
      control={control}
      defaultValue={{ isAvailable: false, startTime: '09:00', endTime: '18:00' } as DaySchedule}
      render={({ field }) => {
        const daySchedule = field.value as DaySchedule | undefined;
        
        return (
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Hora inicio</label>
              <TimeSelect
                value={daySchedule?.startTime || '09:00'}
                onChange={(value) => {
                  field.onChange({
                    ...daySchedule,
                    startTime: value,
                    endTime: daySchedule?.endTime && value >= daySchedule.endTime
                      ? value
                      : daySchedule?.endTime || '18:00'
                  });
                }}
                isStartTime={true}
                endTime={daySchedule?.endTime}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Hora fin</label>
              <TimeSelect
                value={daySchedule?.endTime || '18:00'}
                onChange={(value) => {
                  field.onChange({
                    ...daySchedule,
                    endTime: value
                  });
                }}
                isStartTime={false}
                startTime={daySchedule?.startTime}
              />
            </div>
          </div>
        );
      }}
    />
  );
};

export default GroomingMobileTimeSlots;
