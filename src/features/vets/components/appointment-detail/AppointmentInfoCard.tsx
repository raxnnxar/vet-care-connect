
import React from 'react';
import { Card } from '@/ui/molecules/card';
import { Calendar, Clock, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface AppointmentInfoCardProps {
  appointment: any;
  getStatusBadge: (status: string) => JSX.Element;
}

const AppointmentInfoCard: React.FC<AppointmentInfoCardProps> = ({
  appointment,
  getStatusBadge
}) => {
  const formatAppointmentDate = (dateData: any) => {
    try {
      if (typeof dateData === 'string') {
        const date = new Date(dateData);
        return format(date, "d 'de' MMMM, yyyy", { locale: es });
      } else if (typeof dateData === 'object' && dateData !== null) {
        if (dateData.date) {
          // Parse the date as local date to avoid timezone issues
          const [year, month, day] = dateData.date.split('-').map(Number);
          const date = new Date(year, month - 1, day);
          return format(date, "d 'de' MMMM, yyyy", { locale: es });
        }
      }
      return 'Fecha no disponible';
    } catch (err) {
      return 'Fecha no disponible';
    }
  };
  
  const formatAppointmentTime = (dateData: any) => {
    try {
      if (typeof dateData === 'string') {
        const date = new Date(dateData);
        return format(date, "HH:mm", { locale: es });
      } else if (typeof dateData === 'object' && dateData !== null) {
        if (dateData.time) {
          return dateData.time;
        }
      }
      return 'Hora no disponible';
    } catch (err) {
      return 'Hora no disponible';
    }
  };
  
  const getServiceType = (serviceType: any) => {
    if (typeof serviceType === 'string') {
      return serviceType;
    } else if (typeof serviceType === 'object' && serviceType !== null) {
      return serviceType.name || serviceType.type || 'Servicio no especificado';
    }
    return 'Servicio no especificado';
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium text-[#1F2937] flex items-center">
          <Calendar className="mr-2 text-[#79D0B8]" size={20} />
          Información de la Cita
        </h2>
        {getStatusBadge(appointment.status)}
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center">
          <Calendar className="text-[#79D0B8] mr-3" size={16} />
          <div>
            <p className="text-sm text-gray-500">Fecha</p>
            <p className="font-medium">{formatAppointmentDate(appointment.appointment_date)}</p>
          </div>
        </div>
        <div className="flex items-center">
          <Clock className="text-[#79D0B8] mr-3" size={16} />
          <div>
            <p className="text-sm text-gray-500">Hora</p>
            <p className="font-medium">{formatAppointmentTime(appointment.appointment_date)}</p>
          </div>
        </div>
        <div className="flex items-center">
          <FileText className="text-[#79D0B8] mr-3" size={16} />
          <div>
            <p className="text-sm text-gray-500">Tipo de servicio</p>
            <p className="font-medium">{getServiceType(appointment.service_type)}</p>
          </div>
        </div>
        {appointment.reason && (
          <div className="flex items-start">
            <FileText className="text-[#79D0B8] mr-3 mt-0.5" size={16} />
            <div>
              <p className="text-sm text-gray-500">Motivo de la cita</p>
              <p className="font-medium">{appointment.reason}</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AppointmentInfoCard;
