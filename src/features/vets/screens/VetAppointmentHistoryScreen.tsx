
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { Button } from '@/ui/atoms/button';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { Card } from '@/ui/molecules/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import LoadingSpinner from '@/frontend/ui/components/LoadingSpinner';

const VetAppointmentHistoryScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.auth);

  const { data: appointments, isLoading, error } = useQuery({
    queryKey: ['vet-appointment-history', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user ID provided');

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          appointment_date,
          status,
          pets!appointments_pet_id_fkey (
            id,
            name
          )
        `)
        .eq('provider_id', user.id)
        .in('status', ['completada', 'cancelada'])
        .order('appointment_date', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const goBack = () => navigate(-1);

  const handleAppointmentClick = (appointmentId: string) => {
    navigate(`/vet/detalles-cita/${appointmentId}`);
  };

  const formatAppointmentDate = (appointmentDate: any) => {
    try {
      let dateToFormat: Date;
      
      if (typeof appointmentDate === 'string') {
        dateToFormat = new Date(appointmentDate);
      } else if (typeof appointmentDate === 'object' && appointmentDate !== null) {
        const dateObj = appointmentDate as any;
        if (dateObj.date && dateObj.time) {
          dateToFormat = new Date(`${dateObj.date}T${dateObj.time}`);
        } else {
          return 'Fecha no disponible';
        }
      } else {
        return 'Fecha no disponible';
      }
      
      if (isNaN(dateToFormat.getTime())) {
        return 'Fecha no disponible';
      }
      
      return format(dateToFormat, "d 'de' MMMM, yyyy", { locale: es });
    } catch (error) {
      console.error('Error formatting appointment date:', error);
      return 'Fecha no disponible';
    }
  };

  const formatAppointmentTime = (appointmentDate: any) => {
    try {
      let dateToFormat: Date;
      
      if (typeof appointmentDate === 'string') {
        dateToFormat = new Date(appointmentDate);
      } else if (typeof appointmentDate === 'object' && appointmentDate !== null) {
        const dateObj = appointmentDate as any;
        if (dateObj.date && dateObj.time) {
          dateToFormat = new Date(`${dateObj.date}T${dateObj.time}`);
        } else {
          return 'Hora no disponible';
        }
      } else {
        return 'Hora no disponible';
      }
      
      if (isNaN(dateToFormat.getTime())) {
        return 'Hora no disponible';
      }
      
      return format(dateToFormat, 'HH:mm');
    } catch (error) {
      console.error('Error formatting appointment time:', error);
      return 'Hora no disponible';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completada':
        return 'Completada';
      case 'cancelada':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completada':
        return 'text-green-600 bg-green-50';
      case 'cancelada':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <LayoutBase
      header={
        <div className="flex items-center px-4 py-3 bg-[#79D0B8]">
          <Button variant="ghost" size="icon" className="text-white" onClick={goBack}>
            <ArrowLeft />
          </Button>
          <h1 className="text-white font-medium text-lg ml-2">Historial de citas</h1>
        </div>
      }
      footer={<NavbarInferior activeTab="home" />}
    >
      <div className="p-4 pb-20">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">Error al cargar el historial de citas</p>
            <Button onClick={() => window.location.reload()}>
              Intentar de nuevo
            </Button>
          </div>
        ) : !appointments || appointments.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-[#4DA6A8] mb-4">Sin historial</h2>
              <p className="text-gray-600">
                No hay citas completadas o canceladas para mostrar.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600 text-sm mb-4">
              {appointments.length} cita{appointments.length !== 1 ? 's' : ''} en el historial
            </p>
            
            {appointments.map((appointment) => (
              <Card
                key={appointment.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleAppointmentClick(appointment.id)}
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-lg text-gray-900">
                        {appointment.pets?.name || 'Mascota'}
                      </h3>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span className="text-sm">
                            {formatAppointmentDate(appointment.appointment_date)}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="text-sm">
                            {formatAppointmentTime(appointment.appointment_date)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {getStatusLabel(appointment.status)}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </LayoutBase>
  );
};

export default VetAppointmentHistoryScreen;
