
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { DaySchedule } from '../../../../types/veterinarianTypes';
import { Switch } from '@/ui/atoms/switch';
import MobileTimeSlots from './MobileTimeSlots';
import { WEEKDAYS } from './constants';
import { AvailabilitySectionProps } from './types';

const MobileAvailabilityView: React.FC<AvailabilitySectionProps> = ({ control }) => {
  // Get methods from form context
  const { setValue, getValues } = useFormContext();
  
  return (
    <div className="md:hidden">
      <div className="divide-y border rounded-lg">
        {WEEKDAYS.map((day) => {
          const dayId = day.id;
          const fieldPath = `availability.${dayId}`;
          const isAvailablePath = `availability.${dayId}.isAvailable`;
          
          return (
            <div key={dayId} className="p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium text-base">{day.label}</span>
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
                      id={`${dayId}-available-mobile`}
                    />
                  )}
                />
              </div>
              
              <Controller
                name={isAvailablePath as any}
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  field.value ? (
                    <MobileTimeSlots dayId={dayId} control={control} />
                  ) : null
                )}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MobileAvailabilityView;
