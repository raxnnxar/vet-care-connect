
import { Calendar, Clock, MapPin, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card } from '@/ui/molecules/card';
import { AppointmentStatusBadge } from './AppointmentStatusBadge';
import { AppointmentStatusType } from '@/core/constants/app.constants';

interface AppointmentCardProps {
  appointment: {
    id: string;
    provider_name?: string;
    appointment_date: string | any;
    clinic_name?: string;
    location?: string;
    status: AppointmentStatusType;
    pet_name?: string;
    pets?: {
      name: string;
      id: string;
      profile_picture_url?: string;
    };
  };
  onClick: (id: string) => void;
}

const formatDateFromJsonb = (dateData: string | any) => {
  try {
    let dateToFormat: Date;
    
    if (typeof dateData === 'object' && dateData !== null) {
      // Handle JSONB format like {date: "2025-05-28", time: "13:30"}
      if (dateData.date && dateData.time) {
        dateToFormat = new Date(`${dateData.date}T${dateData.time}`);
      } else {
        dateToFormat = new Date();
      }
    } else if (typeof dateData === 'string') {
      dateToFormat = new Date(dateData);
    } else {
      dateToFormat = new Date();
    }
    
    return format(dateToFormat, "d 'de' MMMM',' yyyy", { locale: es });
  } catch (error) {
    console.error('Error formatting date:', error, dateData);
    return 'Fecha no válida';
  }
};

const formatTimeFromJsonb = (dateData: string | any) => {
  try {
    let dateToFormat: Date;
    
    if (typeof dateData === 'object' && dateData !== null) {
      // Handle JSONB format like {date: "2025-05-28", time: "13:30"}
      if (dateData.date && dateData.time) {
        dateToFormat = new Date(`${dateData.date}T${dateData.time}`);
      } else {
        dateToFormat = new Date();
      }
    } else if (typeof dateData === 'string') {
      dateToFormat = new Date(dateData);
    } else {
      dateToFormat = new Date();
    }
    
    return format(dateToFormat, 'HH:mm');
  } catch (error) {
    console.error('Error formatting time:', error, dateData);
    return 'Hora no válida';
  }
};

export const AppointmentCard = ({ appointment, onClick }: AppointmentCardProps) => {
  // Get pet name from different possible sources
  const petName = appointment.pet_name || appointment.pets?.name || 'Mascota';
  
  return (
    <Card 
      className="mb-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onClick(appointment.id)}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h3 className="font-medium text-lg">{petName}</h3>
            <p className="text-sm text-gray-500 mb-1">
              Veterinario: {appointment.provider_name || 'Por confirmar'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <AppointmentStatusBadge status={appointment.status} />
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        <div className="mt-3 space-y-2">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-[#79D0B8] mr-2" />
            <span className="text-sm">
              {appointment.appointment_date ? formatDateFromJsonb(appointment.appointment_date) : 'Fecha pendiente'}
            </span>
          </div>
          
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-[#79D0B8] mr-2" />
            <span className="text-sm">
              {appointment.appointment_date ? formatTimeFromJsonb(appointment.appointment_date) : 'Hora pendiente'}
            </span>
          </div>
          
          {(appointment.clinic_name || appointment.location) && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-[#79D0B8] mr-2" />
              <span className="text-sm">
                {appointment.clinic_name || appointment.location || 'Ubicación pendiente'}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
