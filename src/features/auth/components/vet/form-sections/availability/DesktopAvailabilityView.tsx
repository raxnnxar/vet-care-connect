
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { WEEKDAYS } from './constants';
import DayScheduleRow from './DayScheduleRow';
import { AvailabilitySectionProps, WeekDay } from './types';
import { VeterinarianProfile } from '@/features/auth/types/veterinarianTypes';

const DesktopAvailabilityView: React.FC<AvailabilitySectionProps> = ({ control }) => {
  // Get setValue from form context to pass to DayScheduleRow
  const { setValue } = useFormContext<VeterinarianProfile>();

  return (
    <div className="hidden md:block">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
              Día
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Horario
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
              Disponible
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {WEEKDAYS.map((day) => (
            <DayScheduleRow 
              key={day.id} 
              day={day as WeekDay} 
              control={control} 
              setValue={setValue}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DesktopAvailabilityView;
