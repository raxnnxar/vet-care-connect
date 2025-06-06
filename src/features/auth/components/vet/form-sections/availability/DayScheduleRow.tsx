
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { DaySchedule } from '../../../../types/veterinarianTypes';
import { Switch } from '@/ui/atoms/switch';
import TimeSelect from './TimeSelect';
import { DayScheduleRowProps } from './types';

const DayScheduleRow: React.FC<DayScheduleRowProps> = ({ day, control }) => {
  // Get methods from the parent form context
  const { setValue, getValues } = useFormContext();

  const dayId = day.id;
  
  // Create a field path that will work with object notation
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
                
                // When the switch is activated, ensure default values are saved
                if (checked) {
                  const currentValue = getValues(fieldPath as any) as DaySchedule | undefined;
                  
                  const defaultDaySchedule = {
                    isAvailable: true,
                    startTime: currentValue?.startTime || '09:00',
                    endTime: currentValue?.endTime || '18:00'
                  };
                  
                  setValue(fieldPath as any, defaultDaySchedule, {
                    shouldDirty: true,
                    shouldValidate: true
                  });
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

export default DayScheduleRow;
