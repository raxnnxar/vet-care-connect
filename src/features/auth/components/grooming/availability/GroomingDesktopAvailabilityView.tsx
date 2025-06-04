
import React from 'react';
import { Control, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { GroomingProfile } from '../../../types/groomingTypes';
import { WEEKDAYS } from '../../vet/form-sections/availability/constants';
import GroomingDayScheduleRow from './GroomingDayScheduleRow';

interface GroomingDesktopAvailabilityViewProps {
  control: Control<GroomingProfile>;
  errors: FieldErrors<GroomingProfile>;
  setValue: UseFormSetValue<GroomingProfile>;
}

const GroomingDesktopAvailabilityView: React.FC<GroomingDesktopAvailabilityViewProps> = ({ 
  control,
  setValue
}) => {
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
            <GroomingDayScheduleRow key={day.id} day={day} control={control} setValue={setValue} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GroomingDesktopAvailabilityView;
