
import React from 'react';
import { Controller } from 'react-hook-form';
import { DaySchedule } from '../../../../types/veterinarianTypes';
import { Switch } from '@/ui/atoms/switch';
import MobileTimeSlots from './MobileTimeSlots';
import { WEEKDAYS } from './constants';
import { AvailabilitySectionProps } from './types';

const MobileAvailabilityView: React.FC<AvailabilitySectionProps> = ({ control }) => {
  return (
    <div className="md:hidden">
      <div className="divide-y border rounded-lg">
        {WEEKDAYS.map((day) => (
          <div key={day.id as React.Key} className="p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium text-base">{day.label}</span>
              <Controller
                name={`availability.${String(day.id)}.isAvailable` as any}
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
                        
                        // Use setValue from control to update the value directly
                        control.setValue(`availability.${String(day.id)}` as any, defaultDaySchedule, {
                          shouldDirty: true,
                          shouldValidate: true
                        });
                      }
                    }}
                    id={`${String(day.id)}-available-mobile`}
                  />
                )}
              />
            </div>
            
            <Controller
              name={`availability.${String(day.id)}.isAvailable` as any}
              control={control}
              defaultValue={false}
              render={({ field }) => (
                field.value ? (
                  <MobileTimeSlots dayId={day.id as string} control={control} />
                ) : null
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileAvailabilityView;
