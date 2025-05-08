
import React from 'react';
import { Controller } from 'react-hook-form';
import { DaySchedule } from '../../../../types/veterinarianTypes';
import TimeSelect from './TimeSelect';
import { Control } from 'react-hook-form';
import { VeterinarianProfile } from '../../../../types/veterinarianTypes';

interface MobileTimeSlotsProps {
  dayId: string;
  control: Control<VeterinarianProfile>;
}

const MobileTimeSlots: React.FC<MobileTimeSlotsProps> = ({ dayId, control }) => {
  return (
    <Controller
      name={`availability.${dayId}` as any}
      control={control}
      defaultValue={{ isAvailable: false, startTime: '09:00', endTime: '18:00' } as DaySchedule}
      render={({ field }) => {
        const daySchedule = field.value as DaySchedule | undefined;
        const isAvailable = daySchedule?.isAvailable ?? false;
        
        if (!isAvailable) return null;
        
        return (
          <div className="grid grid-cols-2 gap-3">
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

export default MobileTimeSlots;
