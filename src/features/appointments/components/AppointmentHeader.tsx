
import React from 'react';
import { formatDate } from '@/frontend/shared/utils/date';
import { Calendar, Clock } from 'lucide-react';
import { AppointmentStatusBadge } from './AppointmentStatusBadge';
import { AppointmentStatusType } from '@/core/constants/app.constants';

interface AppointmentHeaderProps {
  date: string;
  time: string;
  status: AppointmentStatusType | undefined;
}

export const AppointmentHeader: React.FC<AppointmentHeaderProps> = ({
  date,
  time,
  status
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Detalles de la Cita</h2>
        {status && <AppointmentStatusBadge status={status} />}
      </div>
      
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-[#79D0B8]" />
          <span>{formatDate(date)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-[#79D0B8]" />
          <span>{time}</span>
        </div>
      </div>
    </div>
  );
};
