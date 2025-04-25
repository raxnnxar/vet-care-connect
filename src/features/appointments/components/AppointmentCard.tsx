
import { Calendar, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card } from '@/ui/molecules/card';
import { Badge } from '@/ui/atoms/badge';

interface AppointmentCardProps {
  appointment: {
    id: string;
    provider_name: string;
    appointment_date: string;
    clinic_name?: string;
    location?: string;
    status: string;
    pets?: {
      name: string;
      id: string;
      profile_picture_url?: string;
    };
  };
  onClick: (id: string) => void;
}

const getStatusConfig = (status: string) => {
  const statusConfig = {
    confirmed: { className: 'bg-green-100 text-green-800', text: 'Confirmada' },
    pending: { className: 'bg-yellow-100 text-yellow-800', text: 'Pendiente' },
    completed: { className: 'bg-blue-100 text-blue-800', text: 'Completada' },
    cancelled: { className: 'bg-red-100 text-red-800', text: 'Cancelada' }
  };
  
  return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
};

const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), "d 'de' MMMM',' yyyy", { locale: es });
  } catch (error) {
    console.error('Error formatting date:', error, dateString);
    return 'Fecha no válida';
  }
};

export const AppointmentCard = ({ appointment, onClick }: AppointmentCardProps) => {
  const statusConfig = getStatusConfig(appointment.status);
  
  return (
    <Card 
      key={appointment.id} 
      className="mb-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onClick(appointment.id)}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium">{appointment.provider_name || 'Veterinario'}</h3>
          <Badge className={statusConfig.className}>
            {statusConfig.text}
          </Badge>
        </div>
        
        <p className="text-sm text-gray-500 mb-1">
          Para: {appointment.pets?.name || 'Mascota'}
        </p>
        
        <div className="mt-3 space-y-2">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-[#79D0B8] mr-2" />
            <span className="text-sm">
              {appointment.appointment_date ? formatDate(appointment.appointment_date) : 'Fecha pendiente'}
            </span>
          </div>
          
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-[#79D0B8] mr-2" />
            <span className="text-sm">
              {appointment.appointment_date ? format(new Date(appointment.appointment_date), 'HH:mm') : 'Hora pendiente'}
            </span>
          </div>
          
          <div className="flex items-center">
            <MapPin className="h-4 w-4 text-[#79D0B8] mr-2" />
            <span className="text-sm">
              {appointment.clinic_name || appointment.location || 'Ubicación pendiente'}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
