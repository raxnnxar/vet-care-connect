
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

const formatDate = (dateString: string | any) => {
  try {
    let dateToFormat: Date;
    
    if (typeof dateString === 'string') {
      dateToFormat = new Date(dateString);
    } else if (typeof dateString === 'object' && dateString !== null) {
      const dateObj = dateString as any;
      if (dateObj.date && dateObj.time) {
        dateToFormat = new Date(`${dateObj.date}T${dateObj.time}`);
      } else {
        console.warn('Invalid date object:', dateString);
        return 'Fecha pendiente';
      }
    } else {
      console.warn('Unknown date format:', dateString);
      return 'Fecha pendiente';
    }
    
    // Check if date is valid
    if (isNaN(dateToFormat.getTime())) {
      console.warn('Invalid date:', dateString);
      return 'Fecha pendiente';
    }
    
    return format(dateToFormat, "d 'de' MMMM, yyyy", { locale: es });
  } catch (error) {
    console.error('Error formatting date:', error, dateString);
    return 'Fecha pendiente';
  }
};

const formatTime = (dateString: string | any) => {
  try {
    let dateToFormat: Date;
    
    if (typeof dateString === 'string') {
      dateToFormat = new Date(dateString);
    } else if (typeof dateString === 'object' && dateString !== null) {
      const dateObj = dateString as any;
      if (dateObj.date && dateObj.time) {
        dateToFormat = new Date(`${dateObj.date}T${dateObj.time}`);
      } else {
        console.warn('Invalid time object:', dateString);
        return 'Hora pendiente';
      }
    } else {
      console.warn('Unknown time format:', dateString);
      return 'Hora pendiente';
    }
    
    // Check if date is valid
    if (isNaN(dateToFormat.getTime())) {
      console.warn('Invalid time:', dateString);
      return 'Hora pendiente';
    }
    
    return format(dateToFormat, 'HH:mm');
  } catch (error) {
    console.error('Error formatting time:', error, dateString);
    return 'Hora pendiente';
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
              {formatDate(appointment.appointment_date)}
            </span>
          </div>
          
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-[#79D0B8] mr-2" />
            <span className="text-sm">
              {formatTime(appointment.appointment_date)}
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
