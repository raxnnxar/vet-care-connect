
import React from 'react';
import { Badge } from '@/ui/atoms/badge';
import { AppointmentStatusType, APPOINTMENT_STATUS } from '@/core/constants/app.constants';
import { CalendarCheck, Check, X, Repeat, UserX, Clock } from 'lucide-react';

interface AppointmentStatusBadgeProps {
  status: AppointmentStatusType;
  showIcon?: boolean;
  className?: string;
}

export const AppointmentStatusBadge: React.FC<AppointmentStatusBadgeProps> = ({
  status,
  showIcon = true,
  className = '',
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case APPOINTMENT_STATUS.PENDING:
        return {
          label: 'Pendiente',
          color: 'bg-yellow-100 text-yellow-800',
          icon: <Clock className="h-3 w-3 mr-1" />
        };
      case APPOINTMENT_STATUS.CONFIRMED:
        return {
          label: 'Confirmada',
          color: 'bg-green-100 text-green-800',
          icon: <CalendarCheck className="h-3 w-3 mr-1" />
        };
      case APPOINTMENT_STATUS.COMPLETED:
        return {
          label: 'Completada',
          color: 'bg-blue-100 text-blue-800',
          icon: <Check className="h-3 w-3 mr-1" />
        };
      case APPOINTMENT_STATUS.CANCELLED:
        return {
          label: 'Cancelada',
          color: 'bg-red-100 text-red-800',
          icon: <X className="h-3 w-3 mr-1" />
        };
      case APPOINTMENT_STATUS.RESCHEDULED:
        return {
          label: 'Reprogramada',
          color: 'bg-purple-100 text-purple-800',
          icon: <Repeat className="h-3 w-3 mr-1" />
        };
      case APPOINTMENT_STATUS.NO_SHOW:
        return {
          label: 'No Asistió',
          color: 'bg-gray-100 text-gray-800',
          icon: <UserX className="h-3 w-3 mr-1" />
        };
      default:
        return {
          label: 'Desconocido',
          color: 'bg-gray-100 text-gray-500',
          icon: null
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Badge className={`${config.color} border-0 ${className}`}>
      {showIcon && config.icon}
      <span>{config.label}</span>
    </Badge>
  );
};
