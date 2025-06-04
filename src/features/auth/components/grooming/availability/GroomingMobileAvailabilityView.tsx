
import React from 'react';
import { Controller, Control, UseFormSetValue } from 'react-hook-form';
import { Switch } from '@/ui/atoms/switch';
import { WEEKDAYS } from '../../vet/form-sections/availability/constants';
import { GroomingProfile } from '../../../types/groomingTypes';
import GroomingMobileTimeSlots from './GroomingMobileTimeSlots';

interface GroomingMobileAvailabilityViewProps {
  control: Control<GroomingProfile>;
  setValue: UseFormSetValue<GroomingProfile>;
}

const GroomingMobileAvailabilityView: React.FC<GroomingMobileAvailabilityViewProps> = ({ control, setValue }) => {
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
                        
                        if (checked) {
                          // When activating the switch, ensure default values
                          const currentFieldValue = control._getWatch(fieldPath as any);
                          
                          const defaultDaySchedule = {
                            isAvailable: true,
                            startTime: currentFieldValue?.startTime || '09:00',
                            endTime: currentFieldValue?.endTime || '18:00'
                          };
                          
                          // Use setValue instead of accessing internal _subjects
                          setValue(fieldPath as any, defaultDaySchedule);
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
                    <GroomingMobileTimeSlots dayId={dayId} control={control} />
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

export default GroomingMobileAvailabilityView;
