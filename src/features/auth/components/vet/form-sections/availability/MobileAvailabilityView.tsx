
import React from 'react';
import { Controller } from 'react-hook-form';
import { DaySchedule } from '../../../../types/veterinarianTypes';
import { Switch } from '@/ui/atoms/switch';
import { 
  Accordion,
  AccordionContent,
  AccordionItem, 
  AccordionTrigger 
} from '@/ui/molecules/accordion';
import MobileTimeSlots from './MobileTimeSlots';
import { WEEKDAYS } from './constants';
import { AvailabilitySectionProps } from './types';

const MobileAvailabilityView: React.FC<AvailabilitySectionProps> = ({ control }) => {
  return (
    <div className="md:hidden">
      <Accordion type="single" collapsible className="w-full">
        {WEEKDAYS.map((day) => (
          <AccordionItem key={day.id} value={day.id}>
            <AccordionTrigger className="flex justify-between items-center px-4 py-3">
              <div className="flex items-center space-x-3">
                <span className="font-medium">{day.label}</span>
                <Controller
                  name={`availability.${day.id}` as any}
                  control={control}
                  defaultValue={{ isAvailable: false, startTime: '09:00', endTime: '18:00' } as DaySchedule}
                  render={({ field }) => {
                    // Since we're using `as any` for the name, we need to ensure type safety here
                    const daySchedule = field.value as DaySchedule | undefined;
                    
                    return (
                      <Switch
                        checked={daySchedule?.isAvailable ?? false}
                        onCheckedChange={(checked) => {
                          field.onChange({
                            ...daySchedule,
                            isAvailable: checked
                          });
                        }}
                        id={`${day.id}-available-mobile`}
                      />
                    );
                  }}
                />
              </div>
            </AccordionTrigger>

            <AccordionContent className="px-4 pb-4">
              <MobileTimeSlots dayId={day.id} control={control} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default MobileAvailabilityView;
