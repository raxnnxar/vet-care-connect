
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { DaySchedule } from '../../../../types/veterinarianTypes';
import { Switch } from '@/ui/atoms/switch';
import TimeSelect from './TimeSelect';
import { DayScheduleRowProps } from './types';

const DayScheduleRow: React.FC<DayScheduleRowProps> = ({ day, control }) => {
  // Use useFormContext to access form methods
  const { getValues, setValue } = useFormContext();
  
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
              checked={Boolean(field.value)}
              onCheckedChange={(checked) => {
                field.onChange(checked);
                // Asegurar que se establezcan los valores predeterminados cuando se activa
                if (checked) {
                  // Accedemos a los valores usando useFormContext en lugar de control.getValues
                  const currentValue = getValues(`availability.${day.id}` as any) || {};
                  setValue(`availability.${day.id}` as any, {
                    ...currentValue,
                    isAvailable: true,
                    startTime: currentValue.startTime || '09:00',
                    endTime: currentValue.endTime || '18:00'
                  }, { shouldValidate: true });
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
