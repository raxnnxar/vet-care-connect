
import React from 'react';
import { Controller, Control, UseFormSetValue } from 'react-hook-form';
import { Switch } from '@/ui/atoms/switch';
import TimeSelect from '../../vet/form-sections/availability/TimeSelect';
import { GroomingProfile } from '../../../types/groomingTypes';

interface DaySchedule {
  isAvailable: boolean;
  startTime: string;
  endTime: string;
}

interface Day {
  id: string;
  label: string;
}

interface GroomingDayScheduleRowProps {
  day: Day;
  control: Control<GroomingProfile>;
  setValue: UseFormSetValue<GroomingProfile>;
}

const GroomingDayScheduleRow: React.FC<GroomingDayScheduleRowProps> = ({ day, control, setValue }) => {
  const dayId = day.id;
  const fieldPath = `availability.${dayId}` as const;
  const isAvailablePath = `availability.${dayId}.isAvailable` as const;

  return (
    <tr key={dayId}>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {day.label}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <Controller
          name={fieldPath as any}
          control={control}
          defaultValue={{ isAvailable: false, startTime: '09:00', endTime: '18:00' } as DaySchedule}
          render={({ field }) => {
            const daySchedule = field.value as DaySchedule | undefined;
            
            return (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <TimeSelect
                    disabled={!daySchedule?.isAvailable}
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
                  <TimeSelect
                    disabled={!daySchedule?.isAvailable}
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
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
        <Controller
          name={isAvailablePath as any}
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <Switch
              checked={Boolean(field.value)}
              onCheckedChange={(checked) => {
                field.onChange(checked);
                
                if (checked) {
                  // When activating the switch, ensure default values
                  const currentFieldValue = control._getWatch(fieldPath as any) as DaySchedule | undefined;
                  
                  const defaultDaySchedule = {
                    isAvailable: true,
                    startTime: currentFieldValue?.startTime || '09:00',
                    endTime: currentFieldValue?.endTime || '18:00'
                  };
                  
                  // Use setValue instead of accessing internal _subjects
                  setValue(fieldPath as any, defaultDaySchedule);
                }
              }}
              id={`${dayId}-available`}
            />
          )}
        />
      </td>
    </tr>
  );
};

export default GroomingDayScheduleRow;
