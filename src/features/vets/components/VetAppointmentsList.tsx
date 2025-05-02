
import React from 'react';
import { Card } from '@/ui/molecules/card';
import { Button } from '@/ui/atoms/button';
import { Cat } from 'lucide-react';
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
  // Format the selected date for display
  const formattedSelectedDate = format(selectedDate, 'd MMMM', { locale: es });
  const isToday = isSameDay(selectedDate, new Date());
  
  const handleViewAppointment = (appointmentId: string) => {
    navigate(`/vet/appointments/${appointmentId}`);
  };
  
  return (
    <div>
      <h2 className="text-xl font-medium text-[#1F2937] mb-3">
        {isToday ? 
          "Tus próximas citas hoy" : 
          `Citas para ${formattedSelectedDate}`
        }
      </h2>
      <div className="space-y-3">
        {isLoading ? (
          <Card className="p-4 text-center">
            <div className="animate-pulse flex flex-col space-y-3">
              <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div className="h-24 bg-gray-200 rounded w-full"></div>
            </div>
          </Card>
        ) : appointments.length > 0 ? (
          appointments.map((appointment) => (
            <Card key={appointment.id} className="flex items-center justify-between p-3">
              <div className="flex items-center space-x-3">
                <div className="bg-gray-100 p-2 rounded-full">
                  <Cat size={24} className="text-[#4DA6A8]" />
                </div>
                <div>
                  <p className="font-medium text-lg">{appointment.petName}</p>
                  <p className="text-gray-500">{appointment.time}</p>
                </div>
              </div>
              <Button 
                className="bg-[#79D0B8] hover:bg-[#5FBFB3] text-white"
                onClick={() => handleViewAppointment(appointment.id)}
              >
                Ver
              </Button>
            </Card>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">
            No hay citas programadas para esta fecha
          </div>
        )}
      </div>
    </div>
  );
};

export default VetAppointmentsList;
