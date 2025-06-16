
import React from 'react';
import { Card } from '@/ui/molecules/card';
import { Cat, Clock, Calendar } from 'lucide-react';
import { Appointment } from '../api/vetAppointmentsApi';
import { format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

interface VetAppointmentsListProps {
  appointments: Appointment[];
  selectedDate: Date;
  isLoading: boolean;
}

const VetAppointmentsList: React.FC<VetAppointmentsListProps> = ({ 
  appointments, 
  selectedDate,
  isLoading
}) => {
  const navigate = useNavigate();
  const formattedSelectedDate = format(selectedDate, 'd MMMM', { locale: es });
  const isToday = isSameDay(selectedDate, new Date());

  const handleViewDetails = (appointmentId: string) => {
    console.log('Navigating to appointment details:', appointmentId);
    navigate(`/vet/detalles-cita/${appointmentId}`);
  };
  
  return (
    <div>
      <h2 className="text-xl font-medium text-[#1F2937] mb-3">
        {isToday ? 
          "Tus próximas citas hoy" : 
          `Citas programadas para ${formattedSelectedDate}`
        }
      </h2>
      
      {isLoading ? (
        <Card className="p-4 text-center">
          <div className="animate-pulse flex flex-col space-y-3">
            <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-24 bg-gray-200 rounded w-full"></div>
          </div>
        </Card>
      ) : appointments.length > 0 ? (
        <div className="overflow-x-auto">
          <div className="flex gap-3 pb-2" style={{ minWidth: 'fit-content' }}>
            {appointments.map((appointment) => (
              <Card 
                key={appointment.id} 
                className="flex-shrink-0 w-72 p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleViewDetails(appointment.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-[#79D0B8]/10 p-2 rounded-full">
                      <Cat size={24} className="text-[#4DA6A8]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-lg text-[#1F2937] truncate">{appointment.petName}</p>
                      <div className="flex items-center space-x-1 text-gray-500 text-sm">
                        <Clock size={14} />
                        <span>{appointment.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {appointment.reason && (
                  <div className="mb-3 p-2 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-600 font-medium">Motivo:</p>
                    <p className="text-sm text-gray-700">{appointment.reason}</p>
                  </div>
                )}
                
                <div className="flex justify-center items-center">
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Calendar size={12} />
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      Confirmada
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card className="p-6 text-center border border-gray-200">
          <div className="flex flex-col items-center space-y-3">
            <div className="bg-gray-100 p-3 rounded-full">
              <Calendar size={24} className="text-gray-400" />
            </div>
            <div>
              <p className="text-gray-500 font-medium">
                {isToday ? 
                  "No tienes citas confirmadas para hoy" : 
                  "No hay citas confirmadas para esta fecha"
                }
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Las citas aparecerán aquí una vez que las confirmes
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default VetAppointmentsList;
