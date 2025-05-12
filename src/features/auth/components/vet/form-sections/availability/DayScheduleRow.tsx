
import React from 'react';
import { Controller } from 'react-hook-form';
import { DaySchedule } from '../../../../types/veterinarianTypes';
import { Switch } from '@/ui/atoms/switch';
import TimeSelect from './TimeSelect';
import { DayScheduleRowProps } from './types';

const DayScheduleRow: React.FC<DayScheduleRowProps> = ({ day, control }) => {
  return (
    <tr key={day.id}>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {day.label}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <Controller
          name={`availability.${day.id}` as any}
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
          name={`availability.${day.id}.isAvailable` as any}
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <Switch
              checked={field.value}
              onCheckedChange={(checked) => {
                field.onChange(checked);
                
                // When the switch is activated, ensure default values are saved
                if (checked) {
                  const defaultDaySchedule = {
                    isAvailable: true,
                    startTime: '09:00',
                    endTime: '18:00'
                  };
                  
                  // Access the complete day field name to set default values
                  const dayFieldName = `availability.${day.id}` as const;
                  const currentValue = control._getWatch?.(dayFieldName) || {};
                  
                  // Set the complete values with the control's setValue function
                  control._formState.dirtyFields[dayFieldName] = true;
                  if (control._fields[dayFieldName]?._f?.mount) {
                    control._fields[dayFieldName]._f.onChange({
                      target: {
                        value: {
                          ...currentValue,
                          isAvailable: true,
                          startTime: currentValue.startTime || '09:00',
                          endTime: currentValue.endTime || '18:00'
                        }
                      }
                    });
                  }
                }
              }}
              id={`${day.id}-available`}
            />
          )}
        />
      </td>
    </tr>
  );
};

export default DayScheduleRow;
