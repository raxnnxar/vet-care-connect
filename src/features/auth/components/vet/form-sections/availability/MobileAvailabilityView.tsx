
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { VeterinarianProfile } from '../../../../types/veterinarianTypes';
import { Switch } from '@/ui/atoms/switch';
import MobileTimeSlots from './MobileTimeSlots';
import { WEEKDAYS } from './constants';
import { AvailabilitySectionProps, WeekDay } from './types';

const MobileAvailabilityView: React.FC<AvailabilitySectionProps> = ({ control }) => {
  const { setValue } = useFormContext<VeterinarianProfile>();

  return (
    <div className="md:hidden">
      <div className="divide-y border rounded-lg">
        {WEEKDAYS.map((day) => (
          <div key={day.id} className="p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium text-base">{day.label}</span>
              <Controller
                name={`availability.${day.id}.isAvailable` as any}
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      
                      // Si se activa la disponibilidad, aseguramos que se establezcan los valores predeterminados
                      if (checked) {
                        setValue(`availability.${day.id}`, {
                          isAvailable: true,
                          startTime: '09:00',
                          endTime: '18:00'
                        }, { shouldValidate: true });
                      }
                    }}
                    id={`${day.id}-available-mobile`}
                  />
                )}
              />
            </div>
            
            <Controller
              name={`availability.${day.id}.isAvailable` as any}
              control={control}
              defaultValue={false}
              render={({ field }) => (
                field.value ? (
                  <MobileTimeSlots dayId={day.id} control={control} />
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
