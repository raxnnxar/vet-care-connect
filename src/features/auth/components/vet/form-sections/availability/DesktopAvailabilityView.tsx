
import React from 'react';
import { WEEKDAYS } from './constants';
import DayScheduleRow from './DayScheduleRow';
import { AvailabilitySectionProps } from './types';

const DesktopAvailabilityView: React.FC<AvailabilitySectionProps> = ({ control }) => {
  return (
    <div className="hidden md:block">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
              Día
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
              Disponible
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Horario
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {WEEKDAYS.map((day) => (
            <DayScheduleRow key={day.id} day={day} control={control} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DesktopAvailabilityView;
