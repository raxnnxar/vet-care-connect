
import React from 'react';
import { formatDate } from '@/frontend/shared/utils/date';
import { Calendar, Clock } from 'lucide-react';
import { Badge } from '@/ui/atoms/badge';

const getStatusBadge = (status: string | undefined) => {
  const statusConfig = {
    confirmed: { color: 'bg-green-100 text-green-800', text: 'Confirmada' },
    pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pendiente' },
    completed: { color: 'bg-blue-100 text-blue-800', text: 'Completada' },
    cancelled: { color: 'bg-red-100 text-red-800', text: 'Cancelada' }
  };
  
  const config = status ? statusConfig[status as keyof typeof statusConfig] : statusConfig.pending;
  
  return (
    <Badge variant="outline" className={`${config.color} border-0`}>
      {config.text}
    </Badge>
  );
};

interface AppointmentHeaderProps {
  date: string;
  time: string;
  status: string | undefined;
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
        {getStatusBadge(status)}
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
